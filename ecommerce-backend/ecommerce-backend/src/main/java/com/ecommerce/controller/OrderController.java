package com.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.CancelOrderRequest;
import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.CheckoutResponse;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.Order;
import com.ecommerce.service.CheckoutService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.SePayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;
    private final SePayService sePayService;

    // ======================
    // 1. CHECKOUT
    // ======================
    @PostMapping("/checkout")
    public CheckoutResponse checkout(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId,
            @RequestBody CheckoutRequest req
    ) {
        Order order = checkoutService.checkout(userId, sessionId, req);
        
        // Nếu là SEPAY, tạo payment URL hoặc QR code
        String paymentUrl = null;
        String qrCode = null;
        boolean requiresPayment = false;
        
        String bankName = null;
        String accountNumber = null;
        String accountName = null;
        String paymentReference = null;
        Map<String, String> paymentFormFields = null;
        
        if ("SEPAY".equals(req.getPaymentMethod())) {
            try {
                // Tạo paymentReference ngay từ đầu (DH{orderId})
                paymentReference = "DH" + order.getId();
                
                // Lưu paymentReference vào Order ngay để có thể tra cứu khi webhook đến
                order.setPaymentReference(paymentReference);
                orderService.saveOrder(order); // Lưu lại Order với paymentReference
                
                // Thử dùng Payment Gateway API trước (nếu đã cấu hình)
                Map<String, Object> paymentGateway = sePayService.createPaymentGatewayCheckout(order);
                String paymentType = (String) paymentGateway.get("type");
                
                if ("gateway".equals(paymentType)) {
                    // Dùng Payment Gateway API
                    paymentUrl = (String) paymentGateway.get("checkoutUrl");
                    @SuppressWarnings("unchecked")
                    Map<String, String> formFields = (Map<String, String>) paymentGateway.get("formFields");
                    paymentFormFields = formFields;
                    requiresPayment = true;
                    // Payment Gateway sẽ tự xử lý, không cần QR code
                } else {
                    // Fallback về QR template (nếu chưa cấu hình Payment Gateway)
                    qrCode = (String) paymentGateway.get("qrCode");
                    requiresPayment = (qrCode != null && !qrCode.isEmpty());
                    
                    // Lấy thông tin tài khoản ngân hàng để hiển thị
                    bankName = sePayService.getBankName();
                    accountNumber = sePayService.getAccountNumber();
                    accountName = sePayService.getAccountName();
                }
            } catch (Exception e) {
                // Log error nhưng vẫn trả về order
                System.err.println("Lỗi tạo SEPAY payment: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        return new CheckoutResponse(order, paymentUrl, qrCode, requiresPayment, bankName, accountNumber, accountName, paymentReference, paymentFormFields);
    }


    // ======================
    // 2. LIST ORDER (STEP 8)
    // ======================
    @GetMapping
    public List<Order> getOrders(
            @RequestParam Long userId,
            @RequestParam(required = false) String status
    ) {
        if (status == null || status.isBlank()) {
            return orderService.getOrdersByUser(userId);
        }

        OrderStatus st = OrderStatus.valueOf(status.toUpperCase());
        return orderService.getOrdersByUserAndStatus(userId, st);
    }

    // ======================
    // 3. ORDER DETAIL
    // ======================
    @GetMapping("/{orderId}")
    public Order getOrderDetail(
            @PathVariable Long orderId,
            @RequestParam Long userId
    ) {
        return orderService.getOrderDetail(orderId, userId);
    }

    // ======================
    // 4. CANCEL ORDER (STEP 9)
    // ======================
    @PostMapping("/{orderId}/cancel")
    public Order cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long userId,
            @RequestBody(required = false) CancelOrderRequest req
    ) {
        String reason = (req != null ? req.getReason() : null);
        return orderService.cancelOrder(orderId, userId, reason);
    }

    // ======================
    // 5. MANUAL PAYMENT VERIFICATION (Khi webhook không hoạt động)
    // ======================
    @PostMapping("/{orderId}/verify-payment")
    public Map<String, Object> verifyPayment(
            @PathVariable Long orderId,
            @RequestParam Long userId
    ) {
        try {
            Order order = orderService.getOrderDetail(orderId, userId);
            
            // Chỉ cho phép verify order đang PENDING và payment method là SEPAY
            if (order.getOrderStatus() != OrderStatus.PENDING) {
                return Map.of(
                    "success", false,
                    "message", "Order đã được xử lý rồi (Status: " + order.getOrderStatus() + ")"
                );
            }
            
            if (!"SEPAY".equals(order.getPaymentMethod())) {
                return Map.of(
                    "success", false,
                    "message", "Chỉ có thể verify payment cho đơn hàng SEPAY"
                );
            }
            
            // Cập nhật order status thành PAID
            order = orderService.updateOrderStatus(orderId, OrderStatus.PAID, "Manual payment verification - Webhook không hoạt động");
            
            System.out.println("✅ Manual payment verification: Order #" + orderId + " đã được cập nhật thành PAID");
            
            return Map.of(
                "success", true,
                "message", "Đơn hàng đã được xác nhận thanh toán thành công",
                "order", order
            );
        } catch (Exception e) {
            System.err.println("❌ Error verifying payment for order #" + orderId + ": " + e.getMessage());
            e.printStackTrace();
            return Map.of(
                "success", false,
                "message", "Lỗi khi xác nhận thanh toán: " + e.getMessage()
            );
        }
    }
}

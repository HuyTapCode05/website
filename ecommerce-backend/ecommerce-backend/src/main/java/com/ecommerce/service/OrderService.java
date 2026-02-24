package com.ecommerce.service;

import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderStatusHistory;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.OrderStatusHistoryRepository;
import com.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // ======================
    // LẤY DANH SÁCH ĐƠN HÀNG
    // ======================
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByUserAndStatus(Long userId, OrderStatus status) {
        return orderRepository.findByUserIdAndOrderStatus(userId, status);
    }

    // ======================
    // CHI TIẾT ĐƠN HÀNG
    // ======================
    public Order getOrderDetail(Long orderId, Long userId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Permission denied: This order does not belong to you");
        }

        return order;
    }

    // ======================
    // HỦY ĐƠN HÀNG
    // ======================
    public Order cancelOrder(Long orderId, Long userId, String reason) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Kiểm tra đơn có phải của user không
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này");
        }

        // Kiểm tra trạng thái được phép hủy
        OrderStatus current = order.getOrderStatus();

        switch (current) {
            case PENDING:
            case PAID:
            case PROCESSING:
                break;
            default:
                throw new RuntimeException("Không thể hủy đơn hàng khi đang ở trạng thái: " + current);
        }

        // Cập nhật trạng thái
        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // Lưu history
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .fromStatus(current)
                .toStatus(OrderStatus.CANCELLED)
                .note((reason != null && !reason.isBlank())
                        ? reason
                        : "Người dùng đã hủy đơn hàng")
                .build();

        historyRepository.save(history);

        // ================================
        // GỬI THÔNG BÁO TIẾNG VIỆT
        // ================================
        User user = userRepository.findById(userId).orElse(null);
        String email = user != null ? user.getEmail() : null;

        // In-app
        notificationService.sendInApp(
                userId,
                "Đơn hàng #" + order.getOrderNo() + " đã bị hủy",
                "Đơn hàng đã được hủy thành công. Lý do: " +
                        (reason != null ? reason : "Không có lý do")
        );

        // Email
        String emailHtml = notificationService.buildOrderCancellationEmail(
                order.getOrderNo(),
                reason != null ? reason : "Không có lý do"
        );
        notificationService.sendEmail(
                email,
                "Hủy đơn hàng #" + order.getOrderNo(),
                emailHtml
        );

        return order;
    }

    // ======================
    // LƯU ĐƠN HÀNG
    // ======================
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    // ======================
    // HÀM UPDATE STATUS (DÙNG CHO ADMIN)
    // ======================
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, String note) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        OrderStatus oldStatus = order.getOrderStatus();

        order.setOrderStatus(newStatus);
        
        // Nếu chuyển sang PAID, lưu thông tin thanh toán
        if (newStatus == OrderStatus.PAID && oldStatus != OrderStatus.PAID) {
            order.setPaidAt(java.time.LocalDateTime.now());
            // Tính số tiền thanh toán (total + shipping - discount)
            if (order.getPaymentAmount() == null) {
                java.math.BigDecimal paymentAmount = order.getTotalAmount()
                        .add(order.getShippingFee() != null ? order.getShippingFee() : java.math.BigDecimal.ZERO)
                        .subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : java.math.BigDecimal.ZERO);
                order.setPaymentAmount(paymentAmount);
            }
            // Nếu chưa có payment reference, tạo từ orderNo
            if (order.getPaymentReference() == null || order.getPaymentReference().isBlank()) {
                order.setPaymentReference("DH" + order.getId());
            }
        }
        
        orderRepository.save(order);

        // Lưu history
        historyRepository.save(
                OrderStatusHistory.builder()
                        .order(order)
                        .fromStatus(oldStatus)
                        .toStatus(newStatus)
                        .note(note)
                        .build()
        );

        // THÔNG BÁO TIẾNG VIỆT CHO USER
        Long userId = order.getUserId();
        User user = userRepository.findById(userId).orElse(null);
        String email = user != null ? user.getEmail() : null;

        String vnMessage = "";

        switch (newStatus) {
            case SHIPPED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã được giao cho đơn vị vận chuyển.";
                break;

            case DELIVERED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã giao thành công!";
                break;

            case RETURNED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã được xác nhận trả hàng.";
                break;

            case REFUNDED:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã được hoàn tiền.";
                break;

            default:
                vnMessage = "Đơn hàng #" + order.getOrderNo() + " đã chuyển sang trạng thái: " + newStatus;
        }

        // In-app
        notificationService.sendInApp(
                userId,
                "Cập nhật đơn hàng",
                vnMessage
        );

        // Email
        String emailHtml = notificationService.buildOrderUpdateEmail(
                order.getOrderNo(),
                newStatus.toString(),
                vnMessage
        );
        notificationService.sendEmail(
                email,
                "Cập nhật đơn hàng #" + order.getOrderNo(),
                emailHtml
        );

        return order;
    }
}

package com.ecommerce.service;

import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.enums.CouponType;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CartService cartService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final CouponRepository couponRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Order checkout(Long userId, String sessionId, CheckoutRequest req) {

        CartResponse cart = cartService.getCart(sessionId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống!");
        }

        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingFee = BigDecimal.valueOf(30000);
        BigDecimal discount = BigDecimal.ZERO;

        Coupon coupon = null;

        // =====================================================
        // CHECK COUPON
        // =====================================================
        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {

            coupon = couponRepository.findByCode(req.getCouponCode())
                    .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

            if (!Boolean.TRUE.equals(coupon.getActive())) {
                throw new RuntimeException("Mã giảm giá không hoạt động");
            }

            LocalDateTime now = LocalDateTime.now();
            if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt())) {
                throw new RuntimeException("Mã giảm giá chưa bắt đầu");
            }
            if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt())) {
                throw new RuntimeException("Mã giảm giá đã hết hạn");
            }

            if (coupon.getUsageLimit() != null &&
                    coupon.getUsedCount() >= coupon.getUsageLimit()) {
                throw new RuntimeException("Mã giảm giá đã sử dụng hết");
            }

            if (coupon.getMinimumOrderAmount() != null &&
                    total.compareTo(BigDecimal.valueOf(coupon.getMinimumOrderAmount())) < 0) {
                throw new RuntimeException("Không đủ điều kiện áp dụng mã");
            }

            // =====================================================
            // APPLY DISCOUNT
            // =====================================================
            if (coupon.getType() == CouponType.PERCENT) {
                discount = total
                        .multiply(BigDecimal.valueOf(coupon.getValue()))
                        .divide(BigDecimal.valueOf(100));
            }

            else if (coupon.getType() == CouponType.FIXED) {
                discount = BigDecimal.valueOf(coupon.getValue());
            }

            else if (coupon.getType() == CouponType.FREESHIP) {
                shippingFee = BigDecimal.ZERO;
            }
        }

        BigDecimal finalAmount = total.subtract(discount);

        String orderNo = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = Order.builder()
                .orderNo(orderNo)
                .userId(userId)
                .totalAmount(finalAmount)
                .shippingFee(shippingFee)
                .discountAmount(discount)
                .paymentMethod(req.getPaymentMethod())
                .orderStatus(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .couponCode(req.getCouponCode()) // FIELD ĐÃ TỒN TẠI
                .build();

        order = orderRepository.save(order);

        // Save order items
        for (CartItemResponse ci : cart.getItems()) {

            Product product = productRepository.findById(ci.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            orderItemRepository.save(
                    OrderItem.builder()
                            .order(order)
                            .product(product)
                            .price(ci.getPrice())
                            .quantity(ci.getQuantity())
                            .subtotal(ci.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                            .build()
            );
        }

        // Save history
        historyRepository.save(
                OrderStatusHistory.builder()
                        .order(order)
                        .fromStatus(null)
                        .toStatus(OrderStatus.PENDING)
                        .note("Tạo đơn hàng")
                        .build()
        );

        // Update coupon count
        if (coupon != null) {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }

        cart.getItems().clear();

        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            notificationService.sendInApp(
                    userId,
                    "Đặt hàng thành công",
                    "Đơn hàng #" + orderNo + " đã được tạo thành công."
            );

            // Tạo HTML email đẹp
            String emailHtml = notificationService.buildOrderConfirmationEmail(order, orderNo);
            notificationService.sendEmail(
                    user.getEmail(),
                    "Xác nhận đơn hàng #" + orderNo,
                    emailHtml
            );
        }

        return order;
    }
}

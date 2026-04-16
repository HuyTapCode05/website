package com.ecommerce.service;

import com.ecommerce.config.NotificationConfig;
import com.ecommerce.model.Notification;
import com.ecommerce.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;
    private final NotificationConfig config;

    // ===========================
    // Gửi email HTML
    // ===========================
    public void sendEmail(String to, String subject, String htmlContent) {

        if (!config.isEmailEnabled()) {
            System.out.println("❌ ADMIN đã tắt chức năng gửi Email");
            return;
        }

        if (to == null || to.isBlank()) {
            System.out.println("⚠️  Email không hợp lệ, bỏ qua gửi email");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); 

            mailSender.send(message);
            System.out.println("📩 Email đã gửi: " + to);

        } catch (Exception e) {
            System.out.println("❌ Lỗi gửi email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ===========================
    // Gửi thông báo in-app
    // ===========================
    public void sendInApp(Long userId, String title, String message) {

        if (!config.isInappEnabled()) {
            System.out.println("❌ ADMIN đã tắt thông báo in-app");
            return;
        }

        Notification n = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .seen(false)
                .build();

        notificationRepository.save(n);
    }

    // ===========================
    // Đọc template HTML từ file
    // ===========================
    private String loadTemplate(String templateName) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/" + templateName);
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Không thể đọc email template: " + templateName, e);
        }
    }

    // ===========================
    // Email Templates
    // ===========================
    
    /**
     * Template email xác nhận đơn hàng
     */
    public String buildOrderConfirmationEmail(com.ecommerce.model.Order order, String orderNo) {
        java.math.BigDecimal total = order.getTotalAmount()
                .add(order.getShippingFee() != null ? order.getShippingFee() : java.math.BigDecimal.ZERO)
                .subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : java.math.BigDecimal.ZERO);

        return loadTemplate("order-confirmation.html")
                .replace("{{orderNo}}", orderNo)
                .replace("{{createdAt}}", order.getCreatedAt().toString())
                .replace("{{paymentMethod}}", getPaymentMethodLabel(order.getPaymentMethod()))
                .replace("{{totalAmount}}", order.getTotalAmount().toPlainString())
                .replace("{{shippingFee}}", order.getShippingFee() != null ? order.getShippingFee().toPlainString() : "0")
                .replace("{{discount}}", order.getDiscountAmount() != null ? order.getDiscountAmount().toPlainString() : "0")
                .replace("{{finalTotal}}", total.toPlainString());
    }

    /**
     * Template email hủy đơn hàng
     */
    public String buildOrderCancellationEmail(String orderNo, String reason) {
        return loadTemplate("order-cancellation.html")
                .replace("{{orderNo}}", orderNo)
                .replace("{{reason}}", reason != null && !reason.isBlank() ? reason : "Không có lý do");
    }

    /**
     * Template email cập nhật đơn hàng
     */
    public String buildOrderUpdateEmail(String orderNo, String status, String message) {
        String statusColor = switch (status) {
            case "SHIPPED" -> "#f39c12";
            case "DELIVERED" -> "#27ae60";
            case "RETURNED" -> "#e74c3c";
            case "REFUNDED" -> "#3498db";
            default -> "#95a5a6";
        };

        return loadTemplate("order-update.html")
                .replace("{{statusColor}}", statusColor)
                .replace("{{orderNo}}", orderNo)
                .replace("{{statusLabel}}", getStatusLabel(status))
                .replace("{{message}}", message);
    }

    private String getPaymentMethodLabel(String method) {
        return switch (method) {
            case "COD" -> "Thanh toán khi nhận hàng";
            case "SEPAY", "BANKING" -> "Chuyển khoản ngân hàng";
            default -> method;
        };
    }

    private String getStatusLabel(String status) {
        return switch (status) {
            case "PENDING" -> "Chờ xác nhận";
            case "PAID" -> "Đã thanh toán";
            case "PROCESSING" -> "Đang xử lý";
            case "SHIPPED" -> "Đang giao hàng";
            case "DELIVERED" -> "Đã giao hàng";
            case "CANCELLED" -> "Đã hủy";
            case "RETURNED" -> "Đã trả hàng";
            case "REFUNDED" -> "Đã hoàn tiền";
            default -> status;
        };
    }
}

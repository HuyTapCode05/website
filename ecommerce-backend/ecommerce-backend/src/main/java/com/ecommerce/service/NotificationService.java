package com.ecommerce.service;

import com.ecommerce.config.NotificationConfig;
import com.ecommerce.model.Notification;
import com.ecommerce.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

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
            helper.setText(htmlContent, true); // true = HTML content

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
    // Email Templates
    // ===========================
    
    /**
     * Template email xác nhận đơn hàng
     */
    public String buildOrderConfirmationEmail(com.ecommerce.model.Order order, String orderNo) {
        java.math.BigDecimal total = order.getTotalAmount()
                .add(order.getShippingFee() != null ? order.getShippingFee() : java.math.BigDecimal.ZERO)
                .subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : java.math.BigDecimal.ZERO);
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .info-row:last-child { border-bottom: none; }
                    .label { font-weight: bold; color: #666; }
                    .value { color: #333; }
                    .total { font-size: 20px; font-weight: bold; color: #e74c3c; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Đặt hàng thành công!</h1>
                        <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi</p>
                    </div>
                    <div class="content">
                        <h2>Thông tin đơn hàng</h2>
                        <div class="order-info">
                            <div class="info-row">
                                <span class="label">Mã đơn hàng:</span>
                                <span class="value"><strong>#%s</strong></span>
                            </div>
                            <div class="info-row">
                                <span class="label">Ngày đặt:</span>
                                <span class="value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Phương thức thanh toán:</span>
                                <span class="value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Tổng tiền hàng:</span>
                                <span class="value">%s₫</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Phí vận chuyển:</span>
                                <span class="value">%s₫</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Giảm giá:</span>
                                <span class="value">-%s₫</span>
                            </div>
                            <div class="info-row">
                                <span class="label total">Tổng thanh toán:</span>
                                <span class="value total">%s₫</span>
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <a href="#" class="button">Xem chi tiết đơn hàng</a>
                        </div>
                        <p style="margin-top: 30px; color: #666;">
                            Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất. 
                            Bạn sẽ nhận được thông báo khi đơn hàng được cập nhật.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2026 Cửa hàng của chúng tôi. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                orderNo,
                order.getCreatedAt().toString(),
                getPaymentMethodLabel(order.getPaymentMethod()),
                order.getTotalAmount().toPlainString(),
                order.getShippingFee() != null ? order.getShippingFee().toPlainString() : "0",
                order.getDiscountAmount() != null ? order.getDiscountAmount().toPlainString() : "0",
                total.toPlainString()
            );
    }

    /**
     * Template email hủy đơn hàng
     */
    public String buildOrderCancellationEmail(String orderNo, String reason) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #f093fb 0%%, #f5576c 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; }
                    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>⚠️ Đơn hàng đã bị hủy</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào,</p>
                        <p>Đơn hàng <strong>#%s</strong> của bạn đã được hủy.</p>
                        <div class="info-box">
                            <p><strong>Lý do hủy:</strong></p>
                            <p>%s</p>
                        </div>
                        <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                    </div>
                    <div class="footer">
                        <p>© 2026 Cửa hàng của chúng tôi. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(orderNo, reason != null && !reason.isBlank() ? reason : "Không có lý do");
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
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .status-badge { display: inline-block; padding: 10px 20px; background: %s; color: white; border-radius: 20px; font-weight: bold; margin: 20px 0; }
                    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📦 Cập nhật đơn hàng</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào,</p>
                        <p>Đơn hàng <strong>#%s</strong> của bạn đã được cập nhật:</p>
                        <div style="text-align: center;">
                            <span class="status-badge">%s</span>
                        </div>
                        <p style="background: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
                            %s
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2026 Cửa hàng của chúng tôi. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(statusColor, orderNo, getStatusLabel(status), message);
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

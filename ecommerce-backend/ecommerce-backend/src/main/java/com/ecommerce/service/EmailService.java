package com.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML content

            mailSender.send(message);
            System.out.println("📩 Email đã gửi thành công: " + to);
        } catch (Exception e) {
            System.err.println("❌ Lỗi gửi email: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("   Nguyên nhân: " + e.getCause().getMessage());
            }
        }
    }

    /**
     * Template email xác thực tài khoản
     */
    public String buildVerificationEmail(String name, String verifyLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .button:hover { background: #5568d3; }
                    .link-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; word-break: break-all; }
                    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; color: #856404; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 28px;">🎉 Chào mừng bạn!</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Xác thực tài khoản của bạn</p>
                    </div>
                    <div class="content">
                        <p style="font-size: 16px;">Xin chào <strong>%s</strong>,</p>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại cửa hàng của chúng tôi!</p>
                        <p>Để hoàn tất đăng ký, vui lòng xác thực tài khoản bằng cách nhấn vào nút bên dưới:</p>
                        <div style="text-align: center;">
                            <a href="%s" class="button">Xác thực tài khoản</a>
                        </div>
                        <div class="link-box">
                            <p style="margin: 0; font-size: 12px; color: #666;">Hoặc copy link sau vào trình duyệt:</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #667eea;">%s</p>
                        </div>
                        <div class="warning">
                            <p style="margin: 0; font-size: 14px;"><strong>⚠️ Lưu ý:</strong> Link xác thực sẽ hết hạn sau 1 giờ.</p>
                        </div>
                        <p style="margin-top: 30px; color: #666; font-size: 14px;">
                            Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2026 Cửa hàng của chúng tôi. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(name, verifyLink, verifyLink);
    }

    /**
     * Template email đặt lại mật khẩu
     */
    public String buildResetPasswordEmail(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #f093fb 0%%, #f5576c 100%%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 15px 40px; background: #f5576c; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .button:hover { background: #e4465a; }
                    .link-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; word-break: break-all; }
                    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; color: #856404; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 28px;">🔐 Đặt lại mật khẩu</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Yêu cầu đặt lại mật khẩu</p>
                    </div>
                    <div class="content">
                        <p style="font-size: 16px;">Xin chào,</p>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                        <div style="text-align: center;">
                            <a href="%s" class="button">Đặt lại mật khẩu</a>
                        </div>
                        <div class="link-box">
                            <p style="margin: 0; font-size: 12px; color: #666;">Hoặc copy link sau vào trình duyệt:</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #f5576c;">%s</p>
                        </div>
                        <div class="warning">
                            <p style="margin: 0; font-size: 14px;"><strong>⚠️ Lưu ý:</strong> Link đặt lại mật khẩu sẽ hết hạn sau 15 phút.</p>
                            <p style="margin: 10px 0 0 0; font-size: 14px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2026 Cửa hàng của chúng tôi. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);
    }
}

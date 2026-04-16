package com.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

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

    /**
     * Template email xác thực tài khoản
     */
    public String buildVerificationEmail(String name, String verifyLink) {
        return loadTemplate("verification.html")
                .replace("{{name}}", name)
                .replace("{{verifyLink}}", verifyLink);
    }

    /**
     * Template email đặt lại mật khẩu
     */
    public String buildResetPasswordEmail(String resetLink) {
        return loadTemplate("reset-password.html")
                .replace("{{resetLink}}", resetLink);
    }
}

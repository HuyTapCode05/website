package com.ecommerce.service;

import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.LoginResponse;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ecommerce.util.JwtUtil;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    // REGISTER
    public String register(RegisterRequest req) {

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .role("ROLE_USER") 
                .enabled(false)
                .build();

        // Tạo token xác thực email
        String verifyToken = UUID.randomUUID().toString();
        user.setVerificationToken(verifyToken);
        user.setVerificationTokenExpiresAt(LocalDateTime.now().plusHours(1));

        userRepository.save(user);

        String link = "http://localhost:8080/auth/verify?token=" + verifyToken;

        String emailHtml = emailService.buildVerificationEmail(user.getName(), link);
        emailService.sendEmail(
                user.getEmail(),
                "Xác thực tài khoản",
                emailHtml
        );

        return "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.";
    }

    // LOGIN
    public LoginResponse login(LoginRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email.");
        }

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            token
        );

    }

    // VERIFY ACCOUNT
    public String verifyAccount(String token) {

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token hết hạn");
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);

        userRepository.save(user);

        return "Xác thực tài khoản thành công!";
    }

    // FORGOT PASSWORD
    public String forgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        String link = "http://localhost:8080/auth/reset?token=" + token;

        String emailHtml = emailService.buildResetPasswordEmail(link);
        emailService.sendEmail(
                email,
                "Đặt lại mật khẩu",
                emailHtml
        );

        return "Đã gửi email đặt lại mật khẩu.";
    }

    // RESET PASSWORD
    public String resetPassword(String token, String newPass) {

        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (user.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token hết hạn");
        }

        user.setPassword(encoder.encode(newPass));
        user.setResetPasswordToken(null);
        user.setResetTokenExpiresAt(null);

        userRepository.save(user);

        return "Đặt lại mật khẩu thành công!";
    }
}

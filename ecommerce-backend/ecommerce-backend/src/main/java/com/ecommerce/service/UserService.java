package com.ecommerce.service;

import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.LoginResponse;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ecommerce.util.JwtUtil;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @Value("${google.client.id}")
    private String googleClientId;

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
                emailHtml);

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
                token);

    }

    // ==============================
    // LOGIN WITH GOOGLE
    // ==============================
    public LoginResponse loginWithGoogle(String googleIdToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleIdToken);
            if (idToken == null) {
                throw new RuntimeException("Google token không hợp lệ");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String avatarUrl = (String) payload.get("picture");

            // Tìm user hoặc tạo mới
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // Tạo user mới (đã xác thực qua Google → enabled=true)
                user = User.builder()
                        .name(name != null ? name : "Google User")
                        .email(email)
                        .password(null) // Không cần password cho Google login
                        .avatarUrl(avatarUrl)
                        .role("ROLE_USER")
                        .enabled(true)
                        .build();
                userRepository.save(user);
            } else {
                // Cập nhật avatar nếu chưa có
                if (user.getAvatarUrl() == null && avatarUrl != null) {
                    user.setAvatarUrl(avatarUrl);
                    userRepository.save(user);
                }
                // Kích hoạt tài khoản nếu chưa (đã xác thực qua Google)
                if (!user.isEnabled()) {
                    user.setEnabled(true);
                    userRepository.save(user);
                }
            }

            String token = jwtUtil.generateToken(user);

            return new LoginResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    token);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xác thực Google: " + e.getMessage());
        }
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
                emailHtml);

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

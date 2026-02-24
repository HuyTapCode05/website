package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String phone;

    private String avatarUrl;

    // Account activation
    private boolean enabled = false;

    private String verificationToken;
    private LocalDateTime verificationTokenExpiresAt;

    // Reset password
    private String resetPasswordToken;
    private LocalDateTime resetTokenExpiresAt;

    private String role = "ROLE_USER";
}

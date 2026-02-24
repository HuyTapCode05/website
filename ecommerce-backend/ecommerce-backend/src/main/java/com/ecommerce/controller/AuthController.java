package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        return userService.register(req);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return userService.login(req);
    }

    @GetMapping("/verify")
    public String verify(@RequestParam String token) {
        return userService.verifyAccount(token);
    }

    @PostMapping("/forgot")
    public String forgot(@RequestParam String email) {
        return userService.forgotPassword(email);
    }

    @PostMapping("/reset")
    public String reset(
            @RequestParam String token,
            @RequestParam String newPassword) {
        return userService.resetPassword(token, newPassword);
    }
}

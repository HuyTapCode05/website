package com.ecommerce.controller;

import com.ecommerce.service.UserProfileService;
import com.ecommerce.dto.UserProfileResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService profileService;

    @GetMapping
    public UserProfileResponse getProfile(@RequestParam Long userId) {
        return profileService.getProfile(userId);
    }

    @PutMapping
    public String updateProfile(
            @RequestParam Long userId,
            @RequestParam String name,
            @RequestParam String phone
    ) {
        return profileService.updateProfile(userId, name, phone);
    }
}

package com.ecommerce.controller;

import com.ecommerce.model.Coupon;
import com.ecommerce.model.User;
import com.ecommerce.repository.CouponRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    /**
     * Lấy danh sách mã giảm giá khả dụng cho user hiện tại
     */
    @GetMapping("/available")
    public List<Coupon> getAvailable(@RequestParam(required = false) Long userId) {

        LocalDateTime now = LocalDateTime.now();
        String userRole = null;

        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                userRole = user.getRole();
            }
        }

        final String role = userRole;

        return couponRepository.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getActive()))
                .filter(c -> c.getStartAt() == null || !now.isBefore(c.getStartAt()))
                .filter(c -> c.getEndAt() == null || !now.isAfter(c.getEndAt()))
                .filter(c -> c.getUsageLimit() == null || (c.getUsedCount() != null && c.getUsedCount() < c.getUsageLimit()))
                .filter(c -> {
                    String target = c.getTargetRole();
                    if (target == null || target.isBlank() || "ALL".equalsIgnoreCase(target)) {
                        return true;
                    }
                    return target.equalsIgnoreCase(role);
                })
                .toList();
    }
}

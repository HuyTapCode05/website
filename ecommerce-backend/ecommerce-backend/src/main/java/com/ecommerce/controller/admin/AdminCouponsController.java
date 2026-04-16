package com.ecommerce.controller.admin;

import com.ecommerce.model.Coupon;
import com.ecommerce.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/coupons")
@RequiredArgsConstructor
public class AdminCouponsController {

    private final CouponRepository couponRepository;

    // ============================================
    // 🔥 LẤY DANH SÁCH TẤT CẢ COUPON
    // ============================================
    @GetMapping
    public List<Coupon> getAll() {
        return couponRepository.findAll();
    }

    // ============================================
    // 🔥 TẠO COUPON MỚI
    // ============================================
    @PostMapping
    public Coupon create(@RequestBody Coupon coupon) {

        coupon.setUsedCount(0); // mặc định chưa dùng

        if (coupon.getActive() == null) {
            coupon.setActive(true);
        }

        return couponRepository.save(coupon);
    }

    // ============================================
    // 🔥 SỬA COUPON
    // ============================================
    @PutMapping("/{id}")
    public Coupon update(
            @PathVariable Long id,
            @RequestBody Coupon updated
    ) {
        Coupon c = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy coupon"));

        c.setCode(updated.getCode());
        c.setType(updated.getType());
        c.setValue(updated.getValue());
        c.setMinimumOrderAmount(updated.getMinimumOrderAmount());
        c.setUsageLimit(updated.getUsageLimit());
        c.setStartAt(updated.getStartAt());
        c.setEndAt(updated.getEndAt());
        c.setActive(updated.getActive());
        c.setTargetRole(updated.getTargetRole());

        return couponRepository.save(c);
    }

    // ============================================
    // 🔥 XÓA COUPON
    // ============================================
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        if (!couponRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy coupon");
        }

        couponRepository.deleteById(id);
        return "Deleted";
    }
}

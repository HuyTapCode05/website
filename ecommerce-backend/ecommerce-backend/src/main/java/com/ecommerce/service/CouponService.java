package com.ecommerce.service;

import com.ecommerce.enums.CouponType;
import com.ecommerce.model.Coupon;
import com.ecommerce.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepo;

    public Coupon validate(String code, BigDecimal cartTotal) {

        Coupon c = couponRepo.findByCode(code).orElse(null);

        if (c == null)
            throw new RuntimeException("Mã giảm giá không tồn tại");

        if (c.getActive() != null && !c.getActive())
            throw new RuntimeException("Mã giảm giá không hoạt động");

        LocalDateTime now = LocalDateTime.now();

        if (c.getStartAt() != null && now.isBefore(c.getStartAt()))
            throw new RuntimeException("Mã giảm giá chưa bắt đầu");

        if (c.getEndAt() != null && now.isAfter(c.getEndAt()))
            throw new RuntimeException("Mã giảm giá đã hết hạn");

        if (c.getUsageLimit() != null &&
            c.getUsedCount() != null &&
            c.getUsedCount() >= c.getUsageLimit())
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");

        if (c.getMinimumOrderAmount() != null &&
            cartTotal.compareTo(BigDecimal.valueOf(c.getMinimumOrderAmount())) < 0)
            throw new RuntimeException("Đơn hàng chưa đủ giá trị tối thiểu");

        return c;
    }

    public BigDecimal calcDiscount(Coupon c, BigDecimal cartTotal) {

        return switch (c.getType()) {
            case PERCENT ->
                    cartTotal.multiply(BigDecimal.valueOf(c.getValue()))
                            .divide(BigDecimal.valueOf(100));
            case FIXED ->
                    BigDecimal.valueOf(c.getValue());
            case FREESHIP ->
                    BigDecimal.ZERO;
        };
    }
}

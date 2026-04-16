package com.ecommerce.model;

import com.ecommerce.enums.CouponType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Coupon {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    @Enumerated(EnumType.STRING)
    private CouponType type;

    private Integer value;

    private Integer minimumOrderAmount;

    private Integer usageLimit;
    private Integer usedCount;

    private Boolean active;

    // Phân quyền: mã dành cho ai? (null hoặc "ALL" = tất cả, "ROLE_USER", "ROLE_VIP", "ROLE_ADMIN")
    private String targetRole;

    private LocalDateTime startAt;
    private LocalDateTime endAt;
}

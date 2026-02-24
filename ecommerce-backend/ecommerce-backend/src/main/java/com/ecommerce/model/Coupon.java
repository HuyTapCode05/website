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

    private LocalDateTime startAt;
    private LocalDateTime endAt;
}

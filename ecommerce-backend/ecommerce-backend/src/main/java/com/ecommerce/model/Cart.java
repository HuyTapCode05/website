package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String sessionId;

    @ManyToOne
    @JoinColumn(name = "coupon_id", nullable = true)
    private Coupon coupon;

    private BigDecimal total;
    private BigDecimal discount;
    private BigDecimal finalTotal;
}

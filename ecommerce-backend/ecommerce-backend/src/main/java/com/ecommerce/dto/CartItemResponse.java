package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class CartItemResponse {
    private Long id;
    private Long productId;
    private Long variantId;
    private String name;
    private String variantLabel;   // e.g. "M / Đen"
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private Integer stock;
    private Boolean outOfStock;
}

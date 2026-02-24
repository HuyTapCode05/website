package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {

    private String name;
    private String description;

    private BigDecimal price;
    private BigDecimal salePrice;

    private Long categoryId;
    private Long brandId;

    private String imageUrl;

    private Boolean active;
}

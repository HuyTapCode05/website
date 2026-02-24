package com.ecommerce.dto;

import lombok.Data;

@Data
public class ProductFilterRequest {

    private Long categoryId;
    private String keyword;

    private Integer minPrice;
    private Integer maxPrice;

    private Boolean inStockOnly;
    private Boolean promotionOnly;

    private String sortBy; // priceAsc, priceDesc, newest, popular
}

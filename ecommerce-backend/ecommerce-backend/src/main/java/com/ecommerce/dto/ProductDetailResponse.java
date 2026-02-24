package com.ecommerce.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDetailResponse {

    private Long id;
    private String name;
    private String slug;

    private String description;
    private BigDecimal price;
    private BigDecimal salePrice;

    private String categoryName;
    private String imageUrl;

    private List<String> gallery;
    private List<VariantDto> variants;

    @Data
    @Builder
    public static class VariantDto {
        private Long id;
        private String sku;
        private String color;
        private String size;
        private int stock;
        private BigDecimal price;
        private BigDecimal salePrice;
    }
}

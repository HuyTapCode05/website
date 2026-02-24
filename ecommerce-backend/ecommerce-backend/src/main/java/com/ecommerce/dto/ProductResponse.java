package com.ecommerce.dto;

import com.ecommerce.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder 
public class ProductResponse {

    private Long id;
    private String name;
    private String slug;
    private Long price;       // dùng Long
    private Long salePrice;   // dùng Long
    private String description;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Boolean active;   
    public static ProductResponse fromEntity(Product p) {
        ProductResponse dto = new ProductResponse();

        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSlug(p.getSlug());

        // Convert BigDecimal -> Long
        if (p.getPrice() != null)
            dto.setPrice(p.getPrice().longValue());

        if (p.getSalePrice() != null)
            dto.setSalePrice(p.getSalePrice().longValue());

        dto.setDescription(p.getDescription());
        dto.setImageUrl(p.getImageUrl());

        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        }

        return dto;
    }
}

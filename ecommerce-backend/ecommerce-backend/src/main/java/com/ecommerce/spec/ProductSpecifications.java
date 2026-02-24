package com.ecommerce.spec;

import com.ecommerce.dto.ProductFilterRequest;
import com.ecommerce.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecifications {

    public static Specification<Product> withFilter(ProductFilterRequest f) {
        return Specification.where(categoryEquals(f.getCategoryId()))
                .and(keywordLike(f.getKeyword()))
                .and(priceBetween(f.getMinPrice(), f.getMaxPrice()))
                .and(inStockOnly(f.getInStockOnly()))
                .and(promotionOnly(f.getPromotionOnly()));
    }

    private static Specification<Product> categoryEquals(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) return null;
            return cb.equal(root.get("category").get("id"), categoryId);
        };
    }

    private static Specification<Product> keywordLike(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String like = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("description")), like)
            );
        };
    }

    private static Specification<Product> priceBetween(Integer min, Integer max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;

            if (min != null && max != null) {
                return cb.between(root.get("price"),
                        BigDecimal.valueOf(min),
                        BigDecimal.valueOf(max));
            } else if (min != null) {
                return cb.greaterThanOrEqualTo(root.get("price"), BigDecimal.valueOf(min));
            } else {
                return cb.lessThanOrEqualTo(root.get("price"), BigDecimal.valueOf(max));
            }
        };
    }

    private static Specification<Product> inStockOnly(Boolean inStockOnly) {
        return (root, query, cb) -> {
            if (inStockOnly == null || !inStockOnly) return null;
            return cb.greaterThan(root.get("stock"), 0);
        };
    }

    private static Specification<Product> promotionOnly(Boolean promotionOnly) {
        return (root, query, cb) -> {
            if (promotionOnly == null || !promotionOnly) return null;
            return cb.isNotNull(root.get("salePrice"));
        };
    }
}

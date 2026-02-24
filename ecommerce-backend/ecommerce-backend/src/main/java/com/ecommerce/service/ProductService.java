package com.ecommerce.service;

import com.ecommerce.dto.ProductFilterRequest;
import com.ecommerce.dto.ProductDetailResponse;
import com.ecommerce.dto.ProductDetailResponse.VariantDto;

import com.ecommerce.model.Product;
import com.ecommerce.model.ProductImage;
import com.ecommerce.repository.ProductRepository;

import com.ecommerce.spec.ProductSpecifications;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // ============ SEARCH ==============
    public Page<Product> search(ProductFilterRequest filter, int page, int size) {

        Sort sort = mapSort(filter.getSortBy());
        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.findAll(
                ProductSpecifications.withFilter(filter),
                pageable
        );
    }

    private Sort mapSort(String sortBy) {
        if (sortBy == null) return Sort.by(Sort.Direction.DESC, "createdAt");

        return switch (sortBy) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    // ============ GET DETAIL ==========
    public ProductDetailResponse getBySlug(String slug) {

        Product p = productRepository.findBySlug(slug);
        if (p == null) {
            throw new RuntimeException("Product not found");
        }

        return ProductDetailResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .price(p.getPrice())
                .salePrice(p.getSalePrice())
                .imageUrl(p.getImageUrl())
                .categoryName(
                        p.getCategory() != null ? p.getCategory().getName() : null
                )
                .gallery(
                        p.getImages() != null
                                ? p.getImages().stream()
                                    .map(ProductImage::getImageUrl)
                                    .toList()
                                : List.of()
                )
                .variants(
                        p.getVariants() != null
                                ? p.getVariants().stream()
                                    .map(v -> VariantDto.builder()
                                            .id(v.getId())
                                            .sku(v.getSku())
                                            .color(v.getColor())
                                            .size(v.getSize())
                                            .stock(v.getStock())
                                            .price(v.getPrice())
                                            .salePrice(v.getSalePrice())
                                            .build()
                                    ).collect(Collectors.toList())
                                : List.of()
                )
                .build();
    }
}

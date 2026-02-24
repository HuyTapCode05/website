package com.ecommerce.controller;

import com.ecommerce.dto.ProductFilterRequest;
import com.ecommerce.dto.ProductDetailResponse;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductCrudService;
import com.ecommerce.service.ProductService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;          // SEARCH + DETAIL
    private final ProductCrudService productCrudService;  // CRUD ADMIN

    // ================= SEARCH (PUBLIC) ================
    @GetMapping("/search")
    public List<ProductResponse> search(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false) Boolean promotionOnly,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        ProductFilterRequest filter = new ProductFilterRequest();
        filter.setCategoryId(categoryId);
        filter.setKeyword(keyword);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        filter.setInStockOnly(inStockOnly);
        filter.setPromotionOnly(promotionOnly);
        filter.setSortBy(sortBy);

        Page<Product> result = productService.search(filter, page, size);

        // Convert Page<Product> → List<ProductResponse>
        return result.getContent()
                .stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());

    }

    // ================ DETAIL (PUBLIC) ================
    @GetMapping("/{slug}")
    public ProductDetailResponse getDetail(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }

    // ================ GET ALL PRODUCTS (PUBLIC) ================
    @GetMapping
    public List<ProductResponse> getAllPublic() {
        return productCrudService.getAll();
    }

    // ================ ADMIN APIs ====================
    @PostMapping("/admin")
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productCrudService.create(request);
    }

    @PutMapping("/admin/{id}")
    public ProductResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return productCrudService.update(id, request);
    }

    @DeleteMapping("/admin/{id}")
    public void delete(@PathVariable Long id) {
        productCrudService.delete(id);
    }

    @GetMapping("/admin")
    public List<ProductResponse> getAllAdmin() {
        return productCrudService.getAll();
    }

}

package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.enums.ProductStatus;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import java.nio.file.Path;
import java.nio.file.Paths;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductCrudService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ===== CREATE =====
    public ProductResponse create(ProductRequest req) {

        String slug = generateUniqueSlug(toSlug(req.getName()));

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product p = Product.builder()
                .name(req.getName())
                .slug(slug)
                .description(req.getDescription())
                .price(req.getPrice())
                .salePrice(req.getSalePrice())
                .imageUrl(req.getImageUrl())
                .category(category)
                .stock(req.getStock() != null ? req.getStock() : 0)
                .status(ProductStatus.ACTIVE)
                .build();

        p = productRepository.save(p);

        return mapToResponse(p);
    }

// ===== UPDATE =====
public ProductResponse update(Long id, ProductRequest req) {

    Product p = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    String oldImage = p.getImageUrl();  // lưu lại ảnh cũ

    String slug = generateUniqueSlugForUpdate(id, toSlug(req.getName()));

    Category category = categoryRepository.findById(req.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

    p.setName(req.getName());
    p.setSlug(slug);
    p.setDescription(req.getDescription());
    p.setPrice(req.getPrice());
    p.setSalePrice(req.getSalePrice());
    p.setCategory(category);

    // =============================
    // 🟡 CHECK: nếu FE gửi ảnh mới
    // =============================
    if (req.getImageUrl() != null && !req.getImageUrl().equals(oldImage)) {
        // Xóa ảnh cũ
        deleteImageFile(oldImage);

        // Set ảnh mới
        p.setImageUrl(req.getImageUrl());
    }

    if (req.getActive() != null)
        p.setStatus(req.getActive() ? ProductStatus.ACTIVE : ProductStatus.ARCHIVED);

    if (req.getStock() != null)
        p.setStock(req.getStock());

    p = productRepository.save(p);

    return mapToResponse(p);
}

    // ===== DELETE (Soft-delete) =====
    public void delete(Long id) {

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // LẤY ĐƯỜNG DẪN ẢNH
        String imageUrl = p.getImageUrl();  // ví dụ "/uploads/products/abc.jpg"

        // XÓA PRODUCT (DELETE KHỎI DB)
        productRepository.delete(p);

        // XÓA ẢNH TRONG DISK (NẾU CÓ)
        deleteImageFile(imageUrl);
    }

    private void deleteImageFile(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.isEmpty()) return;

            // Bỏ dấu "/" đầu → biến thành "uploads/products/abc.jpg"
            if (imageUrl.startsWith("/")) {
                imageUrl = imageUrl.substring(1);
            }

            Path path = Paths.get(imageUrl);

            Files.deleteIfExists(path);  // Xóa nếu file tồn tại
            System.out.println("Đã xóa file: " + path);

        } catch (Exception e) {
            System.err.println("Không thể xoá file ảnh: " + e.getMessage());
        }
    }


    // ===== GET ONE =====
    public ProductResponse getById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // ===== GET ALL =====
    public List<ProductResponse> getAll() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // HELPER
    // =====================================================

    private ProductResponse mapToResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .price(p.getPrice() != null ? p.getPrice().longValue() : null)
                .salePrice(p.getSalePrice() != null ? p.getSalePrice().longValue() : null)
                .imageUrl(p.getImageUrl())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .active(p.getStatus() == ProductStatus.ACTIVE)
                .stock(p.getStock())
                .build();
    }

    private String toSlug(String input) {
        String noWhiteSpace = input.trim().replaceAll("\\s+", "-");
        String normalized = Normalizer.normalize(noWhiteSpace, Normalizer.Form.NFD);
        return Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("").toLowerCase();
    }

    private String generateUniqueSlug(String baseSlug) {
        String slug = baseSlug;
        int count = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }
        return slug;
    }

    private String generateUniqueSlugForUpdate(Long id, String baseSlug) {
        String slug = baseSlug;
        int count = 1;
        while (true) {
            Product existing = productRepository.findBySlug(slug);
            if (existing == null) break;
            if (existing.getId().equals(id)) break;
            slug = baseSlug + "-" + count;
            count++;
        }
        return slug;
    }
}

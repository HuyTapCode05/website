package com.ecommerce.service;

import com.ecommerce.dto.CategoryRequest;
import com.ecommerce.dto.CategoryResponse;
import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // ========== CREATE ==========
    public CategoryResponse create(CategoryRequest request) {

        String baseSlug = toSlug(request.getName());
        String slug = generateUniqueSlug(baseSlug);

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .active(request.getActive())
                .build();

        category = categoryRepository.save(category);

        return mapToResponse(category);
    }

    // ========== UPDATE ==========
    public CategoryResponse update(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String baseSlug = toSlug(request.getName());
        String slug = generateUniqueSlugForUpdate(id, baseSlug);

        category.setName(request.getName());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        category.setActive(request.getActive());

        category = categoryRepository.save(category);

        return mapToResponse(category);
    }

    // ========== DELETE ==========
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    // ========== GET ONE ==========
    public CategoryResponse getById(Long id) {
        return categoryRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    // ========== GET ALL ==========
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ========== Helper: map entity -> response ==========
    private CategoryResponse mapToResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .active(c.isActive()) // FIXED HERE
                .build();
    }


    // ========== Convert string -> slug ==========
    private String toSlug(String input) {
        String nowhitespace = input.trim().replaceAll("\\s+", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = Pattern.compile("[^\\w-]")
                .matcher(normalized)
                .replaceAll("");
        return slug.toLowerCase();
    }

    // ========== Generate unique slug ==========
    private String generateUniqueSlug(String baseSlug) {
        String slug = baseSlug;
        int count = 1;

        while (categoryRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }

        return slug;
    }

    // ========== Generate unique slug on UPDATE ==========
    private String generateUniqueSlugForUpdate(Long id, String baseSlug) {
        String slug = baseSlug;
        int count = 1;

        while (true) {
            Category existing = categoryRepository.findBySlug(slug);

            // Nếu chưa tồn tại → hợp lệ
            if (existing == null) break;

            // Nếu slug thuộc đúng category hiện tại → ok
            if (existing.getId().equals(id)) break;

            // Nếu slug thuộc category khác → thêm số tiếp
            slug = baseSlug + "-" + count;
            count++;
        }

        return slug;
    }
}

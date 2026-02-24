package com.ecommerce.controller;

import com.ecommerce.dto.CategoryRequest;
import com.ecommerce.dto.CategoryResponse;
import com.ecommerce.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ===== PUBLIC - lấy danh sách category =====
    @GetMapping("/categories")
    public List<CategoryResponse> getAll() {
        return categoryService.getAll();
    }

    // ===== PUBLIC - lấy 1 category =====
    @GetMapping("/categories/{id}")
    public CategoryResponse getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    // ===== ADMIN - tạo category =====
    @PostMapping("/admin/categories")
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    // ===== ADMIN - update category =====
    @PutMapping("/admin/categories/{id}")
    public CategoryResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        return categoryService.update(id, request);
    }

    // ===== ADMIN - xóa category =====
    @DeleteMapping("/admin/categories/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}

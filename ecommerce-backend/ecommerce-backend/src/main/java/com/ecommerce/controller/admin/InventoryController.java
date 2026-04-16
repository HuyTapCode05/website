package com.ecommerce.controller.admin;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final ProductRepository productRepository;

    // ============================================
    // (1) GET ALL INVENTORY
    // ============================================
    @GetMapping
    public ResponseEntity<?> getAllInventory(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String keyword
    ) {
        List<Product> products = productRepository.findAll();

        // Filter by keyword
        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.toLowerCase();
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(kw))
                    .collect(Collectors.toList());
        }

        // Filter by stock status
        if (filter != null) {
            switch (filter) {
                case "not_set":
                    products = products.stream()
                            .filter(p -> p.getStock() == null)
                            .collect(Collectors.toList());
                    break;
                case "out_of_stock":
                    products = products.stream()
                            .filter(p -> p.getStock() != null && p.getStock() <= 0)
                            .collect(Collectors.toList());
                    break;
                case "low_stock":
                    products = products.stream()
                            .filter(p -> p.getStock() != null && p.getStock() > 0 && p.getStock() <= 10)
                            .collect(Collectors.toList());
                    break;
                case "in_stock":
                    products = products.stream()
                            .filter(p -> p.getStock() != null && p.getStock() > 10)
                            .collect(Collectors.toList());
                    break;
            }
        }

        List<Map<String, Object>> result = products.stream().map(p -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", p.getId());
            item.put("name", p.getName());
            item.put("imageUrl", p.getImageUrl());
            item.put("price", p.getPrice());
            item.put("salePrice", p.getSalePrice());
            item.put("stock", p.getStock() != null ? p.getStock() : 0);
            item.put("categoryName", p.getCategory() != null ? p.getCategory().getName() : null);

            String status;
            if (p.getStock() == null) status = "NOT_SET";
            else if (p.getStock() <= 0) status = "OUT_OF_STOCK";
            else if (p.getStock() <= 10) status = "LOW_STOCK";
            else status = "IN_STOCK";
            item.put("stockStatus", status);

            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // ============================================
    // (2) UPDATE STOCK QUICKLY
    // ============================================
    @PutMapping("/{productId}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> body
    ) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null)
            return ResponseEntity.status(404).body(Map.of("error", "Sản phẩm không tồn tại"));

        Integer newStock = body.get("stock");
        if (newStock == null || newStock < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Số lượng không hợp lệ"));
        }

        product.setStock(newStock);
        productRepository.save(product);

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật tồn kho thành công",
                "productId", productId,
                "stock", newStock
        ));
    }

    // ============================================
    // (3) GET STATS
    // ============================================
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<Product> products = productRepository.findAll();

        int totalProducts = products.size();
        long notSet = products.stream()
                .filter(p -> p.getStock() == null)
                .count();
        long outOfStock = products.stream()
                .filter(p -> p.getStock() != null && p.getStock() <= 0)
                .count();
        long lowStock = products.stream()
                .filter(p -> p.getStock() != null && p.getStock() > 0 && p.getStock() <= 10)
                .count();
        long inStock = products.stream()
                .filter(p -> p.getStock() != null && p.getStock() > 10)
                .count();
        long totalStockValue = products.stream()
                .filter(p -> p.getStock() != null && p.getStock() > 0 && p.getPrice() != null)
                .mapToLong(p -> p.getPrice().longValue() * p.getStock())
                .sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("notSet", notSet);
        stats.put("outOfStock", outOfStock);
        stats.put("lowStock", lowStock);
        stats.put("inStock", inStock);
        stats.put("totalStockValue", totalStockValue);

        return ResponseEntity.ok(stats);
    }

    // ============================================
    // (4) INIT STOCK CHO TẤT CẢ SP CHƯA SET
    // ============================================
    @PostMapping("/init-stock")
    public ResponseEntity<?> initStock(@RequestBody Map<String, Integer> body) {
        Integer defaultStock = body.getOrDefault("stock", 100);
        if (defaultStock < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Số lượng không hợp lệ"));
        }

        List<Product> products = productRepository.findAll();
        int count = 0;
        for (Product p : products) {
            if (p.getStock() == null) {
                p.setStock(defaultStock);
                productRepository.save(p);
                count++;
            }
        }

        return ResponseEntity.ok(Map.of(
                "message", "Đã khởi tạo stock cho " + count + " sản phẩm",
                "updatedCount", count,
                "defaultStock", defaultStock
        ));
    }
}

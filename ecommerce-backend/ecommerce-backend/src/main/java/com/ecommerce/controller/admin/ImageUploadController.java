package com.ecommerce.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class ImageUploadController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/products/";

            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);

            Files.copy(file.getInputStream(), filePath);

            // Trả URL ảnh để FE dùng
            return ResponseEntity.ok("/uploads/products/" + fileName);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi upload: " + e.getMessage());
        }
    }
}

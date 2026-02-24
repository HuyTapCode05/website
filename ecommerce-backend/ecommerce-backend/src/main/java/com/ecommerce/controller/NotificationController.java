package com.ecommerce.controller;

import com.ecommerce.model.Notification;
import com.ecommerce.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> getUserNotifications(@RequestParam Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping("/{id}/seen")
    public String markSeen(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        n.setSeen(true);
        notificationRepository.save(n);
        return "Đã đánh dấu đã xem";
    }
}

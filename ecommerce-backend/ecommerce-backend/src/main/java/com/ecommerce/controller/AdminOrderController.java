package com.ecommerce.controller;

import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;

    // ============================================
    // (1) GET ALL ORDERS + FILTER
    // ============================================
    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(required = false) String status
    ) {
        List<Order> list;

        if (status == null || status.isBlank()) {
            list = orderRepo.findAll();
        } else {
            OrderStatus st = OrderStatus.valueOf(status.toUpperCase());
            list = orderRepo.findByOrderStatus(st);
        }

        return ResponseEntity.ok(list);
    }

    // ============================================
    // (2) GET ORDER DETAIL
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetail(@PathVariable Long id) {

        Order order = orderRepo.findById(id).orElse(null);
        if (order == null)
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));

        List<OrderItem> items = orderItemRepo.findByOrderId(id);

        Map<String, Object> data = new HashMap<>();
        data.put("order", order);
        data.put("items", items);

        return ResponseEntity.ok(data);
    }

    // ============================================
    // (3) APPROVE ORDER
    // FE gọi: POST /api/admin/orders/{id}/approve
    // ============================================
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveOrder(@PathVariable Long id) {

        Order order = orderRepo.findById(id).orElse(null);
        if (order == null)
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Chỉ đơn hàng PENDING mới được duyệt")
            );
        }

        order.setOrderStatus(OrderStatus.PROCESSING);
        orderRepo.save(order);

        return ResponseEntity.ok(Map.of("message", "Đã duyệt đơn hàng"));
    }

    // ============================================
    // (4) UPDATE STATUS (SHIPPING / COMPLETED ...)
    // FE gọi: POST /api/admin/orders/{id}/status?status=SHIPPING
    // ============================================
    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Order order = orderRepo.findById(id).orElse(null);
        if (order == null)
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setOrderStatus(newStatus);
            orderRepo.save(order);

            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Trạng thái không hợp lệ"));
        }
    }

    // ============================================
    // (5) CANCEL ORDER
    // FE gọi: POST /api/admin/orders/{id}/cancel
    // ============================================
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {

        Order order = orderRepo.findById(id).orElse(null);
        if (order == null)
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể hủy đơn đã hoàn thành"));
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepo.save(order);

        return ResponseEntity.ok(Map.of("message", "Đơn hàng đã được hủy"));
    }
}

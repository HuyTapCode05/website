package com.ecommerce.repository;

import com.ecommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Lấy tất cả item theo orderId
    List<OrderItem> findByOrderId(Long orderId);
}

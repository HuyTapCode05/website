package com.ecommerce.repository;

import com.ecommerce.model.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {

    // Lấy lịch sử trạng thái theo orderId
    List<OrderStatusHistory> findByOrderIdOrderByCreatedAtAsc(Long orderId);
}

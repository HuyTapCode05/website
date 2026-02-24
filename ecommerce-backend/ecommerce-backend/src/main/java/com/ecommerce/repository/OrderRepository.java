package com.ecommerce.repository;

import com.ecommerce.model.Order;
import com.ecommerce.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByUserIdAndOrderStatus(Long userId, OrderStatus status);

    Order findByOrderNo(String orderNo);

    // *** THÊM DÒNG NÀY ***
    List<Order> findByOrderStatus(OrderStatus status);
}

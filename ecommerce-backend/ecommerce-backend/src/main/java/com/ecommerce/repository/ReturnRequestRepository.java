package com.ecommerce.repository;

import com.ecommerce.model.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    List<ReturnRequest> findByUserId(Long userId);

    List<ReturnRequest> findByOrderId(Long orderId);
}

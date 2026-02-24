package com.ecommerce.service;

import com.ecommerce.dto.ReturnRequestDTO;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.enums.ReturnRequestStatus;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderStatusHistory;
import com.ecommerce.model.ReturnRequest;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.OrderStatusHistoryRepository;
import com.ecommerce.repository.ReturnRequestRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReturnRequestService {

    private final ReturnRequestRepository requestRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository historyRepository;

    // ============= USER TẠO YÊU CẦU ĐỔI/TRẢ ===============
    public ReturnRequest create(Long userId, ReturnRequestDTO dto) {

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Permission denied");
        }

        // Đơn chỉ được request khi đã Delivered
        if (order.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("You can only request a return after delivery.");
        }

        ReturnRequest req = ReturnRequest.builder()
                .order(order)
                .userId(userId)
                .reason(dto.getReason())
                .note(dto.getNote())
                .status(ReturnRequestStatus.PENDING)
                .build();

        return requestRepository.save(req);
    }

    // ============= ADMIN DUYỆT YÊU CẦU ===============
    public ReturnRequest approve(Long requestId, String adminNote) {
        ReturnRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus(ReturnRequestStatus.APPROVED);
        requestRepository.save(req);

        // cập nhật trạng thái Order → RETURNED
        Order order = req.getOrder();
        OrderStatus old = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.RETURNED);
        orderRepository.save(order);

        // lưu history
        historyRepository.save(OrderStatusHistory.builder()
                .order(order)
                .fromStatus(old)
                .toStatus(OrderStatus.RETURNED)
                .note("Return approved: " + adminNote)
                .build()
        );

        return req;
    }

    // ============= ADMIN TỪ CHỐI ===============
    public ReturnRequest reject(Long requestId, String adminNote) {
        ReturnRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus(ReturnRequestStatus.REJECTED);
        req.setNote(adminNote);
        return requestRepository.save(req);
    }
}

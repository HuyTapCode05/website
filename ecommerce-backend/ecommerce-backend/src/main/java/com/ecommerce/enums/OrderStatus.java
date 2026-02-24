package com.ecommerce.enums;

public enum OrderStatus {
    PENDING,        // Chờ xác nhận
    PAID,           // Đã thanh toán
    PROCESSING,     // Đang xử lý đơn
    SHIPPED,        // Đã giao cho đơn vị vận chuyển
    DELIVERED,      // Người dùng đã nhận
    CANCELLED,      // Đã hủy
    RETURNED,       // Người dùng gửi trả
    REFUNDED,        // Đã hoàn tiền
    COMPLETED        // Hoàn thành
}

package com.ecommerce.model;

import com.ecommerce.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")   // ⭐⭐⭐ BẮT BUỘC
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNo;

    private Long userId;

    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;

    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private LocalDateTime createdAt;

    private String couponCode;

    // ======================
    // PAYMENT INFORMATION
    // ======================
    private LocalDateTime paidAt;              // Thời gian thanh toán
    private BigDecimal paymentAmount;          // Số tiền thực tế đã thanh toán
    private String transactionId;              // Transaction ID từ SEPAY (nếu có)
    private String paymentReference;           // Nội dung chuyển khoản (DH{orderId})
}

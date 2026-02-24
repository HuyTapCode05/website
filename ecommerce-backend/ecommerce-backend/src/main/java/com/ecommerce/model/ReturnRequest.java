package com.ecommerce.model;

import com.ecommerce.enums.ReturnRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "return_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Đơn hàng muốn đổi/trả
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    private Long userId;

    private String reason;     // Lý do đổi/trả
    private String note;       // Ghi chú thêm nếu cần

    @Enumerated(EnumType.STRING)
    private ReturnRequestStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

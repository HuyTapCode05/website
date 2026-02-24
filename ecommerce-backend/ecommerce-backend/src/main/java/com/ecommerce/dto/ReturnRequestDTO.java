package com.ecommerce.dto;

import lombok.Data;

@Data
public class ReturnRequestDTO {
    private Long orderId;
    private String reason;
    private String note;
}

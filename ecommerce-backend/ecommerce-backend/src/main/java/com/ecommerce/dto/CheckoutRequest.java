package com.ecommerce.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String paymentMethod;
    private String note;
    private String couponCode;   // thêm dòng này
}

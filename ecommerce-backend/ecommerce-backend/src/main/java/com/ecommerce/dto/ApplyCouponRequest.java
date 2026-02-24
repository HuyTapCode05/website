package com.ecommerce.dto;

import lombok.Data;

@Data
public class ApplyCouponRequest {

    private String code; // tên field đúng backend đang nhận

    // backend đang gọi req.getCouponCode(), nên thêm alias getter cho hợp lệ
    public String getCouponCode() {
        return code;
    }
}

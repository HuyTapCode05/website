package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateCartRequest {

    private Long cartItemId; // id của item trong giỏ
    private String action;   // "inc" hoặc "dec"
}

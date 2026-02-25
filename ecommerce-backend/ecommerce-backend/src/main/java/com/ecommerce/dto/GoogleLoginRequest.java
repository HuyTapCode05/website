package com.ecommerce.dto;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String credential; // Google ID token from frontend
}

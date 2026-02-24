package com.ecommerce.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String avatarUrl;
    private List<UserAddressResponse> addresses;
}

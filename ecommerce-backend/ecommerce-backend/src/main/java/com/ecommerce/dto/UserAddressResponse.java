package com.ecommerce.dto;

import lombok.*;

@Data
@Builder
public class UserAddressResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String addressLine;
    private String ward;
    private String district;
    private String province;
    private boolean defaultAddress;
}

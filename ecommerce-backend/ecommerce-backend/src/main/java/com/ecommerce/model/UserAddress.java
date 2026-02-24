package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String fullName;

    private String phone;

    private String addressLine;

    private String ward;
    private String district;
    private String province;

    private boolean defaultAddress = false;
}

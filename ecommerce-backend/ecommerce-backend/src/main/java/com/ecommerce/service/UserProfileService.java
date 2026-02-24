package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;

    public UserProfileResponse getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .addresses(
                        addressRepository.findByUserId(userId)
                                .stream()
                                .map(addr -> UserAddressResponse.builder()
                                        .id(addr.getId())
                                        .fullName(addr.getFullName())
                                        .phone(addr.getPhone())
                                        .addressLine(addr.getAddressLine())
                                        .ward(addr.getWard())
                                        .district(addr.getDistrict())
                                        .province(addr.getProvince())
                                        .defaultAddress(addr.isDefaultAddress())
                                        .build()
                                ).collect(Collectors.toList())
                )
                .build();
    }

    public String updateProfile(Long userId, String name, String phone) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setName(name);
        user.setPhone(phone);

        userRepository.save(user);
        return "Cập nhật hồ sơ thành công";
    }
}

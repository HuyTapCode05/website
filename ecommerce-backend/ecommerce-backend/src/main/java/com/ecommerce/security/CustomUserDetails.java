package com.ecommerce.security;

import com.ecommerce.model.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority(user.getRole()) // ROLE_ADMIN or ROLE_USER
        );
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // login bằng email
    }

    @Override
    public boolean isEnabled() {
        return true; // hoặc user.isEnabled()
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // BẮT BUỘC PHẢI CÓ
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // BẮT BUỘC PHẢI CÓ
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // BẮT BUỘC PHẢI CÓ
    }
}

package com.ecommerce.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.ecommerce.util.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();

        // =====================================================
        // 🔓 PUBLIC API — không cần JWT
        // =====================================================
if (
        path.startsWith("/auth")
        || path.equals("/products")
        || path.startsWith("/products/search")
        || (path.startsWith("/products/") && !path.startsWith("/products/admin"))
        || path.startsWith("/categories")
        || path.startsWith("/uploads")
) {
    filterChain.doFilter(request, response);
    return;
}

        // =====================================================
        // 🛒 /api/cart → CHO PHÉP KHÁCH + USER
        // Nhưng KHÔNG return → vẫn xử lý JWT nếu có
        // =====================================================

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractEmail(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    if (jwtUtil.validateToken(token, userDetails)) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }

            } catch (Exception ignored) {
                // Token sai thì xử lý như guest
            }
        }

        // ✔ Cho mọi request tiếp tục
        filterChain.doFilter(request, response);
    }
}

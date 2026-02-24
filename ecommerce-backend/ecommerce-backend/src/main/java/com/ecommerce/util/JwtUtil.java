package com.ecommerce.util;

import com.ecommerce.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "YOUR_SECRET_KEY_32_BYTES_MINIMUM_1234567890123";
    private final long EXPIRATION = 1000 * 60 * 60 * 24; // 24h

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // =======================
    // CREATE TOKEN
    // =======================
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =======================
    // EXTRACT EMAIL
    // =======================
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // =======================
    // EXTRACT ALL CLAIMS
    // =======================
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // =======================
    // CHECK EXPIRE
    // =======================
    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // =======================
    // VALIDATE TOKEN
    // =======================
    public boolean validateToken(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        try {
            String email = extractEmail(token);
            return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }
}

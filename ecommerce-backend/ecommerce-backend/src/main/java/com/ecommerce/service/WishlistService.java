package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.model.Product;
import com.ecommerce.model.Wishlist;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.WishlistRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    // ============================
    // 1) Thêm sản phẩm vào wishlist
    // ============================
    public Wishlist addToWishlist(Long userId, Long productId) {

        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Sản phẩm đã có trong danh sách yêu thích");
        }

        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Wishlist w = Wishlist.builder()
                .userId(userId)
                .product(p)
                .build();

        return wishlistRepository.save(w);
    }

    // ============================
    // 2) Lấy danh sách wishlist theo user
    // ============================
    public List<Wishlist> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    // ============================
    // 3) Xóa sản phẩm khỏi wishlist
    // ============================
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    // ============================
    // 4) Chuyển sản phẩm → Giỏ hàng
    // ============================
    public void moveToCart(Long userId, Long productId) {

        // ================================
        // Với backend mới:
        //  - CartService đọc userId từ JWT
        //  - FE KHÔNG gửi userId nữa
        //  - sessionId chỉ dùng cho guest
        // ================================

        cartService.addToCart(
                null, // ❗ Không cần sessionId vì user đang login
                new AddToCartRequest(productId, 1)
        );

        // Xóa khỏi wishlist
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}

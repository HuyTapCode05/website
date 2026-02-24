package com.ecommerce.controller;

import com.ecommerce.model.Wishlist;
import com.ecommerce.service.WishlistService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    // 1) Thêm vào wishlist
    @PostMapping("/add")
    public Wishlist add(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {
        return wishlistService.addToWishlist(userId, productId);
    }

    // 2) Lấy danh sách wishlist
    @GetMapping
    public List<Wishlist> getList(
            @RequestParam Long userId
    ) {
        return wishlistService.getWishlist(userId);
    }

    // 3) Xóa khỏi wishlist
    @DeleteMapping("/remove")
    public String remove(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {
        wishlistService.removeFromWishlist(userId, productId);
        return "Xóa thành công";
    }

    // 4) Chuyển sang giỏ hàng
    @PostMapping("/move-to-cart")
    public String moveToCart(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {
        wishlistService.moveToCart(userId, productId);
        return "Đã chuyển sang giỏ hàng";
    }
}

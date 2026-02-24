package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.CartService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public CartResponse add(
            @RequestParam(required = false) String sessionId,
            @RequestBody AddToCartRequest req
    ) {
        return cartService.addToCart(sessionId, req);
    }

    @PutMapping("/update")
    public CartResponse update(
            @RequestParam(required = false) String sessionId,
            @RequestBody UpdateCartRequest req
    ) {
        return cartService.updateQuantity(sessionId, req.getCartItemId(), req.getAction());
    }

    @DeleteMapping("/remove")
    public CartResponse remove(
            @RequestParam(required = false) String sessionId,
            @RequestParam Long cartItemId
    ) {
        return cartService.removeItem(sessionId, cartItemId);
    }

    @GetMapping
    public CartResponse get(
            @RequestParam(required = false) String sessionId
    ) {
        return cartService.getCart(sessionId);
    }

    @PostMapping("/apply-coupon")
    public CartResponse apply(
            @RequestParam(required = false) String sessionId,
            @RequestBody ApplyCouponRequest req
    ) {
        return cartService.applyCoupon(sessionId, req);
    }

    // ============================
    // ⭐ THÊM API CLEAR CART ⭐
    // ============================
    
@PostMapping("/clear")
public void clearCart(
        @RequestParam(required = false) String sessionId
) {
    cartService.clearCart(sessionId);
}

}

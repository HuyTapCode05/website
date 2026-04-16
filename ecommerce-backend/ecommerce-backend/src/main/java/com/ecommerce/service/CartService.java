package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final CouponRepository couponRepo;
    private final UserRepository userRepo;

    // ============================
    // GET USER FROM JWT
    // ============================
    private Long getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) return null;

        User user = userRepo.findByEmail(auth.getName()).orElse(null);
        return (user != null) ? user.getId() : null;
    }

    // ============================
    // GET OR CREATE CART
    // ============================
    private Cart getOrCreate(String sessionId) {

        Long userId = getUserId();

        if (userId != null) {
            return cartRepo.findByUserId(userId)
                    .orElseGet(() ->
                            cartRepo.save(
                                    Cart.builder()
                                            .userId(userId)
                                            .build()
                            ));
        }

        return cartRepo.findBySessionId(sessionId)
                .orElseGet(() ->
                        cartRepo.save(
                                Cart.builder()
                                        .sessionId(sessionId)
                                        .build()
                        ));
    }

    // ============================
    // ADD TO CART
    // ============================
    public CartResponse addToCart(String sessionId, AddToCartRequest req) {

        Cart cart = getOrCreate(sessionId);

        Product p = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ===== Tìm variant nếu có =====
        ProductVariant variant = null;
        if (req.getVariantId() != null) {
            variant = p.getVariants() != null
                    ? p.getVariants().stream()
                        .filter(v -> v.getId().equals(req.getVariantId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Variant not found"))
                    : null;
        }

        // ===== Tìm item đã tồn tại trong giỏ (theo product + variant) =====
        Optional<CartItem> exist;
        if (variant != null) {
            exist = cartItemRepo.findByCartIdAndProductIdAndVariantId(cart.getId(), req.getProductId(), variant.getId());
        } else {
            exist = cartItemRepo.findByCartIdAndProductIdAndVariantIsNull(cart.getId(), req.getProductId());
        }

        // ===== CHECK STOCK =====
        if (variant != null) {
            // Check variant stock
            int currentStock = variant.getStock();
            if (currentStock <= 0) {
                String label = variant.getSize() + " / " + variant.getColor();
                throw new RuntimeException("Sản phẩm \"" + p.getName() + "\" (" + label + ") đã hết hàng");
            }
            int totalQty = req.getQuantity();
            if (exist.isPresent()) totalQty += exist.get().getQuantity();
            if (totalQty > currentStock) {
                String label = variant.getSize() + " / " + variant.getColor();
                throw new RuntimeException("Sản phẩm \"" + p.getName() + "\" (" + label + ") chỉ còn " + currentStock + " sản phẩm");
            }
        } else if (p.getStock() != null) {
            // Check product stock
            int currentStock = p.getStock();
            if (currentStock <= 0) {
                throw new RuntimeException("Sản phẩm \"" + p.getName() + "\" đã hết hàng");
            }
            int totalQty = req.getQuantity();
            if (exist.isPresent()) totalQty += exist.get().getQuantity();
            if (totalQty > currentStock) {
                throw new RuntimeException("Sản phẩm \"" + p.getName() + "\" chỉ còn " + currentStock + " sản phẩm");
            }
        }

        // ===== Xác định giá =====
        BigDecimal price;
        if (variant != null && variant.getSalePrice() != null) {
            price = variant.getSalePrice();
        } else if (variant != null && variant.getPrice() != null) {
            price = variant.getPrice();
        } else {
            price = p.getSalePrice() != null ? p.getSalePrice() : p.getPrice();
        }

        // ===== Lưu vào giỏ =====
        if (exist.isPresent()) {
            CartItem item = exist.get();
            item.setQuantity(item.getQuantity() + req.getQuantity());
            cartItemRepo.save(item);
        } else {
            cartItemRepo.save(
                    CartItem.builder()
                            .cart(cart)
                            .product(p)
                            .variant(variant)
                            .price(price)
                            .quantity(req.getQuantity())
                            .build()
            );
        }

        return calculate(cart);
    }

    // ============================
    // UPDATE QUANTITY
    // ============================
    public CartResponse updateQuantity(String sessionId, Long itemId, String action) {

        Cart cart = getOrCreate(sessionId);

        CartItem item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if ("inc".equals(action)) {
            // ===== CHECK STOCK KHI TĂNG SỐ LƯỢNG =====
            Product p = item.getProduct();
            if (p.getStock() != null) {
                int newQty = item.getQuantity() + 1;
                if (p.getStock() <= 0) {
                    throw new RuntimeException("Sản phẩm \"" + p.getName() + "\" đã hết hàng");
                }
                if (newQty > p.getStock()) {
                    throw new RuntimeException("Sản phẩm \"" + p.getName() + "\" chỉ còn " + p.getStock() + " sản phẩm trong kho");
                }
            }
            item.setQuantity(item.getQuantity() + 1);
        } else if ("dec".equals(action) && item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
        }

        cartItemRepo.save(item);

        return calculate(cart);
    }

    // ============================
    // REMOVE ITEM
    // ============================
    public CartResponse removeItem(String sessionId, Long itemId) {

        Cart cart = getOrCreate(sessionId);

        cartItemRepo.deleteById(itemId);

        return calculate(cart);
    }

    // ============================
    // GET CART
    // ============================
    public CartResponse getCart(String sessionId) {
        Cart cart = getOrCreate(sessionId);
        return calculate(cart);
    }

    // ============================
    // APPLY COUPON
    // ============================
    public CartResponse applyCoupon(String sessionId, ApplyCouponRequest req) {

        Cart cart = getOrCreate(sessionId);

        Coupon coupon = couponRepo.findByCode(req.getCouponCode())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá"));

        LocalDateTime now = LocalDateTime.now();

        if (coupon.getActive() != null && !coupon.getActive())
            throw new RuntimeException("Mã giảm giá không hoạt động");

        if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt()))
            throw new RuntimeException("Mã giảm giá chưa bắt đầu");

        if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt()))
            throw new RuntimeException("Mã giảm giá đã hết hạn");

        if (coupon.getUsageLimit() != null &&
                coupon.getUsedCount() >= coupon.getUsageLimit())
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");

        cart.setCoupon(coupon);
        cartRepo.save(cart);

        return calculate(cart);
    }

    // ============================
    // CLEAR CART
    // ============================
@Transactional
public void clearCart(String sessionId) {

    Long userId = getUserId();
    Cart cart;

    if (userId != null) {
        cart = cartRepo.findByUserId(userId).orElse(null);
    } else {
        cart = cartRepo.findBySessionId(sessionId).orElse(null);
    }

    if (cart != null) {
        cartItemRepo.deleteByCartId(cart.getId());

        cart.setTotal(BigDecimal.ZERO);
        cart.setFinalTotal(BigDecimal.ZERO);
        cart.setDiscount(BigDecimal.ZERO);
        cart.setCoupon(null);

        cartRepo.save(cart);
    }
}


    // ============================
    // CALCULATE CART
    // ============================
    private CartResponse calculate(Cart cart) {

        List<CartItem> items = cartItemRepo.findByCartId(cart.getId());

        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;

        if (cart.getCoupon() != null) {
            Coupon c = cart.getCoupon();

            switch (c.getType()) {

                case PERCENT:
                    discount = total
                            .multiply(BigDecimal.valueOf(c.getValue()))
                            .divide(BigDecimal.valueOf(100));
                    break;

                case FIXED:
                    discount = BigDecimal.valueOf(c.getValue());
                    break;

                case FREESHIP:
                    discount = BigDecimal.ZERO;
                    break;
            }
        }

        BigDecimal finalTotal = total.subtract(discount);

        cart.setTotal(total);
        cart.setDiscount(discount);
        cart.setFinalTotal(finalTotal);

        cartRepo.save(cart);

        CartResponse res = new CartResponse();
        res.setId(cart.getId());
        res.setTotal(total);
        res.setDiscount(discount);
        res.setFinalTotal(finalTotal);

        res.setItems(items.stream().map(i -> {
            CartItemResponse d = new CartItemResponse();
            d.setId(i.getId());
            d.setProductId(i.getProduct().getId());
            d.setName(i.getProduct().getName());
            d.setImageUrl(i.getProduct().getImageUrl());
            d.setPrice(i.getPrice());
            d.setQuantity(i.getQuantity());

            // Variant info
            if (i.getVariant() != null) {
                d.setVariantId(i.getVariant().getId());
                String label = "";
                if (i.getVariant().getSize() != null) label += i.getVariant().getSize();
                if (i.getVariant().getColor() != null) label += (label.isEmpty() ? "" : " / ") + i.getVariant().getColor();
                d.setVariantLabel(label);
                // Variant stock
                d.setStock(i.getVariant().getStock());
                d.setOutOfStock(i.getVariant().getStock() <= 0);
            } else {
                // Product stock
                Integer productStock = i.getProduct().getStock();
                d.setStock(productStock);
                d.setOutOfStock(productStock != null && productStock <= 0);
            }

            return d;
        }).collect(Collectors.toList()));

        return res;
    }
}

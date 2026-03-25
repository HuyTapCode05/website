# PHÂN CÔNG NHÓM — DỰ ÁN E-COMMERCE

## Tổng quan công nghệ
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Spring Boot + Java
- **Database**: MySQL (ecommerce_db)
- **Thanh toán**: SePay (chuyển khoản ngân hàng)
- **Email**: Gmail SMTP

---

## THÀNH VIÊN 1 — Xác thực & Quản lý người dùng

### Chức năng
- Đăng ký tài khoản (Register)
- Đăng nhập / Đăng xuất (Login/Logout)
- JWT Authentication & Authorization
- Quản lý hồ sơ người dùng (Profile)

### Backend (Spring Boot)
| File | Mô tả |
|------|-------|
| `AuthController.java` | API đăng ký, đăng nhập |
| `UserService.java` | Logic xác thực, mã hóa mật khẩu |
| `UserProfileController.java` | API cập nhật hồ sơ |
| `UserProfileService.java` | Logic cập nhật thông tin user |
| `JwtAuthenticationFilter.java` | Filter xác thực JWT |
| `CustomUserDetails.java` | UserDetails implementation |
| `CustomUserDetailsService.java` | Load user từ DB |
| `SecurityConfig.java` (config/) | Cấu hình Spring Security |
| `JwtUtil.java` (util/) | Tạo/xác thực JWT token |
| `User.java` (model) | Entity User |
| `UserAddress.java` (model) | Entity địa chỉ |

### Frontend (React)
| File | Mô tả |
|------|-------|
| `Login.tsx` | Trang đăng nhập |
| `Register.tsx` | Trang đăng ký |
| `Header.tsx` | Navbar (hiển thị trạng thái login) |
| `axiosClient.ts` | Cấu hình Axios + JWT interceptor |

---

## THÀNH VIÊN 2 — Sản phẩm & Danh mục & Tìm kiếm

### Chức năng
- Trang chủ (hiển thị sản phẩm nổi bật, danh mục)
- Chi tiết sản phẩm (biến thể size/màu, giá, ảnh)
- Tìm kiếm & lọc sản phẩm
- Quản lý danh mục (Category)
- Wishlist (yêu thích)

### Backend (Spring Boot)
| File | Mô tả |
|------|-------|
| `ProductController.java` | API lấy sản phẩm, chi tiết, tìm kiếm |
| `ProductService.java` | Logic truy vấn sản phẩm |
| `CategoryController.java` | API danh mục |
| `CategoryService.java` | Logic CRUD danh mục |
| `WishlistController.java` | API wishlist |
| `WishlistService.java` | Logic wishlist |
| `Product.java` (model) | Entity sản phẩm |
| `ProductImage.java` (model) | Entity ảnh sản phẩm |
| `ProductVariant.java` (model) | Entity biến thể (size, màu, tồn kho) |
| `Category.java` (model) | Entity danh mục |
| `Wishlist.java` (model) | Entity wishlist |
| `ProductSpec.java` (spec/) | Filter specification |

### Frontend (React)
| File | Mô tả |
|------|-------|
| `Home.tsx` | Trang chủ — banner, danh mục, sản phẩm |
| `ProductDetail.tsx` | Chi tiết SP — chọn size/màu, số lượng |
| `Search.tsx` | Trang tìm kiếm & lọc |
| `ProductCard.tsx` | Card hiển thị SP |
| `ProductCardSearch.tsx` | Card SP trong kết quả tìm kiếm |

---

## THÀNH VIÊN 3 — Giỏ hàng & Thanh toán & Đơn hàng (Khách)

### Chức năng
- Giỏ hàng (thêm, sửa số lượng, xóa)
- Thanh toán (checkout, mã giảm giá, ghi chú)
- Tích hợp thanh toán SePay (chuyển khoản QR)
- Quản lý đơn hàng phía khách (xem, hủy)
- Gửi email thông báo đơn hàng

### Backend (Spring Boot)
| File | Mô tả |
|------|-------|
| `CartController.java` | API giỏ hàng |
| `CartService.java` | Logic thêm/sửa/xóa giỏ hàng |
| `OrderController.java` | API đặt hàng, xem, hủy đơn |
| `OrderService.java` | Logic xử lý đơn hàng |
| `CheckoutService.java` | Logic checkout |
| `CouponService.java` | Logic mã giảm giá |
| `SePayController.java` | API thanh toán SePay |
| `SePayService.java` | Logic tích hợp thanh toán |
| `EmailService.java` | Gửi email thông báo |
| `Cart.java` / `CartItem.java` (model) | Entity giỏ hàng |
| `Order.java` / `OrderItem.java` (model) | Entity đơn hàng |
| `OrderStatusHistory.java` (model) | Lịch sử trạng thái |
| `Coupon.java` (model) | Entity mã giảm giá |

### Frontend (React)
| File | Mô tả |
|------|-------|
| `CartPage.tsx` | Trang giỏ hàng |
| `CartList.tsx` / `CartHeader.tsx` | Component giỏ hàng |
| `CheckoutPage.tsx` | Trang thanh toán |
| `PaymentMethodSelect.tsx` | Chọn phương thức TT |
| `CouponInput.tsx` | Nhập mã giảm giá |
| `NoteInput.tsx` | Ghi chú đơn hàng |
| `SummaryBox.tsx` | Tóm tắt đơn hàng |
| `OrdersPage.tsx` | Danh sách đơn hàng |
| `OrderDetailPage.tsx` | Chi tiết đơn hàng |
| `OrderList.tsx` / `OrderInfo.tsx` / `OrderSummary.tsx` | Components đơn hàng |
| `CancelOrderButton.tsx` | Nút hủy đơn |

---

## THÀNH VIÊN 4 — Admin Dashboard & Quản lý hệ thống

### Chức năng
- Dashboard tổng quan (doanh thu, đơn hàng, thống kê)
- Quản lý sản phẩm (CRUD, upload ảnh)
- Quản lý đơn hàng (cập nhật trạng thái)
- Quản lý danh mục
- Quản lý mã giảm giá (Coupon)
- Hệ thống thông báo (Notification)
- Yêu cầu trả hàng (Return Request)

### Backend (Spring Boot)
| File | Mô tả |
|------|-------|
| `AdminOrderController.java` | API quản lý đơn (admin) |
| `AdminCouponsController.java` | API CRUD mã giảm giá |
| `ImageUploadController.java` | Upload ảnh sản phẩm |
| `ProductCrudService.java` | Logic CRUD sản phẩm (admin) |
| `NotificationController.java` | API thông báo |
| `NotificationService.java` | Logic thông báo |
| `ReturnRequestController.java` | API trả hàng |
| `ReturnRequestService.java` | Logic trả hàng |
| `Notification.java` (model) | Entity thông báo |
| `ReturnRequest.java` (model) | Entity trả hàng |

### Frontend (React)
| File | Mô tả |
|------|-------|
| `AdminDashboard.tsx` | Dashboard thống kê |
| `AdminProducts.tsx` | Quản lý sản phẩm |
| `AdminOrders.tsx` | Quản lý đơn hàng |
| `AdminCategories.tsx` | Quản lý danh mục |
| `AdminCoupons.tsx` | Quản lý mã giảm giá |
| `AdminMenu.tsx` | Menu sidebar admin |
| `ProductForm.tsx` (components/admin) | Form thêm/sửa SP |
| `Toast.tsx` | Component thông báo |

---

## Tóm tắt phân công

| Thành viên | Phạm vi | Backend Files | Frontend Files |
|:---:|:---:|:---:|:---:|
| **1** | Auth & User | 11 files | 4 files |
| **2** | Sản phẩm & Danh mục | 12 files | 5 files |
| **3** | Giỏ hàng & Đơn hàng | 13 files | 11 files |
| **4** | Admin & Hệ thống | 10 files | 8 files |

### File dùng chung (cả 4 người đều sử dụng)
- `application.properties` — Cấu hình DB, SMTP, JWT
- `EcommerceBackendApplication.java` — Main class
- `CorsConfig.java` (config/) — Cấu hình CORS
- `App.tsx` — Router chính
- `axiosClient.ts` — HTTP client
- `sample_data.sql` — Dữ liệu mẫu

### Database (MySQL)
| Thành viên | Bảng phụ trách |
|:---:|:---|
| **1** | `users`, `user_addresses` |
| **2** | `products`, `product_images`, `product_variants`, `categories`, `wishlists` |
| **3** | `carts`, `cart_items`, `orders`, `order_items`, `order_status_history`, `coupons` |
| **4** | `notifications`, `return_requests` |

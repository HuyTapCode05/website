package com.ecommerce.dto;

import java.util.Map;

import com.ecommerce.model.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private Order order;
    private String paymentUrl; // URL để redirect đến SEPAY nếu paymentMethod = "SEPAY"
    private String qrCode; // QR code URL để hiển thị cho user quét
    private Boolean requiresPayment; // true nếu cần redirect đến payment gateway
    private String bankName; // Tên ngân hàng nhận thanh toán
    private String accountNumber; // Số tài khoản nhận thanh toán
    private String accountName; // Tên chủ tài khoản
    private String paymentReference; // Nội dung chuyển khoản (DH{orderId})
    private Map<String, String> paymentFormFields; // Form fields cho Payment Gateway (nếu dùng Payment Gateway API)
}


package com.ecommerce.controller;

import com.ecommerce.service.SePayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/sepay")
@CrossOrigin(origins = "*")  // Cho phép tất cả origins (webhook từ SEPAY)
@RequiredArgsConstructor
public class SePayController {

    private final SePayService sePayService;

    /**
     * Webhook endpoint để nhận callback từ SEPAY
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> webhook(
            @RequestBody Map<String, Object> webhookData,
            @RequestHeader(value = "x-sepay-secret", required = false) String sepaySecret,
            @RequestHeader(value = "x-webhook-secret", required = false) String webhookSecret
    ) {
        // Log tất cả webhook requests để debug
        System.out.println("========================================");
        System.out.println("📥 SEPAY WEBHOOK RECEIVED");
        System.out.println("========================================");
        System.out.println("Headers:");
        System.out.println("  - x-sepay-secret: " + (sepaySecret != null ? "***" : "null"));
        System.out.println("  - x-webhook-secret: " + (webhookSecret != null ? "***" : "null"));
        System.out.println("Body (RAW):");
        System.out.println("  " + webhookData);
        System.out.println("Body (DETAILED):");
        webhookData.forEach((key, value) -> {
            System.out.println("  - " + key + ": " + value + " (type: " + (value != null ? value.getClass().getSimpleName() : "null") + ")");
        });
        System.out.println("========================================");
        
        try {
            // Xác thực webhook (dùng header x-sepay-secret hoặc x-webhook-secret)
            String secretHeader = sepaySecret != null ? sepaySecret : webhookSecret;
            boolean verified = sePayService.verifyWebhook(secretHeader);
            if (!verified) {
                System.err.println("❌ Webhook verification failed!");
                System.err.println("   Configured secret: " + (sePayService.getWebhookSecret() != null && !sePayService.getWebhookSecret().equals("YOUR_WEBHOOK_SECRET") ? "***" : "not configured"));
                System.err.println("   Received header: " + (secretHeader != null ? "***" : "null"));
                return ResponseEntity.status(401).body(Map.of("success", false, "error", "invalid_secret"));
            }
            System.out.println("✅ Webhook verification passed");

            // Xử lý webhook
            sePayService.handleWebhook(webhookData);

            // Trả về 200 OK với success: true để SEPAY biết đã nhận được
            System.out.println("✅ Webhook processed successfully");
            System.out.println("========================================");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            // Log error nhưng vẫn trả về 200 với success: false để SEPAY không retry liên tục
            System.err.println("❌ SEPAY webhook error: " + e.getMessage());
            e.printStackTrace();
            System.out.println("========================================");
            return ResponseEntity.ok(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Return URL sau khi thanh toán thành công
     */
    @GetMapping("/return")
    public ResponseEntity<Map<String, String>> returnUrl(
            @RequestParam Long orderId,
            @RequestParam(required = false) String status
    ) {
        // Redirect về frontend với orderId
        return ResponseEntity.ok(Map.of(
                "redirect", "/orders/" + orderId,
                "status", status != null ? status : "unknown"
        ));
    }

    /**
     * Test endpoint để kiểm tra webhook có hoạt động không
     * Truy cập: GET /api/sepay/webhook/test
     */
    @GetMapping("/webhook/test")
    public ResponseEntity<Map<String, Object>> testWebhook() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "message", "Webhook endpoint đang hoạt động!",
                "note", "SEPAY sẽ gọi POST /api/sepay/webhook khi có chuyển khoản",
                "url", "https://saul-unbaffling-norah.ngrok-free.dev/api/sepay/webhook"
        ));
    }

    /**
     * Test endpoint để simulate webhook với data thật (dùng để test)
     * POST /api/sepay/webhook/simulate?orderId={orderId}
     */
    @PostMapping("/webhook/simulate")
    public ResponseEntity<Map<String, Object>> simulateWebhook(
            @RequestParam Long orderId
    ) {
        try {
            // Tạo webhook data giống như SEPAY gửi, nhưng dùng orderId thật
            Map<String, Object> webhookData = new java.util.HashMap<>();
            webhookData.put("notification_type", "PAYMENT_SUCCESS");
            webhookData.put("timestamp", System.currentTimeMillis() / 1000);
            
            // Tạo order object với data thật
            Map<String, Object> orderObj = new java.util.HashMap<>();
            orderObj.put("order_invoice_number", "DH" + orderId);
            orderObj.put("order_id", "DH" + orderId);
            orderObj.put("order_status", "CAPTURED");
            orderObj.put("order_amount", 50000); // Test amount
            orderObj.put("order_currency", "VND");
            orderObj.put("order_description", "Thanh toan don hang DH" + orderId + " - Order ID: " + orderId);
            webhookData.put("order", orderObj);
            
            // Tạo transaction object
            Map<String, Object> transactionObj = new java.util.HashMap<>();
            transactionObj.put("transaction_status", "APPROVED");
            transactionObj.put("transaction_amount", 50000);
            transactionObj.put("transaction_id", "TEST_TXN_" + System.currentTimeMillis());
            transactionObj.put("payment_method", "BANK_TRANSFER");
            webhookData.put("transaction", transactionObj);
            
            System.out.println("🧪 Simulating webhook for orderId: " + orderId);
            
            // Xử lý webhook
            sePayService.handleWebhook(webhookData);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Webhook simulated successfully for orderId: " + orderId
            ));
        } catch (Exception e) {
            System.err.println("❌ Error simulating webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}


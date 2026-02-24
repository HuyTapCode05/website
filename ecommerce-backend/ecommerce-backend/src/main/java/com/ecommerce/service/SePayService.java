package com.ecommerce.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ecommerce.enums.OrderStatus;
import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SePayService {

    private final OrderRepository orderRepository;

    @Value("${sepay.bank:VietinBank}")
    private String sepayBank;

    @Value("${sepay.account.number:}")
    private String sepayAccountNumber;

    @Value("${sepay.account.name:}")
    private String sepayAccountName;
    
    // Payment Gateway API credentials
    @Value("${sepay.merchant.id:}")
    private String merchantId;
    
    @Value("${sepay.merchant.secret.key:}")
    private String merchantSecretKey;
    
    @Value("${sepay.env:sandbox}")
    private String sepayEnv;
    
    // Getter methods để trả về thông tin tài khoản
    public String getBankName() {
        return sepayBank;
    }
    
    public String getAccountNumber() {
        return sepayAccountNumber;
    }
    
    public String getAccountName() {
        return sepayAccountName;
    }

    @Value("${sepay.webhook.secret:}")
    private String webhookSecret;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;
    
    // Getter để controller có thể kiểm tra secret
    public String getWebhookSecret() {
        return webhookSecret;
    }

    /**
     * Tạo Payment Gateway checkout URL và form fields (theo code mẫu SEPAY)
     * Sử dụng Payment Gateway API thay vì QR template
     */
    public Map<String, Object> createPaymentGatewayCheckout(Order order) {
        try {
            // Kiểm tra credentials
            if (merchantId == null || merchantId.isBlank() || merchantId.equals("YOUR_MERCHANT_ID")) {
                // Fallback về QR template nếu chưa cấu hình Payment Gateway
                System.out.println("⚠️  Payment Gateway chưa được cấu hình, dùng QR template");
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("type", "qr");
                result.put("qrCode", createQRPaymentUrl(order));
                result.put("paymentUrl", null);
                result.put("bankName", getBankName());
                result.put("accountNumber", getAccountNumber());
                result.put("accountName", getAccountName());
                result.put("paymentReference", "DH" + order.getId());
                return result;
            }
            
            long amount = order.getTotalAmount()
                    .add(order.getShippingFee())
                    .subtract(order.getDiscountAmount())
                    .longValue();
            
            // ⚠️ LƯU Ý: SEPAY Payment Gateway sandbox có thể không hoạt động
            // Fallback về QR code template nếu đang dùng sandbox
            if ("sandbox".equals(sepayEnv)) {
                System.out.println("⚠️  SEPAY sandbox có thể không hoạt động, dùng QR template");
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("type", "qr");
                result.put("qrCode", createQRPaymentUrl(order));
                result.put("paymentUrl", null);
                result.put("bankName", getBankName());
                result.put("accountNumber", getAccountNumber());
                result.put("accountName", getAccountName());
                result.put("paymentReference", "DH" + order.getId());
                result.put("formFields", null);
                return result;
            }
            
            // Tạo checkout URL (production)
            String checkoutBaseUrl = "https://sepay.vn/pg/checkout";
            
            // Tạo form fields
            Map<String, String> formFields = new java.util.HashMap<>();
            formFields.put("payment_method", "BANK_TRANSFER");
            formFields.put("order_invoice_number", "DH" + order.getId()); // Format: DH{orderId}
            formFields.put("order_id", "DH" + order.getId()); // Thêm order_id để dễ tra cứu
            formFields.put("order_amount", String.valueOf(amount));
            formFields.put("currency", "VND");
            formFields.put("order_description", "Thanh toan don hang DH" + order.getId() + " - Order ID: " + order.getId()); // Thêm orderId vào description
            formFields.put("success_url", appBaseUrl + "/api/sepay/return?orderId=" + order.getId() + "&status=success");
            formFields.put("error_url", appBaseUrl + "/api/sepay/return?orderId=" + order.getId() + "&status=error");
            formFields.put("cancel_url", appBaseUrl + "/api/sepay/return?orderId=" + order.getId() + "&status=cancel");
            formFields.put("merchant_id", merchantId);
            
            // TODO: Tạo signature/hash từ formFields + secret_key (theo SEPAY API docs)
            // formFields.put("signature", generateSignature(formFields, merchantSecretKey));
            
            Map<String, Object> result = new java.util.HashMap<>();
            result.put("type", "gateway");
            result.put("checkoutUrl", checkoutBaseUrl);
            result.put("formFields", formFields);
            result.put("paymentUrl", null);
            result.put("qrCode", null);
            result.put("paymentReference", "DH" + order.getId());
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo Payment Gateway checkout: " + e.getMessage(), e);
        }
    }
    
    /**
     * Tạo QR code URL từ SEPAY (dùng template URL, không cần gọi API)
     * Format: https://qr.sepay.vn/img?bank={bank}&acc={acc}&template=compact&amount={amount}&des={des}
     * Fallback method khi Payment Gateway chưa được cấu hình
     */
    public String createQRPaymentUrl(Order order) {
        try {
            // Kiểm tra thông tin ngân hàng
            if (sepayAccountNumber == null || sepayAccountNumber.isBlank()) {
                throw new RuntimeException("SEPAY account number chưa được cấu hình. Vui lòng cập nhật sepay.account.number trong application.properties");
            }

            long amount = order.getTotalAmount()
                    .add(order.getShippingFee())
                    .subtract(order.getDiscountAmount())
                    .longValue();

            // Tạo mã đơn hàng để ghi vào nội dung chuyển khoản (format: DH{orderId})
            String orderRef = "DH" + order.getId();
            
            // Tạo QR code URL từ template SEPAY
            String qrUrl = String.format(
                    "https://qr.sepay.vn/img?bank=%s&acc=%s&template=compact&amount=%d&des=%s",
                    java.net.URLEncoder.encode(sepayBank, java.nio.charset.StandardCharsets.UTF_8),
                    java.net.URLEncoder.encode(sepayAccountNumber, java.nio.charset.StandardCharsets.UTF_8),
                    amount,
                    java.net.URLEncoder.encode(orderRef, java.nio.charset.StandardCharsets.UTF_8)
            );

            return qrUrl;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo QR code URL: " + e.getMessage(), e);
        }
    }


    /**
     * Xác thực webhook từ SEPAY
     */
    public boolean verifyWebhook(String secretHeader) {
        // Trim và normalize webhookSecret để loại bỏ khoảng trắng và comment
        String normalizedSecret = webhookSecret != null ? webhookSecret.trim().split("#")[0].trim() : "";
        
        // Log để debug
        System.out.println("🔍 Webhook verification:");
        System.out.println("   - Configured secret: [" + (normalizedSecret.isEmpty() ? "empty" : normalizedSecret) + "]");
        System.out.println("   - Received header: [" + (secretHeader != null ? secretHeader : "null") + "]");
        
        // Nếu chưa cấu hình secret (null, blank, hoặc placeholder) -> bỏ qua verify
        if (normalizedSecret.isEmpty() || 
            normalizedSecret.equals("YOUR_WEBHOOK_SECRET") || 
            normalizedSecret.equals("YOUR_SEPAY_API_KEY")) {
            System.out.println("⚠️  Webhook secret chưa được cấu hình, bỏ qua verification");
            return true; // không cấu hình secret -> bỏ qua verify
        }
        
        // Nếu có cấu hình secret nhưng không có header -> fail
        if (secretHeader == null || secretHeader.isBlank()) {
            System.err.println("❌ Webhook secret đã được cấu hình nhưng không có secret header");
            return false;
        }
        
        // So sánh secret (trim cả 2 để đảm bảo)
        if (secretHeader.trim().equals(normalizedSecret)) {
            System.out.println("✅ Webhook secret verified");
            return true;
        }
        
        System.err.println("❌ Webhook secret không khớp");
        System.err.println("   Expected: [" + normalizedSecret + "]");
        System.err.println("   Received: [" + secretHeader.trim() + "]");
        return false;
    }

    /**
     * Xử lý webhook callback từ SEPAY
     * Hỗ trợ 2 format:
     * 1. Format từ Bank Account (QR code): transferType, transferAmount, content
     * 2. Format từ Payment Gateway API: order_invoice_number, order_amount, status
     */
    public void handleWebhook(Map<String, Object> webhookData) {
        try {
            System.out.println("🔍 Processing webhook data...");
            System.out.println("🔍 All webhook keys:");
            webhookData.keySet().forEach(key -> {
                Object value = webhookData.get(key);
                System.out.println("  - " + key + ": " + value + " (type: " + (value != null ? value.getClass().getSimpleName() : "null") + ")");
            });
            
            // Kiểm tra format Payment Gateway API (có nested objects: order, transaction)
            @SuppressWarnings("unchecked")
            Map<String, Object> orderObj = (Map<String, Object>) webhookData.get("order");
            @SuppressWarnings("unchecked")
            Map<String, Object> transactionObj = (Map<String, Object>) webhookData.get("transaction");
            String notificationType = getStringValue(webhookData, "notification_type");
            
            // Nếu có order object -> đây là Payment Gateway API format
            if (orderObj != null && !orderObj.isEmpty()) {
                System.out.println("  - Detected Payment Gateway API format (nested objects)");
                
                // Parse từ order object
                String orderInvoiceNumber = getStringValue(orderObj, "order_invoice_number");
                String orderStatus = getStringValue(orderObj, "order_status");
                Number orderAmount = getNumberValue(orderObj, "order_amount");
                String orderIdFromOrder = getStringValue(orderObj, "order_id");
                String orderDescription = getStringValue(orderObj, "order_description");
                
                // Parse từ custom_data (nếu có) - có thể chứa orderId
                @SuppressWarnings("unchecked")
                Map<String, Object> customData = (Map<String, Object>) orderObj.get("custom_data");
                String customOrderId = null;
                if (customData != null) {
                    Object orderIdObj = customData.get("orderId");
                    if (orderIdObj != null) {
                        customOrderId = orderIdObj.toString();
                    }
                }
                
                // Parse từ transaction object (nếu có)
                String transactionStatus = transactionObj != null ? getStringValue(transactionObj, "transaction_status") : null;
                Number transactionAmount = transactionObj != null ? getNumberValue(transactionObj, "transaction_amount") : null;
                String transactionId = transactionObj != null ? getStringValue(transactionObj, "transaction_id") : null;
                
                System.out.println("  - order_invoice_number: " + orderInvoiceNumber);
                System.out.println("  - order_status: " + orderStatus);
                System.out.println("  - order_amount: " + (orderAmount != null ? orderAmount.longValue() : "null"));
                System.out.println("  - order_id: " + orderIdFromOrder);
                System.out.println("  - notification_type: " + notificationType);
                System.out.println("  - transaction_status: " + transactionStatus);
                
                // Parse orderId từ nhiều nguồn:
                // 1. order_invoice_number (có thể là "DH{orderId}" hoặc "INV-...")
                // 2. order_id (có thể là "TEST_ORDER_..." hoặc "DH{orderId}")
                // 3. order_description (có thể chứa "DH{orderId}")
                Long parsedOrderId = null;
                
                // Thử parse từ order_invoice_number
                if (orderInvoiceNumber != null && !orderInvoiceNumber.isBlank()) {
                    parsedOrderId = parseOrderIdFromInvoiceNumber(orderInvoiceNumber);
                }
                
                // Thử parse từ order_id
                if (parsedOrderId == null && orderIdFromOrder != null && !orderIdFromOrder.isBlank()) {
                    parsedOrderId = parseOrderIdFromInvoiceNumber(orderIdFromOrder);
                    if (parsedOrderId == null) {
                        try {
                            // Thử parse trực tiếp nếu là số
                            parsedOrderId = Long.parseLong(orderIdFromOrder);
                        } catch (NumberFormatException e) {
                            // Ignore
                        }
                    }
                }
                
                // Thử parse từ order_description (có thể chứa "DH{orderId}" hoặc "Order ID: {orderId}")
                if (parsedOrderId == null && orderDescription != null && !orderDescription.isBlank()) {
                    parsedOrderId = parseOrderIdFromInvoiceNumber(orderDescription);
                    // Thử parse format "Order ID: {orderId}" hoặc "Order ID:{orderId}"
                    if (parsedOrderId == null) {
                        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Order\\s+ID\\s*:?\\s*(\\d+)", java.util.regex.Pattern.CASE_INSENSITIVE);
                        java.util.regex.Matcher matcher = pattern.matcher(orderDescription);
                        if (matcher.find()) {
                            try {
                                parsedOrderId = Long.parseLong(matcher.group(1));
                                System.out.println("  - Parsed orderId from order_description: " + parsedOrderId);
                            } catch (NumberFormatException e) {
                                // Ignore
                            }
                        }
                    }
                }
                
                // Thử parse từ custom_data.orderId (nếu có)
                if (parsedOrderId == null && customOrderId != null && !customOrderId.isBlank()) {
                    try {
                        parsedOrderId = Long.parseLong(customOrderId);
                        System.out.println("  - Parsed orderId from custom_data.orderId: " + parsedOrderId);
                    } catch (NumberFormatException e) {
                        // Ignore
                    }
                }
                
                // Nếu vẫn không parse được, thử tìm order theo paymentReference (DH{orderId}) trong database
                if (parsedOrderId == null) {
                    // Thử tìm order theo paymentReference nếu có
                    String searchReference = orderInvoiceNumber != null ? orderInvoiceNumber : orderIdFromOrder;
                    if (searchReference != null && !searchReference.isBlank()) {
                        // Tìm order có paymentReference = "DH{orderId}" hoặc chứa searchReference
                        java.util.List<Order> orders = orderRepository.findAll();
                        for (Order o : orders) {
                            if (o.getPaymentReference() != null && o.getPaymentReference().equals(searchReference)) {
                                parsedOrderId = o.getId();
                                System.out.println("  - Found order by paymentReference: " + searchReference + " -> Order ID: " + parsedOrderId);
                                break;
                            }
                        }
                    }
                }
                
                // Nếu vẫn không tìm được, log và skip
                if (parsedOrderId == null) {
                    System.err.println("⚠️  Cannot parse or find orderId from:");
                    System.err.println("   - order_invoice_number: " + orderInvoiceNumber);
                    System.err.println("   - order_id: " + orderIdFromOrder);
                    System.err.println("   - order_description: " + orderDescription);
                    System.err.println("⚠️  Skip: Cannot find orderId");
                    return;
                }
                
                // Chỉ xử lý khi notification_type = "PAYMENT_SUCCESS" và status = "CAPTURED" hoặc "APPROVED"
                if (!"PAYMENT_SUCCESS".equalsIgnoreCase(notificationType)) {
                    System.out.println("⚠️  Skip: notification_type is not PAYMENT_SUCCESS (current: " + notificationType + ")");
                    return;
                }
                
                boolean isSuccess = "CAPTURED".equalsIgnoreCase(orderStatus) || 
                                   "APPROVED".equalsIgnoreCase(transactionStatus) ||
                                   "APPROVED".equalsIgnoreCase(orderStatus);
                if (!isSuccess) {
                    System.out.println("⚠️  Skip: Order/Transaction status is not success (order_status: " + orderStatus + ", transaction_status: " + transactionStatus + ")");
                    return;
                }
                
                // Lấy amount từ order_amount hoặc transaction_amount
                Number finalAmount = orderAmount != null ? orderAmount : transactionAmount;
                if (finalAmount == null || finalAmount.longValue() <= 0) {
                    System.out.println("⚠️  Skip: Invalid amount");
                    return;
                }
                
                long transferAmount = finalAmount.longValue();
                
                // Tìm order và cập nhật
                updateOrderStatus(parsedOrderId, transferAmount, orderInvoiceNumber != null ? orderInvoiceNumber : orderIdFromOrder, transactionId);
                return;
            }
            
            // Fallback: Thử parse từ root level (format cũ)
            String orderInvoiceNumber = getStringValue(webhookData, "order_invoice_number");
            String status = getStringValue(webhookData, "status");
            Number orderAmount = getNumberValue(webhookData, "order_amount");
            
            if (orderInvoiceNumber != null && !orderInvoiceNumber.isBlank()) {
                System.out.println("  - Detected Payment Gateway API format (root level)");
                Long parsedOrderId = parseOrderIdFromInvoiceNumber(orderInvoiceNumber);
                if (parsedOrderId != null && orderAmount != null && orderAmount.longValue() > 0) {
                    String finalStatus = status;
                    if (finalStatus == null || "success".equalsIgnoreCase(finalStatus) || "paid".equalsIgnoreCase(finalStatus)) {
                        updateOrderStatus(parsedOrderId, orderAmount.longValue(), orderInvoiceNumber, null);
                        return;
                    }
                }
            }
            
            // Fallback: Parse theo format Bank Account (QR code)
            System.out.println("  - Detected Bank Account (QR code) format");
            String gateway = getStringValue(webhookData, "gateway");
            String transferType = getStringValue(webhookData, "transferType");
            Number amountNum = getNumberValue(webhookData, "transferAmount");
            String content = getStringValue(webhookData, "content");
            String referenceCode = getStringValue(webhookData, "referenceCode");
            String code = getStringValue(webhookData, "code");
            
            System.out.println("  - gateway: " + gateway);
            System.out.println("  - transferType: " + transferType);
            System.out.println("  - transferAmount: " + (amountNum != null ? amountNum.longValue() : "null"));
            System.out.println("  - content: " + content);
            
            // Chỉ xử lý khi transferType = "in" (tiền vào)
            if (!"in".equals(transferType)) {
                System.out.println("⚠️  Skip: transferType is not 'in' (current: " + transferType + ")");
                return;
            }
            
            if (amountNum == null || amountNum.longValue() <= 0) {
                System.out.println("⚠️  Skip: Invalid transferAmount");
                return;
            }
            
            long transferAmount = amountNum.longValue();
            
            // Parse orderId từ content (format: DH{orderId})
            Long orderId = parseOrderIdFromContent(content);
            if (orderId == null) {
                System.err.println("⚠️  Skip: Cannot find orderId in content");
                return;
            }
            
            // Tìm order và cập nhật
            updateOrderStatus(orderId, transferAmount, content, referenceCode != null ? referenceCode : code);
        } catch (Exception e) {
            System.err.println("❌ Lỗi xử lý SEPAY webhook: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi xử lý webhook: " + e.getMessage(), e);
        }
    }
    
    // Helper methods
    private String getStringValue(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null) return null;
        return value.toString();
    }
    
    private Number getNumberValue(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null) return null;
        if (value instanceof Number) return (Number) value;
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    private Long parseOrderIdFromInvoiceNumber(String invoiceNumber) {
        if (invoiceNumber == null || invoiceNumber.isBlank()) return null;
        
        // Thử parse format "DH{number}" (ví dụ: "DH3", "DH123")
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("DH(\\d+)", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher matcher = pattern.matcher(invoiceNumber);
        if (matcher.find()) {
            try {
                return Long.parseLong(matcher.group(1));
            } catch (NumberFormatException e) {
                // Ignore
            }
        }
        
        // Thử parse format "TEST_ORDER_{number}" (ví dụ: "TEST_ORDER_1770573276")
        // ⚠️ LƯU Ý: Test order ID từ SEPAY không phải orderId thật, nên skip
        pattern = java.util.regex.Pattern.compile("TEST_ORDER_(\\d+)", java.util.regex.Pattern.CASE_INSENSITIVE);
        matcher = pattern.matcher(invoiceNumber);
        if (matcher.find()) {
            // ⚠️ TEST ORDER: Không parse vì đây là test data, không phải orderId thật
            System.out.println("  - ⚠️  Detected TEST_ORDER format, skipping parse (test data)");
            return null;
        }
        
        // Thử parse format "INV-{date}-{number}" (ví dụ: "INV-20260209-396714")
        // ⚠️ LƯU Ý: Invoice number từ SEPAY không chứa orderId, nên skip
        pattern = java.util.regex.Pattern.compile("INV-\\d+-\\d+", java.util.regex.Pattern.CASE_INSENSITIVE);
        matcher = pattern.matcher(invoiceNumber);
        if (matcher.find()) {
            // ⚠️ SEPAY INVOICE: Không parse vì đây là invoice number tự động, không phải orderId
            System.out.println("  - ⚠️  Detected INV- format, skipping parse (SEPAY auto-generated invoice)");
            return null;
        }
        
        return null;
    }
    
    private Long parseOrderIdFromContent(String content) {
        if (content == null || content.isBlank()) return null;
        return parseOrderIdFromInvoiceNumber(content);
    }
    
    private void updateOrderStatus(Long orderId, long transferAmount, String paymentReference, String transactionId) {
            
            // Tìm order theo ID
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) {
                System.err.println("⚠️  Skip: Order not found with ID: " + orderId);
                return; // Order không tồn tại
            }
            
            System.out.println("  - Found order: #" + orderId + " (Status: " + order.getOrderStatus() + ")");
            
            // Kiểm tra order chưa được thanh toán và số tiền khớp
            if (order.getOrderStatus() != OrderStatus.PENDING) {
                System.out.println("⚠️  Skip: Order already processed (Status: " + order.getOrderStatus() + ")");
                return; // Order đã được xử lý rồi
            }
            
            long expectedAmount = order.getTotalAmount()
                    .add(order.getShippingFee())
                    .subtract(order.getDiscountAmount())
                    .longValue();
            
            System.out.println("  - Expected amount: " + expectedAmount);
            System.out.println("  - Transfer amount: " + transferAmount);
            
            // Cho phép sai số nhỏ (ví dụ: ±1000 VNĐ) để xử lý làm tròn hoặc phí giao dịch
            long tolerance = 1000; // Cho phép sai số ±1000 VNĐ
            long difference = Math.abs(transferAmount - expectedAmount);
            
            if (difference > tolerance) {
                System.err.println("⚠️  Skip: Amount mismatch (expected: " + expectedAmount + ", got: " + transferAmount + ", difference: " + difference + ")");
                return; // Số tiền không khớp (sai số quá lớn)
            }
            
            if (difference > 0) {
                System.out.println("⚠️  Amount difference: " + difference + " VNĐ (within tolerance, proceeding...)");
            }
            
            // Cập nhật order status thành PAID và lưu thông tin thanh toán
            order.setOrderStatus(OrderStatus.PAID);
            order.setPaidAt(java.time.LocalDateTime.now());
            order.setPaymentAmount(java.math.BigDecimal.valueOf(transferAmount));
            order.setPaymentReference(paymentReference); // Lưu nội dung chuyển khoản (DH{orderId})
            
            // Lưu transactionId nếu có
            if (transactionId != null && !transactionId.isBlank()) {
                order.setTransactionId(transactionId);
            }
            
            orderRepository.save(order);
            
            System.out.println("✅ SEPAY webhook: Order #" + orderId + " đã thanh toán thành công: " + transferAmount + " VNĐ");
            System.out.println("   - Paid at: " + order.getPaidAt());
            System.out.println("   - Payment amount: " + order.getPaymentAmount() + " VNĐ");
            System.out.println("   - Payment reference: " + order.getPaymentReference());
    }
}


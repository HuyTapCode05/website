import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export const useCheckout = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const sessionId = localStorage.getItem("sessionId");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [note, setNote] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  // LOAD CART
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await api.get("/api/cart", {
          params: { sessionId },
        });

        setCartTotal(res.data.total || 0);
        setFinalTotal(res.data.total || 0);
      } catch (err) {
        console.log("Load cart error:", err);
      }
    };

    loadCart();
  }, []);

  // APPLY COUPON
  const applyCoupon = async () => {
    if (!couponCode.trim()) return alert("Bạn chưa nhập mã giảm giá!");

    try {
      const res = await api.post(
        "/api/cart/apply-coupon",
        { code: couponCode },
        { params: { sessionId } }
      );

      setDiscount(res.data.discountAmount);
      setFinalTotal(res.data.finalTotal);

      alert("🎉 Mã giảm giá đã được áp dụng!");
    } catch (err) {
      console.log("Apply coupon error:", err);
      setDiscount(0);
      setFinalTotal(cartTotal);
      alert("❌ Mã giảm giá không hợp lệ!");
    }
  };

  // CHECKOUT
  const handleCheckout = async () => {
    if (!userId) {
      alert("❌ Bạn cần đăng nhập để đặt hàng!");
      return navigate("/login");
    }

    try {
      // Nếu chọn BANKING, gửi SEPAY cho backend (backend xử lý SEPAY)
      const backendPaymentMethod = paymentMethod === "BANKING" ? "SEPAY" : paymentMethod;
      
      const body = {
        paymentMethod: backendPaymentMethod,
        couponCode: couponCode || null,
        note,
      };

      const res = await api.post("/api/orders/checkout", body, {
        params: { userId, sessionId },
      });

      // Nếu là BANKING (SEPAY) và có QR code, hiển thị QR code
      if (paymentMethod === "BANKING" && res.data.requiresPayment && res.data.qrCode) {
        // Lưu thông tin để hiển thị QR code
        localStorage.setItem("pendingOrder", JSON.stringify({
          orderId: res.data.order.id,
          orderNo: res.data.order.orderNo,
          paymentReference: res.data.paymentReference || ("DH" + res.data.order.id), // Nội dung chuyển khoản (DH{orderId})
          qrCode: res.data.qrCode,
          amount: res.data.order.totalAmount + res.data.order.shippingFee - res.data.order.discountAmount,
          bankName: res.data.bankName,
          accountNumber: res.data.accountNumber,
          accountName: res.data.accountName
        }));
        navigate("/checkout/qr");
        return;
      }

      // Nếu là BANKING (SEPAY) và có Payment Gateway form fields, submit form đến SEPAY
      if (paymentMethod === "BANKING" && res.data.requiresPayment && res.data.paymentFormFields && res.data.paymentUrl) {
        // Tạo form và submit đến SEPAY Payment Gateway
        const form = document.createElement("form");
        form.method = "POST";
        form.action = res.data.paymentUrl;
        
        // Thêm các form fields
        Object.keys(res.data.paymentFormFields).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = res.data.paymentFormFields[key];
          form.appendChild(input);
        });
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
        return;
      }

      // Nếu là BANKING (SEPAY) và có paymentUrl (fallback), redirect đến SEPAY
      if (paymentMethod === "BANKING" && res.data.requiresPayment && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
        return;
      }

      alert("🎉 Đặt hàng thành công!");

      await api.post("/api/cart/clear", null, { params: { sessionId } });

      navigate("/orders/" + res.data.order.id);
    } catch (err: any) {
      console.error("Checkout error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Lỗi khi đặt hàng!";
      alert("❌ " + errorMessage);
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    note,
    setNote,
    cartTotal,
    discount,
    finalTotal,
    applyCoupon,
    handleCheckout,
  };
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axiosClient";
import SePayQRCode from "../../components/checkout/SePayQRCode";

export default function SePayQRPage() {
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const pendingOrder = localStorage.getItem("pendingOrder");
    if (!pendingOrder) {
      navigate("/checkout");
      return;
    }

    const order = JSON.parse(pendingOrder);
    setOrderInfo(order);

    // Polling để kiểm tra trạng thái thanh toán - Tự động cập nhật khi thanh toán thành công
    let checkCount = 0;
    let isChecking = false; // Dùng biến local thay vì state để tránh re-render
    const maxChecks = 600; // Tối đa 10 phút (600 * 1 giây)
    
    const checkPaymentStatus = async () => {
      if (isChecking) return; // Skip nếu đang check
      
      checkCount++;
      if (checkCount > maxChecks) {
        clearInterval(checkInterval);
        alert("⏱️ Đã hết thời gian chờ thanh toán. Vui lòng thử lại.");
        navigate("/checkout");
        return;
      }
      
      try {
        isChecking = true;
        setChecking(true); // Update UI
        const userId = localStorage.getItem("userId");
        if (!userId) {
          clearInterval(checkInterval);
          navigate("/checkout");
          return;
        }

        const res = await api.get(`/api/orders/${order.orderId}`, {
          params: { userId: userId }
        });

        const currentStatus = res.data.orderStatus?.toUpperCase() || res.data.orderStatus;
        

        // Nếu đã thanh toán thành công (case-insensitive)
        if (currentStatus === "PAID") {
          clearInterval(checkInterval);
          localStorage.removeItem("pendingOrder");
          
          // Hiển thị thông báo thành công
          const successMessage = document.createElement("div");
          successMessage.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in";
          successMessage.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-semibold">🎉 Thanh toán thành công!</span>
          `;
          document.body.appendChild(successMessage);
          
          // Tự động redirect sau 1.5 giây
          setTimeout(() => {
            navigate(`/orders/${order.orderId}`, { replace: true });
          }, 1500);
          return;
        }
      } catch (err: any) {
        // Chỉ log error nếu không phải 404 (order chưa tồn tại)
        if (err.response?.status !== 404) {
          console.error("Check payment status error:", err);
        }
        // Nếu order không tồn tại, có thể đã bị xóa -> redirect về checkout
        if (err.response?.status === 404) {
          clearInterval(checkInterval);
          alert("⚠️ Đơn hàng không tồn tại. Vui lòng thử lại.");
          navigate("/checkout");
          return;
        }
      } finally {
        isChecking = false;
        setChecking(false); // Update UI
      }
    };
    
    // Check ngay lập tức lần đầu
    checkPaymentStatus();
    
    // Sau đó check mỗi 1 giây
    const checkInterval = setInterval(checkPaymentStatus, 1000);

    return () => clearInterval(checkInterval);
  }, [navigate]); // Bỏ 'checking' khỏi dependency array

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/checkout")}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-800 mb-2 sm:mb-4 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Chuyển khoản ngân hàng
          </h1>
        </div>

        {/* QR Code */}
        <SePayQRCode
          qrCode={orderInfo.qrCode}
          orderNo={orderInfo.orderNo}
          paymentReference={orderInfo.paymentReference}
          amount={orderInfo.amount}
          bankName={orderInfo.bankName}
          accountNumber={orderInfo.accountNumber}
          accountName={orderInfo.accountName}
        />

        {/* Manual verify button */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className={`w-2 h-2 rounded-full ${checking ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
            <p className="text-xs sm:text-sm text-gray-600">
              {checking ? "Đang kiểm tra..." : "Đang chờ thanh toán..."}
            </p>
          </div>
          
          <button
            onClick={async () => {
              if (!orderInfo) return;
              if (verifying) return;
              
              try {
                setVerifying(true);
                const userId = localStorage.getItem("userId");
                if (!userId) {
                  alert("❌ Bạn cần đăng nhập!");
                  return;
                }
                
                await api.post(`/api/orders/${orderInfo.orderId}/verify-payment`, null, {
                  params: { userId: userId }
                });
                
                const orderRes = await api.get(`/api/orders/${orderInfo.orderId}`, {
                  params: { userId: userId }
                });
                
                const currentStatus = orderRes.data.orderStatus?.toUpperCase() || orderRes.data.orderStatus;
                
                if (currentStatus === "PAID") {
                  localStorage.removeItem("pendingOrder");
                  navigate(`/orders/${orderInfo.orderId}`, { replace: true });
                } else {
                  alert("⚠️ Đơn hàng chưa được cập nhật. Vui lòng thử lại sau.");
                }
              } catch (err: any) {
                const errorMsg = err.response?.data?.message || "Lỗi khi xác nhận thanh toán";
                alert("❌ " + errorMsg);
              } finally {
                setVerifying(false);
              }
            }}
            disabled={verifying}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
          >
            {verifying ? "Đang xác nhận..." : "✅ Đã chuyển khoản"}
          </button>
        </div>
      </div>
    </div>
  );
}


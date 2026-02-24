import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CouponInput from "../../components/checkout/CouponInput";
import NoteInput from "../../components/checkout/NoteInput";
import PaymentMethodSelect from "../../components/checkout/PaymentMethodSelect";
import SummaryBox from "../../components/checkout/SummaryBox";
import { useCheckout } from "../../hooks/useCheckout";

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
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
  } = useCheckout();

  const handleSubmitOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await handleCheckout();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ color: '#C9A96E' }}>
                Thanh toán
              </p>
              <h1 className="text-2xl font-bold text-white">Hoàn tất đơn hàng</h1>
              <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
                Kiểm tra thông tin và xác nhận đặt hàng
              </p>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#D1D5DB' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Giỏ hàng
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <PaymentMethodSelect
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <CouponInput
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                applyCoupon={applyCoupon}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <NoteInput note={note} setNote={setNote} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-4">
            <SummaryBox
              cartTotal={cartTotal}
              discount={discount}
              finalTotal={finalTotal}
            />

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 space-y-3">
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: isSubmitting ? '#D1D5DB' : '#111827',
                  color: isSubmitting ? '#9CA3AF' : 'white',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Xác nhận đặt hàng
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/cart")}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Quay lại giỏ hàng
              </button>

              <p className="text-center text-gray-400 text-xs pt-1">
                🔒 Thanh toán an toàn & bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
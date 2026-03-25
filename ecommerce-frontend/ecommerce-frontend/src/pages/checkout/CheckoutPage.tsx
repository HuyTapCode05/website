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
    paymentMethod, setPaymentMethod,
    couponCode, setCouponCode,
    note, setNote,
    cartTotal, discount, finalTotal,
    applyCoupon, handleCheckout,
  } = useCheckout();

  const handleSubmitOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try { await handleCheckout(); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A96E' }}>Bước 2 / 3</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Thanh toán</h1>
          <p className="text-sm text-slate-400 mt-2">Kiểm tra thông tin và xác nhận đặt hàng</p>
          {/* Steps */}
          <div className="flex items-center mt-8">
            {[
              { n: 1, label: 'Giỏ hàng', done: true },
              { n: 2, label: 'Thanh toán', active: true },
              { n: 3, label: 'Hoàn tất' },
            ].map((s: any, i) => (
              <div key={s.n} className="flex items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: s.done ? '#22C55E' : s.active ? '#C9A96E' : 'rgba(255,255,255,0.08)',
                      color: s.done || s.active ? '#0f172a' : 'rgba(255,255,255,0.3)',
                    }}>{s.done ? '✓' : s.n}</div>
                  <span className="text-sm font-medium hidden sm:inline" style={{ color: s.active ? '#C9A96E' : s.done ? '#22C55E' : 'rgba(255,255,255,0.25)' }}>{s.label}</span>
                </div>
                {i < 2 && <div className="w-16 h-px mx-4" style={{ background: 'rgba(255,255,255,0.08)' }}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <PaymentMethodSelect paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <CouponInput couponCode={couponCode} setCouponCode={setCouponCode} applyCoupon={applyCoupon} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <NoteInput note={note} setNote={setNote} />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <SummaryBox cartTotal={cartTotal} discount={discount} finalTotal={finalTotal} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
              <button onClick={handleSubmitOrder} disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                style={{
                  background: isSubmitting ? '#e5e7eb' : '#0f172a',
                  color: isSubmitting ? '#9ca3af' : 'white',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}>
                {isSubmitting ? (<><div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div> Đang xử lý...</>) : 'Xác nhận đặt hàng'}
              </button>
              <button onClick={() => navigate("/cart")} className="w-full py-3 rounded-lg text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                Quay lại giỏ hàng
              </button>
              <p className="text-center text-xs text-gray-400">🔒 Thanh toán an toàn & bảo mật</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
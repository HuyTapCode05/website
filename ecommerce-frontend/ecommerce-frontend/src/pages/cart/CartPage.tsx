import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

import CartHeader from "../../components/cart/CartHeader";
import CartList from "../../components/cart/CartList";

export default function CartPage() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const navigate = useNavigate();

  const {
    cart,
    loading,
    total,
    updateQty,
    removeItem,
  } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAFA' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
          <p className="text-gray-500 text-sm font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <CartHeader name={name} email={email} />

        {/* Empty cart */}
        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 sm:p-16 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(201,169,110,0.08)' }}>
              <svg className="w-10 h-10" style={{ color: '#C9A96E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 mb-8 text-sm">Hãy khám phá bộ sưu tập thời trang của chúng tôi</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-300 btn-press"
              style={{ background: '#111827', color: 'white' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Mua sắm ngay
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartList cart={cart} updateQty={updateQty} removeItem={removeItem} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-24">
                {/* Summary Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">Tổng đơn hàng</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-medium text-gray-800">{total?.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-medium text-gray-800">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giảm giá</span>
                    <span className="font-medium text-gray-800">0đ</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-800">Tổng cộng</span>
                      <span className="text-xl font-bold" style={{ color: '#C9A96E' }}>
                        {total?.toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 btn-press"
                    style={{ background: '#111827', color: 'white' }}
                  >
                    Tiến hành thanh toán
                  </button>

                  <p className="text-center text-gray-400 text-xs">
                    🔒 Thanh toán an toàn & bảo mật
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
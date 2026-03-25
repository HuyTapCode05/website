import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import CartList from "../../components/cart/CartList";

export default function CartPage() {
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const { cart, loading, total, updateQty, removeItem } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
          <p className="text-gray-400 text-sm">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  const itemCount = cart?.items?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A96E' }}>Giỏ hàng</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {name ? `Xin chào, ${name}` : 'Giỏ hàng của bạn'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">{itemCount > 0 ? `${itemCount} sản phẩm trong giỏ` : 'Chưa có sản phẩm nào'}</p>

          {/* Steps */}
          <div className="flex items-center mt-8">
            {[
              { n: 1, label: 'Giỏ hàng', active: true },
              { n: 2, label: 'Thanh toán' },
              { n: 3, label: 'Hoàn tất' },
            ].map((s: any, i) => (
              <div key={s.n} className="flex items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: s.active ? '#C9A96E' : 'rgba(255,255,255,0.08)',
                      color: s.active ? '#0f172a' : 'rgba(255,255,255,0.3)',
                    }}>{s.n}</div>
                  <span className="text-sm font-medium hidden sm:inline" style={{ color: s.active ? '#C9A96E' : 'rgba(255,255,255,0.25)' }}>{s.label}</span>
                </div>
                {i < 2 && <div className="w-16 h-px mx-4" style={{ background: 'rgba(255,255,255,0.08)' }}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {itemCount === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 sm:p-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-400 mb-8 text-sm">Khám phá bộ sưu tập thời trang của chúng tôi</p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider bg-slate-950 text-white hover:bg-slate-800 transition-colors">
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CartList cart={cart} updateQty={updateQty} removeItem={removeItem} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden lg:sticky lg:top-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800">Tổng đơn hàng</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính ({itemCount} sp)</span>
                    <span className="font-semibold text-gray-800">{total?.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Vận chuyển</span>
                    <span className="font-semibold text-emerald-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-800">Tổng cộng</span>
                      <span className="text-xl font-bold" style={{ color: '#C9A96E' }}>{total?.toLocaleString()}đ</span>
                    </div>
                  </div>
                  <button onClick={() => navigate("/checkout")}
                    className="w-full py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider bg-slate-950 text-white hover:bg-slate-800 transition-colors">
                    Tiến hành thanh toán
                  </button>
                  <p className="text-center text-xs text-gray-400">🔒 Thanh toán an toàn & bảo mật</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import OrderList from "../../components/orders/OrderList";

export default function OrdersPage() {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [status]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/orders", {
        params: { userId, status },
      });
      setOrders(res.data);
    } catch (err) {
      console.log("Load order error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: "", label: "Tất cả" },
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ color: '#C9A96E' }}>
                Lịch sử
              </p>
              <h1 className="text-2xl font-bold text-white">Đơn hàng của tôi</h1>
              <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
                Theo dõi và quản lý tất cả đơn hàng
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                {orders.length} đơn
              </span>
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#D1D5DB' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Trang chủ
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={{
                background: status === f.value ? '#111827' : 'white',
                color: status === f.value ? 'white' : '#6B7280',
                border: status === f.value ? 'none' : '1px solid #E5E7EB',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
              <p className="text-gray-500 text-sm">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : (
          <OrderList orders={orders} />
        )}
      </div>
    </div>
  );
}
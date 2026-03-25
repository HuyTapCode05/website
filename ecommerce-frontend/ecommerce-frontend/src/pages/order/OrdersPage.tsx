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

  useEffect(() => { loadOrders(); }, [status]);
  const loadOrders = async () => {
    try { setLoading(true); const res = await api.get("/api/orders", { params: { userId, status } }); setOrders(res.data); }
    catch (err) { console.log(err); } finally { setLoading(false); }
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A96E' }}>Lịch sử mua hàng</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Đơn hàng của tôi</h1>
          <p className="text-sm text-slate-400 mt-2">Theo dõi trạng thái và quản lý đơn hàng</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {filters.map(f => {
            const active = status === f.value;
            return (
              <button key={f.value} onClick={() => setStatus(f.value)}
                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  background: active ? '#0f172a' : 'white',
                  color: active ? 'white' : '#6B7280',
                  border: active ? 'none' : '1px solid #e5e7eb',
                }}>
                {f.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
              <p className="text-gray-400 text-sm">Đang tải...</p>
            </div>
          </div>
        ) : (
          <OrderList orders={orders} />
        )}
      </div>
    </div>
  );
}
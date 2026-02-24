import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosClient";
import OrderInfo from "../../components/orders/OrderInfo";
import OrderSummary from "../../components/orders/OrderSummary";
import CancelOrderButton from "../../components/orders/CancelOrderButton";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrderDetail();
  }, []);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/orders/${orderId}`, {
        params: { userId },
      });
      setOrder(res.data);
    } catch (err) {
      console.log("Error load detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      setCancelling(true);
      await api.post(`/api/orders/${orderId}/cancel`, null, {
        params: { userId },
      });
      alert("Đã hủy đơn hàng!");
      navigate("/orders");
    } catch (err) {
      alert("Không thể hủy đơn hàng!");
      console.log(err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAFA' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
          <p className="text-gray-500 text-sm">Đang tải chi tiết...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#FEE2E2' }}>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h1>
            <p className="text-sm text-gray-500 mb-6">Đơn hàng này không tồn tại hoặc đã bị xóa</p>
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all btn-press"
              style={{ background: '#111827', color: 'white' }}
            >
              Quay lại đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ color: '#C9A96E' }}>
                Chi tiết đơn hàng
              </p>
              <h1 className="text-2xl font-bold text-white">
                #{order.orderNo || orderId}
              </h1>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#D1D5DB' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Đơn hàng
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <OrderInfo order={order} />
          <OrderSummary order={order} />
          <CancelOrderButton order={order} cancelOrder={cancelOrder} cancelling={cancelling} />
        </div>
      </div>
    </div>
  );
}
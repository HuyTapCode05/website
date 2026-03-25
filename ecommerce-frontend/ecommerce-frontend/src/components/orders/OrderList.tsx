import { Link } from "react-router-dom";
interface Props { orders: any[]; }

export default function OrderList({ orders }: Props) {
  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: { bg: "#FEF3C7", color: "#D97706", label: "Chờ xác nhận" },
    PAID: { bg: "#DBEAFE", color: "#2563EB", label: "Đã thanh toán" },
    PROCESSING: { bg: "#EDE9FE", color: "#7C3AED", label: "Đang xử lý" },
    SHIPPED: { bg: "#FFEDD5", color: "#EA580C", label: "Đang giao" },
    COMPLETED: { bg: "#DCFCE7", color: "#16A34A", label: "Hoàn thành" },
    CANCELLED: { bg: "#FEE2E2", color: "#DC2626", label: "Đã hủy" },
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Chưa có đơn hàng</h3>
        <p className="text-sm text-gray-400">Đơn hàng sẽ xuất hiện ở đây sau khi bạn mua sắm</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map(order => {
        const s = statusMap[order.orderStatus] || { bg: "#F3F4F6", color: "#6B7280", label: order.orderStatus };
        const total = order.totalAmount + order.shippingFee - order.discountAmount;
        return (
          <Link key={order.id} to={`/orders/${order.id}`}
            className="block bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-bold text-gray-900 text-lg">#{order.orderNo}</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                  <span className="text-lg font-bold" style={{ color: '#C9A96E' }}>{total.toLocaleString()}đ</span>
                  <span className="text-xs text-gray-400">Xem chi tiết →</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
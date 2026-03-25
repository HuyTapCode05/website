interface Props { order: any; }

export default function OrderInfo({ order }: Props) {
  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: { bg: "#FEF3C7", color: "#D97706", label: "Chờ xác nhận" },
    PAID: { bg: "#DBEAFE", color: "#2563EB", label: "Đã thanh toán" },
    PROCESSING: { bg: "#EDE9FE", color: "#7C3AED", label: "Đang xử lý" },
    SHIPPED: { bg: "#FFEDD5", color: "#EA580C", label: "Đang giao" },
    COMPLETED: { bg: "#DCFCE7", color: "#16A34A", label: "Hoàn thành" },
    CANCELLED: { bg: "#FEE2E2", color: "#DC2626", label: "Đã hủy" },
  };
  const s = statusMap[order.orderStatus] || { bg: "#F3F4F6", color: "#6B7280", label: order.orderStatus };
  const paymentLabel = order.paymentMethod === "COD" ? "COD — Khi nhận hàng" : "Chuyển khoản ngân hàng";
  const total = order.totalAmount + order.shippingFee - order.discountAmount;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-3 flex items-center justify-between" style={{ background: s.bg }}>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.label}</span>
        <span className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString("vi-VN")} · {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Mã đơn</p>
          <p className="text-sm font-bold text-gray-900">#{order.orderNo || order.id}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Thanh toán</p>
          <p className="text-sm font-medium text-gray-700">{paymentLabel}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tổng cộng</p>
          <p className="text-sm font-bold" style={{ color: '#C9A96E' }}>{total.toLocaleString()}đ</p>
        </div>
        {order.note && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ghi chú</p>
            <p className="text-sm text-gray-600 line-clamp-2">{order.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
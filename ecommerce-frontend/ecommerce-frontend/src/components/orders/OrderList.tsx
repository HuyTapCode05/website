import { Link } from "react-router-dom";

interface Props {
  orders: any[];
}

export default function OrderList({ orders }: Props) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return { bg: "#FEF3C7", color: "#D97706" };
      case "PAID": return { bg: "#DBEAFE", color: "#2563EB" };
      case "PROCESSING": return { bg: "#EDE9FE", color: "#7C3AED" };
      case "SHIPPED": return { bg: "#FFEDD5", color: "#EA580C" };
      case "COMPLETED": return { bg: "#DCFCE7", color: "#16A34A" };
      case "CANCELLED": return { bg: "#FEE2E2", color: "#DC2626" };
      default: return { bg: "#F3F4F6", color: "#6B7280" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Chờ xác nhận";
      case "PAID": return "Đã thanh toán";
      case "PROCESSING": return "Đang xử lý";
      case "SHIPPED": return "Đang giao hàng";
      case "COMPLETED": return "Đã hoàn thành";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(201,169,110,0.1)' }}>
          <svg className="w-8 h-8" style={{ color: '#C9A96E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Chưa có đơn hàng</h3>
        <p className="text-sm text-gray-500">Đơn hàng của bạn sẽ xuất hiện ở đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const statusStyle = getStatusStyle(order.orderStatus);
        return (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">
                      #{order.orderNo}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}>
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                  <span className="text-lg font-bold text-gray-900">
                    {(order.totalAmount + order.shippingFee - order.discountAmount).toLocaleString()}đ
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: '#C9A96E' }}>
                    Xem chi tiết
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
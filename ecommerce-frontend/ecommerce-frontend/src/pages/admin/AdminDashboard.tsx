import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

interface Order {
  id: number;
  orderNo: string;
  orderStatus: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    // Load independently so partial failures don't block everything
    try {
      const res = await api.get("/api/admin/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.log("Orders load error:", err); }

    try {
      const res = await api.get("/products");
      setProductCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) { console.log("Products load error:", err); }

    try {
      const res = await api.get("/categories");
      setCategoryCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) { console.log("Categories load error:", err); }

    setLoading(false);
  };

  // ---- Computed Stats ----
  const totalRevenue = orders
    .filter((o) => o.orderStatus === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount + o.shippingFee - o.discountAmount, 0);

  const pendingRevenue = orders
    .filter((o) => !["COMPLETED", "CANCELLED"].includes(o.orderStatus))
    .reduce((sum, o) => sum + o.totalAmount + o.shippingFee - o.discountAmount, 0);

  const totalDiscount = orders
    .filter((o) => o.orderStatus !== "CANCELLED")
    .reduce((sum, o) => sum + (o.discountAmount || 0), 0);

  const completedOrders = orders.filter((o) => o.orderStatus === "COMPLETED").length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING").length;
  const processingOrders = orders.filter((o) => o.orderStatus === "PROCESSING").length;
  const shippedOrders = orders.filter((o) => o.orderStatus === "SHIPPED").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "CANCELLED").length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const getStatusStyle = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PENDING: { bg: "#FEF3C7", color: "#D97706", label: "Chờ duyệt" },
      PAID: { bg: "#DBEAFE", color: "#2563EB", label: "Đã thanh toán" },
      PROCESSING: { bg: "#EDE9FE", color: "#7C3AED", label: "Đang xử lý" },
      SHIPPED: { bg: "#FFEDD5", color: "#EA580C", label: "Đang giao" },
      COMPLETED: { bg: "#DCFCE7", color: "#16A34A", label: "Hoàn thành" },
      CANCELLED: { bg: "#FEE2E2", color: "#DC2626", label: "Đã hủy" },
    };
    return map[status] || { bg: "#F3F4F6", color: "#6B7280", label: status };
  };

  const formatMoney = (n: number) =>
    n >= 1_000_000
      ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
      : n.toLocaleString() + "đ";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAFA" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: "#C9A96E" }}></div>
          <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0F1117" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Admin Navigation */}
        <AdminHeader title="Dashboard" />

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(201,169,110,0.06)", transform: "translate(8px, -8px)" }}></div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: "rgba(34,197,94,0.15)" }}>
                💰
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Doanh thu</p>
              <p className="text-2xl font-bold text-white mt-1">{formatMoney(totalRevenue)}</p>
              <p className="text-xs mt-2" style={{ color: "#22C55E" }}>
                {completedOrders} đơn hoàn thành
              </p>
            </div>
          </div>

          {/* Pending Revenue */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(201,169,110,0.06)", transform: "translate(8px, -8px)" }}></div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: "rgba(251,191,36,0.15)" }}>
                ⏳
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Chờ thanh toán</p>
              <p className="text-2xl font-bold text-white mt-1">{formatMoney(pendingRevenue)}</p>
              <p className="text-xs mt-2" style={{ color: "#FBBF24" }}>
                {pendingOrders + processingOrders + shippedOrders} đơn đang xử lý
              </p>
            </div>
          </div>

          {/* Discount/Expense */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(201,169,110,0.06)", transform: "translate(8px, -8px)" }}></div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: "rgba(239,68,68,0.15)" }}>
                🏷️
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Giảm giá đã cấp</p>
              <p className="text-2xl font-bold text-white mt-1">{formatMoney(totalDiscount)}</p>
              <p className="text-xs mt-2" style={{ color: "#EF4444" }}>
                Chi phí khuyến mãi
              </p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(201,169,110,0.06)", transform: "translate(8px, -8px)" }}></div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: "rgba(201,169,110,0.15)" }}>
                📦
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
              <p className="text-xs mt-2" style={{ color: "#C9A96E" }}>
                {productCount} sản phẩm · {categoryCount} danh mục
              </p>
            </div>
          </div>
        </div>

        {/* Main Content: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Orders Table */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1F2937" }}>
              <div>
                <h2 className="font-bold text-white">Đơn hàng gần đây</h2>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {recentOrders.length} đơn mới nhất
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{ background: "rgba(201,169,110,0.1)", color: "#C9A96E" }}
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1F2937" }}>
                    <th className="text-left px-6 py-3 font-medium" style={{ color: "#6B7280" }}>Mã đơn</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Trạng thái</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Tổng tiền</th>
                    <th className="text-right px-6 py-3 font-medium hidden sm:table-cell" style={{ color: "#6B7280" }}>Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const st = getStatusStyle(order.orderStatus);
                    const total = order.totalAmount + order.shippingFee - order.discountAmount;
                    return (
                      <tr
                        key={order.id}
                        className="transition-colors cursor-pointer"
                        style={{ borderBottom: "1px solid rgba(31,41,55,0.5)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        onClick={() => window.location.href = `/admin/orders`}
                      >
                        <td className="px-6 py-3.5 font-medium text-white">#{order.orderNo}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: st.bg, color: st.color }}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold text-white">
                          {total.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-3.5 text-right hidden sm:table-cell" style={{ color: "#6B7280" }}>
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    );
                  })}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-10" style={{ color: "#6B7280" }}>
                        Chưa có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Order Status Breakdown + Quick Links */}
          <div className="space-y-6">
            {/* Status Breakdown */}
            <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
              <h3 className="font-bold text-white mb-4">Tình trạng đơn hàng</h3>
              <div className="space-y-3">
                {[
                  { label: "Chờ duyệt", count: pendingOrders, color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
                  { label: "Đang xử lý", count: processingOrders, color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
                  { label: "Đang giao", count: shippedOrders, color: "#FB923C", bg: "rgba(251,146,60,0.1)" },
                  { label: "Hoàn thành", count: completedOrders, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
                  { label: "Đã hủy", count: cancelledOrders, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
                ].map((item) => {
                  const pct = orders.length > 0 ? (item.count / orders.length) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: item.color }}></div>
                          <span className="text-sm" style={{ color: "#D1D5DB" }}>{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: item.color }}>
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: item.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
              <h3 className="font-bold text-white mb-4">Truy cập nhanh</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { to: "/admin/products", label: "Sản phẩm", icon: "👕", count: productCount },
                  { to: "/admin/categories", label: "Danh mục", icon: "📂", count: categoryCount },
                  { to: "/admin/coupons", label: "Mã giảm giá", icon: "🎟️" },
                  { to: "/admin/orders", label: "Đơn hàng", icon: "📦", count: orders.length },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-xl p-3 transition-all duration-200 group"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(201,169,110,0.08)";
                      e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    }}
                  >
                    <div className="text-lg mb-1">{item.icon}</div>
                    <p className="text-xs font-medium text-white">{item.label}</p>
                    {item.count !== undefined && (
                      <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>{item.count} mục</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Revenue Summary Card */}
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #C9A96E, #8B6914)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.08)", transform: "translate(16px, -16px)" }}></div>
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(17,24,39,0.6)" }}>
                  Lợi nhuận ước tính
                </p>
                <p className="text-3xl font-bold mt-2" style={{ color: "#111827" }}>
                  {formatMoney(totalRevenue - totalDiscount)}
                </p>
                <p className="text-xs mt-2" style={{ color: "rgba(17,24,39,0.5)" }}>
                  Doanh thu − Giảm giá
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

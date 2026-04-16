import { useEffect, useState, useMemo } from "react";
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

type Period = "today" | "date" | "7days" | "30days" | "month" | "year" | "all";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("30days");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
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

  // ---- Filter orders by period ----
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      switch (period) {
        case "today": {
          return d.toDateString() === now.toDateString();
        }
        case "date": {
          const target = new Date(selectedDate + "T00:00:00");
          return d.toDateString() === target.toDateString();
        }
        case "7days": {
          const ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return d >= ago;
        }
        case "30days": {
          const ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return d >= ago;
        }
        case "month": {
          const [y, m] = selectedMonth.split("-");
          return d.getFullYear() === Number(y) && d.getMonth() + 1 === Number(m);
        }
        case "year": {
          return d.getFullYear() === Number(selectedYear);
        }
        default:
          return true;
      }
    });
  }, [orders, period, selectedMonth, selectedDate, selectedYear]);

  // ---- Computed Stats ----
  const totalRevenue = filteredOrders
    .filter((o) => o.orderStatus === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount + o.shippingFee - o.discountAmount, 0);

  const pendingRevenue = filteredOrders
    .filter((o) => !["COMPLETED", "CANCELLED"].includes(o.orderStatus))
    .reduce((sum, o) => sum + o.totalAmount + o.shippingFee - o.discountAmount, 0);

  const totalDiscount = filteredOrders
    .filter((o) => o.orderStatus !== "CANCELLED")
    .reduce((sum, o) => sum + (o.discountAmount || 0), 0);

  const completedOrders = filteredOrders.filter((o) => o.orderStatus === "COMPLETED").length;
  const pendingOrders = filteredOrders.filter((o) => o.orderStatus === "PENDING").length;
  const processingOrders = filteredOrders.filter((o) => o.orderStatus === "PROCESSING").length;
  const shippedOrders = filteredOrders.filter((o) => o.orderStatus === "SHIPPED").length;
  const cancelledOrders = filteredOrders.filter((o) => o.orderStatus === "CANCELLED").length;

  const recentOrders = [...filteredOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  // ---- Revenue chart data ----
  const chartData = useMemo(() => {
    const now = new Date();
    const result: { label: string; revenue: number; orders: number; date: Date; hour?: number }[] = [];

    // Single day → hourly breakdown
    if (period === "today" || period === "date") {
      const targetDate = period === "date" ? new Date(selectedDate + "T00:00:00") : now;
      for (let h = 0; h < 24; h++) {
        result.push({
          label: `${h}h`,
          revenue: 0,
          orders: 0,
          date: targetDate,
          hour: h,
        });
      }
      filteredOrders.forEach((o) => {
        const d = new Date(o.createdAt);
        const h = d.getHours();
        if (result[h]) {
          result[h].orders++;
          if (o.orderStatus === "COMPLETED") {
            result[h].revenue += o.totalAmount + o.shippingFee - o.discountAmount;
          }
        }
      });
      return result;
    }

    if (period === "month") {
      const [y, m] = selectedMonth.split("-").map(Number);
      const days = new Date(y, m, 0).getDate();
      for (let i = 1; i <= days; i++) {
        const date = new Date(y, m - 1, i);
        result.push({ label: `${i}`, revenue: 0, orders: 0, date });
      }
    } else if (period === "year") {
      // Group by month in selected year
      const yr = Number(selectedYear);
      for (let m = 1; m <= 12; m++) {
        result.push({ label: `T${m}`, revenue: 0, orders: 0, date: new Date(yr, m - 1, 1) });
      }
      filteredOrders.forEach((o) => {
        const d = new Date(o.createdAt);
        const m = d.getMonth();
        if (result[m]) {
          result[m].orders++;
          if (o.orderStatus === "COMPLETED") {
            result[m].revenue += o.totalAmount + o.shippingFee - o.discountAmount;
          }
        }
      });
      return result;
    } else if (period === "all") {
      // Group by month
      const monthMap = new Map<string, { revenue: number; orders: number }>();
      orders.forEach((o) => {
        const d = new Date(o.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!monthMap.has(key)) monthMap.set(key, { revenue: 0, orders: 0 });
        const entry = monthMap.get(key)!;
        entry.orders++;
        if (o.orderStatus === "COMPLETED") {
          entry.revenue += o.totalAmount + o.shippingFee - o.discountAmount;
        }
      });
      const sorted = [...monthMap.entries()].sort();
      return sorted.map(([key, val]) => ({
        label: key.split("-")[1] + "/" + key.split("-")[0].slice(2),
        revenue: val.revenue,
        orders: val.orders,
        date: new Date(key + "-01"),
      }));
    } else {
      const days = period === "7days" ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const label = days <= 7
          ? date.toLocaleDateString("vi-VN", { weekday: "short" })
          : `${date.getDate()}/${date.getMonth() + 1}`;
        result.push({ label, revenue: 0, orders: 0, date });
      }
    }

    filteredOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const entry = result.find((r) => r.date.toDateString() === d.toDateString());
      if (entry) {
        entry.orders++;
        if (o.orderStatus === "COMPLETED") {
          entry.revenue += o.totalAmount + o.shippingFee - o.discountAmount;
        }
      }
    });

    return result;
  }, [filteredOrders, orders, period, selectedMonth, selectedDate]);

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const maxOrders = Math.max(...chartData.map((d) => d.orders), 1);

  // ---- Available months ----
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    const now = new Date();
    // Always add current month + 11 previous months
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return [...set].sort().reverse();
  }, []);

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

  const periodLabels: Record<Period, string> = {
    today: "Hôm nay",
    date: "Theo ngày",
    "7days": "7 ngày",
    "30days": "30 ngày",
    month: "Theo tháng",
    year: "Theo năm",
    all: "Tất cả",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F1117" }}>
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

        {/* Period Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: period === p ? "rgba(201,169,110,0.2)" : "rgba(255,255,255,0.04)",
                color: period === p ? "#C9A96E" : "#6B7280",
                border: `1px solid ${period === p ? "rgba(201,169,110,0.3)" : "transparent"}`,
              }}
            >
              {periodLabels[p]}
            </button>
          ))}

          {/* Date picker */}
          {period === "date" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold ml-1"
              style={{
                background: "#1F2937",
                color: "#C9A96E",
                border: "1px solid rgba(201,169,110,0.3)",
                outline: "none",
                colorScheme: "dark",
              }}
            />
          )}

          {/* Month picker */}
          {period === "month" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold ml-1"
              style={{
                background: "#1F2937",
                color: "#C9A96E",
                border: "1px solid rgba(201,169,110,0.3)",
                outline: "none",
              }}
            >
              {availableMonths.map((m) => {
                const [y, mo] = m.split("-");
                return (
                  <option key={m} value={m}>
                    Tháng {mo}/{y}
                  </option>
                );
              })}
            </select>
          )}

          {/* Year picker */}
          {period === "year" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold ml-1"
              style={{
                background: "#1F2937",
                color: "#C9A96E",
                border: "1px solid rgba(201,169,110,0.3)",
                outline: "none",
              }}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={String(y)}>Năm {y}</option>
              ))}
            </select>
          )}

          <span className="text-xs ml-auto" style={{ color: "#4B5563" }}>
            {filteredOrders.length} đơn hàng trong khoảng này
          </span>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(34,197,94,0.06)", transform: "translate(8px, -8px)" }}></div>
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
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(251,191,36,0.06)", transform: "translate(8px, -8px)" }}></div>
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

          {/* Discount */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(239,68,68,0.06)", transform: "translate(8px, -8px)" }}></div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: "rgba(239,68,68,0.15)" }}>
                🏷️
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Giảm giá đã cấp</p>
              <p className="text-2xl font-bold text-white mt-1">{formatMoney(totalDiscount)}</p>
              <p className="text-xs mt-2" style={{ color: "#EF4444" }}>Chi phí khuyến mãi</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(201,169,110,0.06)", transform: "translate(8px, -8px)" }}></div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: "rgba(201,169,110,0.15)" }}>
                📦
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Đơn hàng</p>
              <p className="text-2xl font-bold text-white mt-1">{filteredOrders.length}</p>
              <p className="text-xs mt-2" style={{ color: "#C9A96E" }}>
                {productCount} sản phẩm · {categoryCount} danh mục
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        {chartData.length > 0 && (
          <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-white">Biểu đồ doanh thu</h3>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {period === "today" ? "Theo giờ — Hôm nay"
                    : period === "date" ? `Theo giờ — ${new Date(selectedDate).toLocaleDateString("vi-VN")}`
                    : period === "year" ? `Theo tháng — Năm ${selectedYear}`
                    : period === "all" ? "Theo tháng"
                    : period === "month" ? `Tháng ${selectedMonth.split("-")[1]}/${selectedMonth.split("-")[0]}`
                    : `${chartData.length} ngày gần đây`}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "#6B7280" }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#C9A96E" }}></span> Doanh thu
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#4F46E5" }}></span> Đơn hàng
                </span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1" style={{ height: "180px" }}>
              {chartData.map((d, i) => {
                const barH = maxRevenue > 0 ? (d.revenue / maxRevenue) * 160 : 0;
                const dotH = maxOrders > 0 ? (d.orders / maxOrders) * 160 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative" style={{ minWidth: 0 }}>
                    {/* Tooltip */}
                    <div
                      className="absolute bottom-full mb-2 hidden group-hover:block z-10 whitespace-nowrap rounded-lg px-3 py-2 text-xs pointer-events-none"
                      style={{ background: "#1F2937", border: "1px solid #374151", color: "#E5E7EB" }}
                    >
                      <p className="font-semibold">{d.label}</p>
                      <p style={{ color: "#C9A96E" }}>💰 {d.revenue.toLocaleString()}đ</p>
                      <p style={{ color: "#818CF8" }}>📦 {d.orders} đơn</p>
                    </div>
                    {/* Revenue bar */}
                    <div className="w-full flex items-end justify-center gap-0.5" style={{ height: "160px" }}>
                      <div
                        className="rounded-t transition-all duration-500 hover:opacity-80"
                        style={{
                          width: "45%",
                          height: `${Math.max(barH, 2)}px`,
                          background: d.revenue > 0 ? "linear-gradient(to top, #8B6914, #C9A96E)" : "rgba(201,169,110,0.1)",
                        }}
                      ></div>
                      <div
                        className="rounded-t transition-all duration-500 hover:opacity-80"
                        style={{
                          width: "45%",
                          height: `${Math.max(dotH * 0.5, 2)}px`,
                          background: d.orders > 0 ? "linear-gradient(to top, #3730A3, #6366F1)" : "rgba(99,102,241,0.1)",
                        }}
                      ></div>
                    </div>
                    {/* Label */}
                    <span className="text-[9px] truncate w-full text-center" style={{ color: "#4B5563" }}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                        Không có đơn hàng trong khoảng thời gian này
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
                  { label: "Chờ duyệt", count: pendingOrders, color: "#FBBF24" },
                  { label: "Đang xử lý", count: processingOrders, color: "#A78BFA" },
                  { label: "Đang giao", count: shippedOrders, color: "#FB923C" },
                  { label: "Hoàn thành", count: completedOrders, color: "#22C55E" },
                  { label: "Đã hủy", count: cancelledOrders, color: "#EF4444" },
                ].map((item) => {
                  const pct = filteredOrders.length > 0 ? (item.count / filteredOrders.length) * 100 : 0;
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
                  { to: "/admin/inventory", label: "Tồn kho", icon: "📦" },
                  { to: "/admin/coupons", label: "Mã giảm giá", icon: "🎟️" },
                  { to: "/admin/orders", label: "Đơn hàng", icon: "🛒", count: orders.length },
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
                  Doanh thu − Giảm giá ({periodLabels[period]})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

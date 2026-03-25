import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<number | null>(null);

  useEffect(() => { loadOrders(); }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/orders", { params: { status: statusFilter } });
      setOrders(res.data);
    } catch (err) { console.log("Load admin orders error:", err); }
    finally { setLoading(false); }
  };

  const handleOrderAction = async (orderId: number, action: string, status?: string) => {
    if (!confirm(action === "approve" ? "Xác nhận DUYỆT đơn hàng?" : action === "SHIPPED" ? "Chuyển sang ĐANG GIAO?" : "Đánh dấu HOÀN THÀNH?")) return;
    try {
      setProcessingOrder(orderId);
      if (action === "approve") await api.post(`/api/admin/orders/${orderId}/approve`);
      else if (action === "status" && status) await api.post(`/api/admin/orders/${orderId}/status`, null, { params: { status } });
      alert(action === "approve" ? "Đã duyệt!" : "Cập nhật thành công!");
      loadOrders();
    } catch { alert("Không thể thực hiện!"); }
    finally { setProcessingOrder(null); }
  };

  const getStatus = (s: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PENDING: { bg: "rgba(251,191,36,0.15)", color: "#FBBF24", label: "Chờ duyệt" },
      PAID: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", label: "Đã thanh toán" },
      PROCESSING: { bg: "rgba(167,139,250,0.15)", color: "#A78BFA", label: "Đang xử lý" },
      SHIPPED: { bg: "rgba(251,146,60,0.15)", color: "#FB923C", label: "Đang giao" },
      COMPLETED: { bg: "rgba(34,197,94,0.15)", color: "#22C55E", label: "Hoàn thành" },
      CANCELLED: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", label: "Đã hủy" },
    };
    return map[s] || { bg: "rgba(107,114,128,0.15)", color: "#6B7280", label: s };
  };

  const filters = [
    { value: "", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const pendingCount = orders.filter(o => o.orderStatus === "PENDING").length;
  const processingCount = orders.filter(o => o.orderStatus === "PROCESSING").length;
  const shippedCount = orders.filter(o => o.orderStatus === "SHIPPED").length;
  const completedCount = orders.filter(o => o.orderStatus === "COMPLETED").length;

  return (
    <div className="min-h-screen" style={{ background: "#0F1117" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AdminHeader title="Quản lý đơn hàng" />

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Chờ duyệt", count: pendingCount, color: "#FBBF24", icon: "⏳" },
            { label: "Đang xử lý", count: processingCount, color: "#A78BFA", icon: "⚙️" },
            { label: "Đang giao", count: shippedCount, color: "#FB923C", icon: "🚚" },
            { label: "Hoàn thành", count: completedCount, color: "#22C55E", icon: "✅" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#111827", border: "1px solid #1F2937" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: `${s.color}15` }}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={{
                background: statusFilter === f.value ? "#C9A96E" : "rgba(255,255,255,0.05)",
                color: statusFilter === f.value ? "#111827" : "#9CA3AF",
                border: statusFilter === f.value ? "none" : "1px solid #1F2937",
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-gray-700 rounded-full animate-spin" style={{ borderTopColor: "#C9A96E" }}></div>
                <p className="text-sm" style={{ color: "#6B7280" }}>Đang tải đơn hàng...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(201,169,110,0.1)" }}>
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Không có đơn hàng</h3>
              <p className="text-sm" style={{ color: "#6B7280" }}>Không tìm thấy đơn hàng phù hợp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1F2937" }}>
                    <th className="text-left px-6 py-3 font-medium" style={{ color: "#6B7280" }}>Mã đơn</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Trạng thái</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Tổng tiền</th>
                    <th className="text-right px-4 py-3 font-medium hidden md:table-cell" style={{ color: "#6B7280" }}>Ngày đặt</th>
                    <th className="text-center px-6 py-3 font-medium" style={{ color: "#6B7280" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const st = getStatus(order.orderStatus);
                    const total = order.totalAmount + order.shippingFee - order.discountAmount;
                    const isProcessing = processingOrder === order.id;
                    return (
                      <tr key={order.id} style={{ borderBottom: "1px solid rgba(31,41,55,0.5)" }}
                        className="transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td className="px-6 py-4 font-medium text-white">#{order.orderNo}</td>
                        <td className="px-4 py-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-white">{total.toLocaleString()}đ</td>
                        <td className="px-4 py-4 text-right hidden md:table-cell" style={{ color: "#6B7280" }}>
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {order.orderStatus === "PENDING" && (
                              <button onClick={() => handleOrderAction(order.id, "approve")} disabled={isProcessing}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                                style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>
                                {isProcessing ? "..." : "✓ Duyệt"}
                              </button>
                            )}
                            {order.orderStatus === "PROCESSING" && (
                              <button onClick={() => handleOrderAction(order.id, "status", "SHIPPED")} disabled={isProcessing}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                                style={{ background: "rgba(251,146,60,0.15)", color: "#FB923C" }}>
                                {isProcessing ? "..." : "🚚 Giao hàng"}
                              </button>
                            )}
                            {order.orderStatus === "SHIPPED" && (
                              <button onClick={() => handleOrderAction(order.id, "status", "COMPLETED")} disabled={isProcessing}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                                style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA" }}>
                                {isProcessing ? "..." : "✅ Hoàn thành"}
                              </button>
                            )}
                            {!["PENDING", "PROCESSING", "SHIPPED"].includes(order.orderStatus) && (
                              <span className="text-xs" style={{ color: "#4B5563" }}>—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
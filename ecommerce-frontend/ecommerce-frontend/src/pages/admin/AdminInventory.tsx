import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

interface InventoryItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  salePrice: number | null;
  stock: number;
  categoryName: string | null;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

interface InventoryStats {
  totalProducts: number;
  notSet: number;
  outOfStock: number;
  lowStock: number;
  inStock: number;
  totalStockValue: number;
}

export default function AdminInventory() {
  const role = localStorage.getItem("role");

  if (role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F1117" }}>
        <div className="rounded-2xl p-8 text-center max-w-md w-full" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.15)" }}>
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Truy cập bị từ chối</h1>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Bạn không có quyền truy cập trang này</p>
          <button onClick={() => (window.location.href = "/")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#C9A96E", color: "#111827" }}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [filter, setFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter) params.filter = filter;
      if (keyword) params.keyword = keyword;

      const [invRes, statsRes] = await Promise.all([
        api.get("/api/admin/inventory", { params }),
        api.get("/api/admin/inventory/stats"),
      ]);
      setItems(invRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.log("Load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleSearch = () => loadData();

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditStock(String(item.stock));
  };

  const saveStock = async (id: number) => {
    try {
      await api.put(`/api/admin/inventory/${id}/stock`, { stock: parseInt(editStock) });
      setEditingId(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Lỗi cập nhật tồn kho");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStock("");
  };

  const initStock = async () => {
    const input = prompt("Nhập số lượng tồn kho mặc định cho tất cả SP chưa set:", "100");
    if (!input) return;
    const stock = parseInt(input);
    if (isNaN(stock) || stock < 0) { alert("Số lượng không hợp lệ"); return; }
    try {
      const res = await api.post("/api/admin/inventory/init-stock", { stock });
      alert(res.data.message);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Lỗi khởi tạo stock");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NOT_SET":
        return { bg: "rgba(156,163,175,0.15)", color: "#9CA3AF", label: "Chưa set" };
      case "OUT_OF_STOCK":
        return { bg: "rgba(239,68,68,0.15)", color: "#EF4444", label: "Hết hàng" };
      case "LOW_STOCK":
        return { bg: "rgba(251,191,36,0.15)", color: "#FBBF24", label: "Sắp hết" };
      case "IN_STOCK":
        return { bg: "rgba(34,197,94,0.15)", color: "#22C55E", label: "Còn hàng" };
      default:
        return { bg: "rgba(107,114,128,0.15)", color: "#6B7280", label: status };
    }
  };

  const formatMoney = (n: number) =>
    n >= 1_000_000
      ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
      : n.toLocaleString() + "đ";

  const filters = [
    { key: "", label: "Tất cả", icon: "📦" },
    { key: "not_set", label: "Chưa set", icon: "❓" },
    { key: "out_of_stock", label: "Hết hàng", icon: "🔴" },
    { key: "low_stock", label: "Sắp hết", icon: "🟡" },
    { key: "in_stock", label: "Còn hàng", icon: "🟢" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0F1117" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AdminHeader title="Quản lý tồn kho" />

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Tổng sản phẩm", value: stats.totalProducts, icon: "📦", color: "#C9A96E", bg: "rgba(201,169,110,0.15)" },
              { label: "Chưa set kho", value: stats.notSet, icon: "❓", color: "#9CA3AF", bg: "rgba(156,163,175,0.15)" },
              { label: "Hết hàng", value: stats.outOfStock, icon: "🔴", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
              { label: "Giá trị tồn kho", value: formatMoney(stats.totalStockValue), icon: "💰", color: "#22C55E", bg: "rgba(34,197,94,0.15)" },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #111827 100%)", border: "1px solid #1F2937" }}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: "rgba(201,169,110,0.06)", transform: "translate(8px, -8px)" }}></div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: card.bg }}>
                    {card.icon}
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9CA3AF" }}>{card.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{typeof card.value === "number" ? card.value : card.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Init Stock Banner (khi có sản phẩm chưa set stock) */}
        {stats && stats.notSet > 0 && (
          <div className="rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#FBBF24" }}>Có {stats.notSet} sản phẩm chưa thiết lập tồn kho</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>Sản phẩm chưa set kho sẽ được coi là không giới hạn. Bấm nút bên cạnh để thiết lập mặc định.</p>
              </div>
            </div>
            <button
              onClick={initStock}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0"
              style={{ background: "#FBBF24", color: "#111827" }}
            >
              Thiết lập mặc định
            </button>
          </div>
        )}

        {/* Filter & Search */}
        <div className="rounded-2xl p-5" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: filter === f.key ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.03)",
                    color: filter === f.key ? "#C9A96E" : "#D1D5DB",
                    border: filter === f.key ? "1px solid rgba(201,169,110,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span className="mr-1.5">{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="flex-1 p-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                style={{ background: "#0D1117", border: "1px solid #1F2937" }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: "#C9A96E", color: "#111827" }}
              >
                Tìm
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1F2937" }}>
            <div>
              <h2 className="font-bold text-white">Danh sách tồn kho</h2>
              <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{items.length} sản phẩm</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-700 rounded-full animate-spin" style={{ borderTopColor: "#C9A96E" }}></div>
                <p className="text-sm" style={{ color: "#6B7280" }}>Đang tải...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <h3 className="text-base font-semibold text-white mb-1">Không có sản phẩm</h3>
              <p className="text-sm" style={{ color: "#6B7280" }}>Thử thay đổi bộ lọc</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1F2937" }}>
                    <th className="text-left px-6 py-3 font-medium" style={{ color: "#6B7280" }}>Sản phẩm</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Danh mục</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Giá</th>
                    <th className="text-center px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Tồn kho</th>
                    <th className="text-center px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Trạng thái</th>
                    <th className="text-center px-6 py-3 font-medium" style={{ color: "#6B7280" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const badge = getStatusBadge(item.stockStatus);
                    const isEditing = editingId === item.id;
                    return (
                      <tr
                        key={item.id}
                        className="transition-colors"
                        style={{ borderBottom: "1px solid rgba(31,41,55,0.5)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {/* Product Info */}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : "/no-image.png"}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              alt={item.name}
                              onError={(e) => { (e.target as HTMLImageElement).src = "/no-image.png"; }}
                            />
                            <span className="font-medium text-white truncate max-w-[200px]">{item.name}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5">
                          {item.categoryName ? (
                            <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(201,169,110,0.1)", color: "#C9A96E" }}>
                              {item.categoryName}
                            </span>
                          ) : (
                            <span style={{ color: "#4B5563" }}>—</span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3.5 text-right">
                          {item.salePrice ? (
                            <div>
                              <span className="font-semibold" style={{ color: "#C9A96E" }}>{item.salePrice.toLocaleString()}đ</span>
                              <br />
                              <span className="text-xs line-through" style={{ color: "#4B5563" }}>{item.price.toLocaleString()}đ</span>
                            </div>
                          ) : (
                            <span className="font-semibold text-white">{item.price.toLocaleString()}đ</span>
                          )}
                        </td>

                        {/* Stock - Inline Edit */}
                        <td className="px-4 py-3.5 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-20 p-1.5 rounded-lg text-sm text-white text-center outline-none"
                              style={{ background: "#0D1117", border: "2px solid #C9A96E" }}
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveStock(item.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="font-bold text-lg cursor-pointer hover:opacity-70 transition-opacity"
                              style={{ color: item.stock <= 0 ? "#EF4444" : item.stock <= 10 ? "#FBBF24" : "white" }}
                              onClick={() => startEdit(item)}
                              title="Click để sửa"
                            >
                              {item.stock}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: badge.bg, color: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3.5 text-center">
                          {isEditing ? (
                            <div className="flex gap-1.5 justify-center">
                              <button
                                onClick={() => saveStock(item.id)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                                style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
                              >
                                Lưu
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                                style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(item)}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                              style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}
                            >
                              ✏️ Sửa kho
                            </button>
                          )}
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

export default function CouponList({ coupons, deleteCoupon }: any) {
  const getTypeStyle = (type: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PERCENT: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", label: "Giảm %" },
      FIXED: { bg: "rgba(34,197,94,0.15)", color: "#22C55E", label: "Giảm tiền" },
      FREESHIP: { bg: "rgba(167,139,250,0.15)", color: "#A78BFA", label: "Miễn ship" },
    };
    return map[type] || { bg: "rgba(107,114,128,0.15)", color: "#6B7280", label: type };
  };

  const getRoleBadge = (role: string | null) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      ALL: { bg: "rgba(201,169,110,0.15)", color: "#C9A96E", label: "Tất cả" },
      ROLE_USER: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", label: "Khách hàng" },
      ROLE_VIP: { bg: "rgba(251,191,36,0.15)", color: "#FBBF24", label: "VIP" },
      ROLE_ADMIN: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", label: "Admin" },
    };
    return map[role || "ALL"] || map["ALL"];
  };

  const getValueDisplay = (c: any) => {
    if (c.type === "PERCENT") return `${c.value}%`;
    if (c.type === "FIXED") return `${c.value.toLocaleString()}đ`;
    return "Free";
  };

  const isCouponActive = (c: any) => {
    const now = new Date();
    return now >= new Date(c.startAt) && now <= new Date(c.endAt);
  };

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(201,169,110,0.1)" }}>
          <span className="text-xl">🎟️</span>
        </div>
        <h3 className="font-semibold text-white mb-1">Chưa có mã giảm giá</h3>
        <p className="text-xs" style={{ color: "#6B7280" }}>Tạo mã đầu tiên ở form trên</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid #1F2937" }}>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Mã</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Loại</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Giá trị</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Đối tượng</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: "#6B7280" }}>Đơn tối thiểu</th>
            <th className="text-left px-4 py-3 font-medium hidden lg:table-cell" style={{ color: "#6B7280" }}>Sử dụng</th>
            <th className="text-left px-4 py-3 font-medium hidden lg:table-cell" style={{ color: "#6B7280" }}>Hiệu lực</th>
            <th className="text-center px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Trạng thái</th>
            <th className="text-center px-4 py-3 font-medium" style={{ color: "#6B7280" }}></th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c: any) => {
            const ts = getTypeStyle(c.type);
            const rb = getRoleBadge(c.targetRole);
            const active = isCouponActive(c);
            return (
              <tr key={c.id} style={{ borderBottom: "1px solid rgba(31,41,55,0.5)" }}
                className="transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="px-4 py-3.5 font-semibold text-white">{c.code}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: ts.bg, color: ts.color }}>
                    {ts.label}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-bold" style={{ color: "#C9A96E" }}>{getValueDisplay(c)}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: rb.bg, color: rb.color }}>
                    {rb.label}
                  </span>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell" style={{ color: "#D1D5DB" }}>
                  {c.minimumOrderAmount ? `${c.minimumOrderAmount.toLocaleString()}đ` : "—"}
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell" style={{ color: "#D1D5DB" }}>
                  {c.usedCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : " / ∞"}
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell text-xs" style={{ color: "#6B7280" }}>
                  {new Date(c.startAt).toLocaleDateString("vi-VN")} → {new Date(c.endAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: active ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: active ? "#22C55E" : "#EF4444" }}>
                    {active ? "Hoạt động" : "Hết hạn"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <button onClick={() => deleteCoupon(c.id)}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
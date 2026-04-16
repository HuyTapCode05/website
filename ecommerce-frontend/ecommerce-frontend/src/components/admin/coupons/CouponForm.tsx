import { useState } from "react";

export default function CouponForm({ form, updateField, createCoupon }: any) {
  const isFormValid = form.code && form.value > 0 && form.startAt && form.endAt;
  const [showPreview, setShowPreview] = useState(true);

  const inputStyle = { background: "#0D1117", border: "1px solid #1F2937", color: "white" };

  // Preview helpers
  const isPercent = form.type === "PERCENT";
  const isFixed = form.type === "FIXED";
  const isFreeShip = form.type === "FREESHIP";
  const accentBg = isFreeShip ? "#0891B2" : "#EE4D2D";
  const valueText = isPercent ? `${form.value || 0}%` : isFixed ? `${Math.round((form.value || 0) / 1000)}K` : "FREE";
  const descText = isPercent ? `Giảm ${form.value || 0}%` : isFixed ? `Giảm ${Number(form.value || 0).toLocaleString()}đ` : "Miễn phí vận chuyển";

  const roleLabels: Record<string, { label: string; color: string; bg: string }> = {
    ALL: { label: "Tất cả", color: "#C9A96E", bg: "rgba(201,169,110,0.15)" },
    ROLE_USER: { label: "Khách hàng", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
    ROLE_VIP: { label: "VIP", color: "#FBBF24", bg: "rgba(251,191,36,0.15)" },
    ROLE_ADMIN: { label: "Admin", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  };
  const roleInfo = roleLabels[form.targetRole || "ALL"] || roleLabels["ALL"];

  return (
    <div className="space-y-6">
      {/* Row 1: Code, Type, Value */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Mã giảm giá <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input name="code" value={form.code} onChange={updateField} placeholder="VD: SALE10"
            className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all uppercase"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Loại giảm giá</label>
          <select name="type" value={form.type} onChange={updateField}
            className="w-full p-3 rounded-lg text-sm outline-none cursor-pointer"
            style={inputStyle}>
            <option value="PERCENT">📊 Giảm %</option>
            <option value="FIXED">💵 Giảm tiền</option>
            <option value="FREESHIP">🚚 Miễn ship</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Giá trị <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <div className="relative">
            <input name="value" type="number" value={form.value} onChange={updateField}
              placeholder={isPercent ? '1-100' : '10000'}
              className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all pr-10"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#C9A96E"}
              onBlur={e => e.target.style.borderColor = "#1F2937"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#6B7280" }}>
              {isPercent ? "%" : isFreeShip ? "" : "đ"}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Min order, Usage limit, Target Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Đơn tối thiểu</label>
          <div className="relative">
            <input name="minimumOrderAmount" type="number" value={form.minimumOrderAmount} onChange={updateField} placeholder="0 = không giới hạn"
              className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all pr-10"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#C9A96E"}
              onBlur={e => e.target.style.borderColor = "#1F2937"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#6B7280" }}>đ</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Giới hạn lượt dùng</label>
          <input name="usageLimit" type="number" value={form.usageLimit} onChange={updateField} placeholder="0 = không giới hạn"
            className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Đối tượng áp dụng
          </label>
          <select name="targetRole" value={form.targetRole || "ALL"} onChange={updateField}
            className="w-full p-3 rounded-lg text-sm outline-none cursor-pointer"
            style={inputStyle}>
            <option value="ALL">🌐 Tất cả người dùng</option>
            <option value="ROLE_USER">👤 Chỉ khách hàng</option>
            <option value="ROLE_VIP">⭐ Chỉ VIP</option>
            <option value="ROLE_ADMIN">🔑 Chỉ Admin</option>
          </select>
        </div>
      </div>

      {/* Row 3: Start, End, Submit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Bắt đầu <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input name="startAt" type="datetime-local" value={form.startAt} onChange={updateField}
            className="w-full p-3 rounded-lg text-sm outline-none transition-all"
            style={{ ...inputStyle, colorScheme: "dark" }}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Kết thúc <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input name="endAt" type="datetime-local" value={form.endAt} onChange={updateField}
            className="w-full p-3 rounded-lg text-sm outline-none transition-all"
            style={{ ...inputStyle, colorScheme: "dark" }}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>
        <div className="flex items-end">
          <button onClick={createCoupon} disabled={!isFormValid}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
            style={{ background: isFormValid ? "#C9A96E" : "#374151", color: isFormValid ? "#111827" : "#6B7280" }}>
            ➕ Tạo mã giảm giá
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs font-semibold flex items-center gap-1.5 mb-3 transition-colors"
          style={{ color: "#C9A96E" }}
        >
          👁️ {showPreview ? "Ẩn" : "Xem"} preview voucher
          <span style={{ transform: showPreview ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", fontSize: "8px" }}>▼</span>
        </button>

        {showPreview && (
          <div className="flex flex-wrap items-start gap-4">
            {/* Preview Card - Shopee style */}
            <div className="flex" style={{ width: "280px" }}>
              {/* Left ticket */}
              <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center relative rounded-l-xl py-5"
                style={{ background: accentBg, color: "white" }}>
                {/* Scallop */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: "#111827" }}></div>
                {isFreeShip ? (
                  <>
                    <span className="text-2xl">🚚</span>
                    <span className="text-[10px] font-bold mt-1 tracking-wider">FREESHIP</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-medium opacity-80">Giảm</span>
                    <span className="text-2xl font-black leading-tight">{valueText}</span>
                  </>
                )}
              </div>
              {/* Right content */}
              <div className="flex-1 rounded-r-xl px-4 py-3 flex flex-col justify-between relative"
                style={{ background: "#1a2332", border: "1px solid #1F2937", borderLeft: "none" }}>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: "#111827" }}></div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-black tracking-wider text-white">{form.code || "CODE"}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: roleInfo.bg, color: roleInfo.color }}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: accentBg }}>{descText}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>
                    {form.minimumOrderAmount > 0 ? `Đơn từ ${Number(form.minimumOrderAmount).toLocaleString()}đ` : "Không giới hạn"}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: "#4B5563" }}>
                    {form.usageLimit > 0 ? `${form.usageLimit} lượt` : "∞ lượt"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: accentBg, color: "white" }}>
                    Lưu
                  </span>
                </div>
              </div>
            </div>

            {/* Info summary */}
            <div className="flex-1 min-w-48 rounded-xl px-4 py-3 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1F2937" }}>
              <p className="text-xs font-bold text-white mb-2">📋 Tóm tắt mã</p>
              {[
                { label: "Mã", value: form.code || "—" },
                { label: "Loại", value: isPercent ? "Giảm %" : isFixed ? "Giảm tiền" : "Miễn ship" },
                { label: "Giá trị", value: descText },
                { label: "Đơn tối thiểu", value: form.minimumOrderAmount > 0 ? `${Number(form.minimumOrderAmount).toLocaleString()}đ` : "Không giới hạn" },
                { label: "Giới hạn", value: form.usageLimit > 0 ? `${form.usageLimit} lượt` : "Không giới hạn" },
                { label: "Đối tượng", value: roleInfo.label, color: roleInfo.color },
                { label: "Thời gian", value: form.startAt && form.endAt ? `${new Date(form.startAt).toLocaleDateString("vi-VN")} → ${new Date(form.endAt).toLocaleDateString("vi-VN")}` : "Chưa thiết lập" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span style={{ color: "#6B7280" }}>{item.label}</span>
                  <span className="font-semibold" style={{ color: (item as any).color || "#D1D5DB" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
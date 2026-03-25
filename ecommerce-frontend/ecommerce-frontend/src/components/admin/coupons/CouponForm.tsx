export default function CouponForm({ form, updateField, createCoupon }: any) {
  const isFormValid = form.code && form.value > 0 && form.startAt && form.endAt;

  const inputStyle = { background: "#0D1117", border: "1px solid #1F2937", color: "white" };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Code */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Mã giảm giá <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input name="code" value={form.code} onChange={updateField} placeholder="VD: SALE10"
            className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Loại</label>
          <select name="type" value={form.type} onChange={updateField}
            className="w-full p-3 rounded-lg text-sm outline-none cursor-pointer"
            style={inputStyle}>
            <option value="PERCENT">Giảm %</option>
            <option value="FIXED">Giảm tiền</option>
            <option value="FREESHIP">Miễn ship</option>
          </select>
        </div>

        {/* Value */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Giá trị <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input name="value" type="number" value={form.value} onChange={updateField}
            placeholder={form.type === 'PERCENT' ? '0-100' : '0'}
            className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>

        {/* Min order */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Đơn tối thiểu</label>
          <input name="minimumOrderAmount" type="number" value={form.minimumOrderAmount} onChange={updateField} placeholder="0"
            className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>

        {/* Usage limit */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Giới hạn</label>
          <input name="usageLimit" type="number" value={form.usageLimit} onChange={updateField} placeholder="∞"
            className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>

        {/* Start */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Bắt đầu <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input name="startAt" type="datetime-local" value={form.startAt} onChange={updateField}
            className="w-full p-3 rounded-lg text-sm outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>

        {/* End */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
            Kết thúc <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input name="endAt" type="datetime-local" value={form.endAt} onChange={updateField}
            className="w-full p-3 rounded-lg text-sm outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
          />
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button onClick={createCoupon} disabled={!isFormValid}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: isFormValid ? "#C9A96E" : "#374151", color: isFormValid ? "#111827" : "#6B7280" }}>
            ➕ Tạo mã
          </button>
        </div>
      </div>
    </div>
  );
}
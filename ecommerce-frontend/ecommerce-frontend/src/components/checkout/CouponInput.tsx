import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";

interface CouponInputProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
  applyCoupon: () => void;
}

export default function CouponInput({ couponCode, setCouponCode, applyCoupon }: CouponInputProps) {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const url = userId ? `/api/coupons/available?userId=${userId}` : "/api/coupons/available";
      const res = await api.get(url);
      setVouchers(Array.isArray(res.data) ? res.data : []);
    } catch { /* silent */ }
  };

  const selectVoucher = (code: string) => {
    setCouponCode(code);
    setShowList(false);
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3">Mã giảm giá</h3>
      <div className="flex gap-2.5">
        <input type="text"
          className="flex-1 p-3 rounded-xl text-sm bg-gray-50 border-2 border-gray-100 text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-amber-400 focus:bg-white"
          placeholder="Nhập mã giảm giá..."
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applyCoupon()}
        />
        <button onClick={applyCoupon} disabled={!couponCode.trim()}
          className="px-5 py-3 rounded-xl text-sm font-bold transition-all flex-shrink-0 hover:scale-105"
          style={{
            background: couponCode.trim() ? 'linear-gradient(135deg, #C9A96E, #b8944d)' : '#e5e7eb',
            color: couponCode.trim() ? 'white' : '#9ca3af',
            cursor: couponCode.trim() ? 'pointer' : 'not-allowed',
          }}>
          Áp dụng
        </button>
      </div>

      {/* Toggle */}
      {vouchers.length > 0 && (
        <button
          onClick={() => setShowList(!showList)}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: "#EE4D2D" }}
        >
          🎫 {showList ? "Ẩn" : "Chọn"} mã giảm giá ({vouchers.length})
          <span style={{ transform: showList ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", fontSize: "8px" }}>▼</span>
        </button>
      )}

      {/* Shopee-style Voucher List */}
      {showList && (
        <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-0.5" style={{ scrollbarWidth: "thin" }}>
          {vouchers.map((v) => {
            const isPercent = v.type === 'PERCENT';
            const isFixed = v.type === 'FIXED';
            const isFreeShip = v.type === 'FREESHIP';
            const usedPct = v.usageLimit ? Math.round(((v.usedCount || 0) / v.usageLimit) * 100) : 0;
            const isSelected = couponCode === v.code;
            const accentBg = isFreeShip ? '#0891B2' : '#EE4D2D';

            return (
              <div
                key={v.id}
                className="flex overflow-hidden rounded-lg transition-all"
                style={{
                  border: isSelected ? `2px solid ${accentBg}` : '2px solid #f3f4f6',
                  boxShadow: isSelected ? `0 0 0 1px ${accentBg}20` : 'none',
                }}
              >
                {/* Left ticket accent */}
                <div
                  className="w-20 flex-shrink-0 flex flex-col items-center justify-center relative"
                  style={{ background: accentBg, color: 'white' }}
                >
                  {/* Scallop */}
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"></div>
                  {isFreeShip ? (
                    <>
                      <span className="text-base">🚚</span>
                      <span className="text-[9px] font-bold mt-0.5">FREE</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-medium opacity-80">Giảm</span>
                      <span className="text-lg font-black leading-none">{isPercent ? `${v.value}%` : `${Math.round(v.value / 1000)}K`}</span>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white px-3 py-2 flex flex-col justify-between relative min-w-0">
                  {/* Scallop */}
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white" style={{ boxShadow: 'inset 0 0 0 1px #f3f4f6' }}></div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {isPercent ? `Giảm ${v.value}%` : isFixed ? `Giảm ${v.value?.toLocaleString()}đ` : 'Miễn phí vận chuyển'}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {v.minimumOrderAmount > 0 ? `Đơn tối thiểu ${v.minimumOrderAmount?.toLocaleString()}đ` : 'Không giới hạn'}
                    </p>
                  </div>

                  {/* Progress + expiry */}
                  <div className="mt-1.5">
                    {v.usageLimit && (
                      <div className="mb-1">
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#FEE2E2' }}>
                          <div className="h-full rounded-full" style={{ width: `${usedPct}%`, background: '#EF4444' }}></div>
                        </div>
                        <p className="text-[8px] mt-0.5" style={{ color: usedPct > 70 ? '#EF4444' : '#9CA3AF' }}>
                          {usedPct > 70 ? 'Sắp hết' : `Đã dùng ${usedPct}%`}
                        </p>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400">
                      HSD: {new Date(v.endAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                {/* Select button */}
                <div className="flex items-center px-2 bg-white">
                  <button
                    onClick={() => selectVoucher(v.code)}
                    className="text-[11px] font-bold px-3 py-1.5 rounded transition-all whitespace-nowrap"
                    style={{
                      background: isSelected ? '#DCFCE7' : accentBg,
                      color: isSelected ? '#16A34A' : 'white',
                    }}
                  >
                    {isSelected ? '✓ Đã chọn' : 'Dùng ngay'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
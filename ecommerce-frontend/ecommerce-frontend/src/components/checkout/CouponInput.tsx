interface CouponInputProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
  applyCoupon: () => void;
}

export default function CouponInput({ couponCode, setCouponCode, applyCoupon }: CouponInputProps) {
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
    </div>
  );
}
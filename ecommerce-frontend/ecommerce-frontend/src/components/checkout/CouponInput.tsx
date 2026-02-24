interface CouponInputProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
  applyCoupon: () => void;
}

export default function CouponInput({
  couponCode,
  setCouponCode,
  applyCoupon,
}: CouponInputProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <label className="font-semibold text-gray-700 text-lg">Mã giảm giá</label>
      </div>
      
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400 pr-12"
            placeholder="Nhập mã giảm giá của bạn..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            Mã
          </div>
        </div>
        
        <button
          onClick={applyCoupon}
          disabled={!couponCode.trim()}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            couponCode.trim()
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Áp dụng
        </button>
      </div>
      
      <p className="text-gray-500 text-sm mt-2">
        Nhập mã giảm giá và nhấn Áp dụng để nhận ưu đãi
      </p>
    </div>
  );
}
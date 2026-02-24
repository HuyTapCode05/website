interface SummaryBoxProps {
  cartTotal: number;
  discount: number;
  finalTotal: number;
}

export default function SummaryBox({
  cartTotal,
  discount,
  finalTotal,
}: SummaryBoxProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tổng tiền hàng:</span>
          <span className="font-semibold text-gray-800">{cartTotal.toLocaleString()}₫</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-semibold text-gray-800">0₫</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-green-600">Giảm giá:</span>
            <span className="font-semibold text-green-600">-{discount.toLocaleString()}₫</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-red-600">{finalTotal.toLocaleString()}₫</span>
          </div>
        </div>
      </div>

      {discount > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Bạn đã tiết kiệm được {discount.toLocaleString()}₫</span>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-gray-500 text-sm text-center">
          Đã bao gồm VAT (nếu có)
        </p>
      </div>
    </div>
  );
}
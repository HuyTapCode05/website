interface Props {
  order: any;
}

export default function OrderSummary({ order }: Props) {
  const finalTotal =
    order.totalAmount + order.shippingFee - order.discountAmount;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Tổng kết đơn hàng</h2>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tổng tiền hàng:</span>
          <span className="font-semibold text-gray-800">{order.totalAmount.toLocaleString()}₫</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-semibold text-gray-800">{order.shippingFee.toLocaleString()}₫</span>
        </div>

        {order.discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-green-600">Giảm giá:</span>
            <span className="font-semibold text-green-600">-{order.discountAmount.toLocaleString()}₫</span>
          </div>
        )}

        {/* Coupon Code */}
        {order.couponCode && (
          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-blue-600 font-medium">Mã giảm giá:</span>
            </div>
            <span className="font-semibold text-blue-600">{order.couponCode}</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-red-600">{finalTotal.toLocaleString()}₫</span>
          </div>
        </div>

        {/* Savings Info */}
        {order.discountAmount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bạn đã tiết kiệm được {order.discountAmount.toLocaleString()}₫</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
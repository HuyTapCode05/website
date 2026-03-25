interface Props { order: any; }

export default function OrderSummary({ order }: Props) {
  const total = order.totalAmount + order.shippingFee - order.discountAmount;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">Sản phẩm đã đặt</h3>
      </div>
      {order.items && order.items.length > 0 && (
        <div className="divide-y divide-gray-50">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50/50 transition-colors">
              {item.imageUrl && (
                <img src={"http://localhost:8080" + item.imageUrl}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100" alt={item.productName}
                  onError={e => { (e.target as HTMLImageElement).src = "/no-image.png"; }} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.productName}</p>
                <p className="text-xs text-gray-400">SL: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-gray-800">{(item.price * item.quantity).toLocaleString()}đ</p>
            </div>
          ))}
        </div>
      )}
      <div className="px-6 py-4 space-y-2 bg-gray-50/50 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tổng hàng</span>
          <span className="font-semibold text-gray-800">{order.totalAmount.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Phí ship</span>
          <span className="font-semibold text-emerald-600">{order.shippingFee > 0 ? order.shippingFee.toLocaleString() + "đ" : "Miễn phí"}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">Giảm giá {order.couponCode && `(${order.couponCode})`}</span>
            <span className="font-bold text-emerald-600">−{order.discountAmount.toLocaleString()}đ</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-bold text-gray-800">Tổng thanh toán</span>
          <span className="text-lg font-bold" style={{ color: '#C9A96E' }}>{total.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
}
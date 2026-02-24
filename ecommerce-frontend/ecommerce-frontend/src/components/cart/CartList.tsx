export default function CartList({ cart, updateQty, removeItem }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Sản phẩm</h2>
        <span className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>
          {cart.items.length} sản phẩm
        </span>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-gray-50">
        {cart.items.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50/50 transition-colors duration-200"
          >
            {/* Product Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100"
              style={{ background: '#F3F4F6' }}>
              <img
                src={"http://localhost:8080" + item.imageUrl}
                className="w-full h-full object-cover"
                alt={item.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/no-image.png";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
              <div className="mt-1">
                <span className="text-sm font-bold" style={{ color: '#C9A96E' }}>
                  {Number(item.price).toLocaleString()}đ
                </span>
              </div>

              {/* Quantity Controls - mobile friendly */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Xóa"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Line Total */}
            <div className="text-right hidden sm:block">
              <p className="font-bold text-gray-900">
                {Number(item.price * item.quantity).toLocaleString()}đ
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {item.quantity} × {Number(item.price).toLocaleString()}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cart.items.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(201,169,110,0.1)' }}>
            <svg className="w-8 h-8" style={{ color: '#C9A96E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Giỏ hàng trống</h3>
          <p className="text-sm text-gray-500">Hãy thêm sản phẩm để bắt đầu mua sắm</p>
        </div>
      )}
    </div>
  );
}
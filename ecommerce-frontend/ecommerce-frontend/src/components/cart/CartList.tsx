export default function CartList({ cart, updateQty, removeItem }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">Sản phẩm</h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
          {cart.items.length} sản phẩm
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {cart.items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={"http://localhost:8080" + item.imageUrl} className="w-full h-full object-cover" alt={item.name}
                onError={e => { (e.target as HTMLImageElement).src = "/no-image.png"; }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
              <p className="text-sm font-bold mt-1" style={{ color: '#C9A96E' }}>{Number(item.price).toLocaleString()}đ</p>
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center rounded-lg overflow-hidden border border-gray-200">
                  <button onClick={() => updateQty(item.id, "dec")} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm">−</button>
                  <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, "inc")} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-right hidden sm:block flex-shrink-0">
              <p className="font-bold text-gray-800">{Number(item.price * item.quantity).toLocaleString()}đ</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.quantity} × {Number(item.price).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
interface SummaryBoxProps {
  cartTotal: number;
  discount: number;
  finalTotal: number;
}

export default function SummaryBox({ cartTotal, discount, finalTotal }: SummaryBoxProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Tổng tiền hàng</span>
          <span className="font-semibold text-gray-800">{cartTotal.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Vận chuyển</span>
          <span className="font-semibold text-emerald-600">Miễn phí</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-emerald-600">Giảm giá</span>
            <span className="font-bold text-emerald-600">−{discount.toLocaleString()}đ</span>
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 mt-4 pt-4">
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-gray-800">Tổng cộng</span>
          <span className="text-2xl font-extrabold" style={{ color: '#C9A96E' }}>{finalTotal.toLocaleString()}đ</span>
        </div>
      </div>
      {discount > 0 && (
        <div className="mt-3 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 text-emerald-600">
          🎉 Tiết kiệm {discount.toLocaleString()}đ
        </div>
      )}
    </div>
  );
}
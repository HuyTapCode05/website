interface Props { order: any; cancelOrder: () => void; cancelling?: boolean; }

export default function CancelOrderButton({ order, cancelOrder, cancelling = false }: Props) {
  const canCancel = ["PENDING", "PAID", "PROCESSING"].includes(order.orderStatus);
  if (!canCancel) return null;

  return (
    <button onClick={cancelOrder} disabled={cancelling}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors"
      style={{
        background: cancelling ? '#f3f4f6' : '#FEE2E2',
        color: cancelling ? '#9ca3af' : '#DC2626',
        cursor: cancelling ? 'not-allowed' : 'pointer',
      }}>
      {cancelling ? (<><div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div> Đang hủy...</>) : 'Hủy đơn hàng'}
    </button>
  );
}
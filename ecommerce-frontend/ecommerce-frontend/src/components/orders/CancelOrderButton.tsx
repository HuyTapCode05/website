interface Props {
  order: any;
  cancelOrder: () => void;
  cancelling?: boolean;
}

export default function CancelOrderButton({ order, cancelOrder, cancelling = false }: Props) {
  const canCancel =
    order.orderStatus === "PENDING" ||
    order.orderStatus === "PAID" ||
    order.orderStatus === "PROCESSING";

  if (!canCancel) return null;

  return (
    <button
      onClick={cancelOrder}
      disabled={cancelling}
      className={`flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full ${
        cancelling
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
      }`}
    >
      {cancelling ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Đang hủy đơn hàng...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Hủy đơn hàng
        </>
      )}
    </button>
  );
}
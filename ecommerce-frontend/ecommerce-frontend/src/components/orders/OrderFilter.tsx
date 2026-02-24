interface Props {
  status: string;
  setStatus: (value: string) => void;
}

export default function OrderFilter({ status, setStatus }: Props) {
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đang giao hàng" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" }
  ];

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "PENDING": return "bg-yellow-100 text-yellow-600";
      case "PAID": return "bg-blue-100 text-blue-600";
      case "PROCESSING": return "bg-purple-100 text-purple-600";
      case "SHIPPED": return "bg-orange-100 text-orange-600";
      case "COMPLETED": return "bg-green-100 text-green-600";
      case "CANCELLED": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <label className="font-semibold text-gray-700 text-lg">Lọc theo trạng thái</label>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatus(option.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              status === option.value
                ? `${getStatusColor(option.value)} shadow-lg border-2 border-current`
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 shadow-sm"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-3">
        Hiển thị đơn hàng theo trạng thái bạn muốn xem
      </p>
    </div>
  );
}
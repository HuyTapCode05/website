import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/orders", {
        params: { status: statusFilter }
      });
      setOrders(res.data);
    } catch (err) {
      console.log("Load admin orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: number, action: string, status?: string) => {
    if (!confirm(getConfirmMessage(action))) return;

    try {
      setProcessingOrder(orderId);

      if (action === "approve") {
        await api.post(`/api/admin/orders/${orderId}/approve`);
      } else if (action === "status" && status) {
        await api.post(`/api/admin/orders/${orderId}/status`, null, {
          params: { status }
        });
      }

      alert(getSuccessMessage(action));
      loadOrders();
    } catch (err) {
      console.log(`${action} error:`, err);
      alert("Không thể thực hiện thao tác!");
    } finally {
      setProcessingOrder(null);
    }
  };

  const getConfirmMessage = (action: string) => {
    switch (action) {
      case "approve": return "Xác nhận DUYỆT đơn hàng này?";
      case "SHIPPED": return "Chuyển đơn hàng sang ĐANG GIAO?";
      case "COMPLETED": return "Đánh dấu đơn hàng HOÀN THÀNH?";
      default: return "Xác nhận thao tác?";
    }
  };

  const getSuccessMessage = (action: string) => {
    switch (action) {
      case "approve": return "Đã duyệt đơn hàng!";
      case "SHIPPED": return "Đơn hàng đã chuyển sang ĐANG GIAO!";
      case "COMPLETED": return "Đơn hàng đã hoàn thành!";
      default: return "Thao tác thành công!";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-600";
      case "PAID": return "bg-blue-100 text-blue-600";
      case "PROCESSING": return "bg-purple-100 text-purple-600";
      case "SHIPPED": return "bg-orange-100 text-orange-600";
      case "COMPLETED": return "bg-green-100 text-green-600";
      case "CANCELLED": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Chờ duyệt";
      case "PAID": return "Đã thanh toán";
      case "PROCESSING": return "Đang xử lý";
      case "SHIPPED": return "Đang giao hàng";
      case "COMPLETED": return "Hoàn thành";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <div className="p-6 max-w-7xl mx-auto">
        <AdminHeader title="Quản lý đơn hàng" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Admin Navigation */}
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-3 h-12 rounded-full" style={{ background: 'linear-gradient(to bottom, #C9A96E, #8B6914)' }}></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý và cập nhật trạng thái tất cả đơn hàng trong hệ thống
            </p>
          </div>
          <div className="ml-auto px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
            {orders.length} đơn hàng
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 rounded-full" style={{ background: '#C9A96E' }}></div>
            <label className="font-semibold text-gray-700 text-lg">Lọc theo trạng thái</label>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full max-w-xs border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
              <p className="text-gray-600 font-medium">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold text-gray-800">
                        Đơn hàng #{order.orderNo}
                      </h2>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="text-gray-600">
                          Tổng tiền hàng: {order.totalAmount.toLocaleString()}₫
                        </div>
                      </div>

                      <div className="space-y-1">
                        {order.shippingFee > 0 && (
                          <div className="text-gray-600">
                            Phí vận chuyển: {order.shippingFee.toLocaleString()}₫
                          </div>
                        )}
                        {order.discountAmount > 0 && (
                          <div className="text-green-600">
                            Giảm giá: -{order.discountAmount.toLocaleString()}₫
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-lg font-bold text-red-600">
                      Tổng thanh toán: {(order.totalAmount + order.shippingFee - order.discountAmount).toLocaleString()}₫
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {/* Duyệt đơn */}
                    {order.orderStatus === "PENDING" && (
                      <button
                        onClick={() => handleOrderAction(order.id, "approve")}
                        disabled={processingOrder === order.id}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${processingOrder === order.id
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                          }`}
                      >
                        {processingOrder === order.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Duyệt đơn
                          </>
                        )}
                      </button>
                    )}

                    {/* Chuyển sang Đang giao */}
                    {order.orderStatus === "PROCESSING" && (
                      <button
                        onClick={() => handleOrderAction(order.id, "status", "SHIPPED")}
                        disabled={processingOrder === order.id}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${processingOrder === order.id
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                          }`}
                      >
                        {processingOrder === order.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Chuyển sang Đang giao
                          </>
                        )}
                      </button>
                    )}

                    {/* Hoàn thành */}
                    {order.orderStatus === "SHIPPED" && (
                      <button
                        onClick={() => handleOrderAction(order.id, "status", "COMPLETED")}
                        disabled={processingOrder === order.id}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${processingOrder === order.id
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                          }`}
                      >
                        {processingOrder === order.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Hoàn thành
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có đơn hàng nào</h3>
                <p className="text-gray-500">Không tìm thấy đơn hàng nào phù hợp với bộ lọc</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {!loading && orders.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-sm text-blue-500 font-medium">Tổng số</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.orderStatus === 'PENDING').length}
              </div>
              <div className="text-sm text-yellow-500 font-medium">Chờ duyệt</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.orderStatus === 'PROCESSING').length}
              </div>
              <div className="text-sm text-purple-500 font-medium">Đang xử lý</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.orderStatus === 'SHIPPED').length}
              </div>
              <div className="text-sm text-orange-500 font-medium">Đang giao</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.orderStatus === 'COMPLETED').length}
              </div>
              <div className="text-sm text-green-500 font-medium">Hoàn thành</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.orderStatus === 'CANCELLED').length}
              </div>
              <div className="text-sm text-red-500 font-medium">Đã hủy</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function CouponList({ coupons, deleteCoupon }: any) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PERCENT': return 'Giảm %';
      case 'FIXED': return 'Giảm tiền';
      case 'FREESHIP': return 'Miễn phí ship';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PERCENT': return 'bg-blue-100 text-blue-600';
      case 'FIXED': return 'bg-green-100 text-green-600';
      case 'FREESHIP': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getValueDisplay = (coupon: any) => {
    switch (coupon.type) {
      case 'PERCENT': return `${coupon.value}%`;
      case 'FIXED': return `${coupon.value.toLocaleString()}đ`;
      case 'FREESHIP': return 'Miễn phí';
      default: return coupon.value;
    }
  };

  const isCouponActive = (coupon: any) => {
    const now = new Date();
    const start = new Date(coupon.startAt);
    const end = new Date(coupon.endAt);
    return now >= start && now <= end;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Danh sách mã giảm giá</h2>
        </div>
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {coupons.length} mã giảm giá
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Mã</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Loại</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Giá trị</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Đơn tối thiểu</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Sử dụng</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Hiệu lực</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {coupons.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="p-4">
                  <div className="font-semibold text-gray-800 text-lg">{c.code}</div>
                  <div className="text-sm text-gray-500">ID: {c.id}</div>
                </td>
                
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(c.type)}`}>
                    {getTypeLabel(c.type)}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className="font-semibold text-gray-800 text-lg">
                    {getValueDisplay(c)}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className="text-gray-700 font-medium">
                    {c.minimumOrderAmount ? `${c.minimumOrderAmount.toLocaleString()}đ` : 'Không'}
                  </span>
                </td>
                
                <td className="p-4">
                  <div className="text-sm">
                    <div className="text-gray-700">
                      <span className="font-medium">{c.usedCount || 0}</span>
                      {c.usageLimit ? ` / ${c.usageLimit}` : ' / ∞'}
                    </div>
                    {c.usageLimit && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((c.usedCount || 0) / c.usageLimit * 100, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{formatDate(c.startAt)}</div>
                    <div>đến</div>
                    <div className="font-medium">{formatDate(c.endAt)}</div>
                  </div>
                </td>
                
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isCouponActive(c) 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {isCouponActive(c) ? 'Đang hoạt động' : 'Đã hết hạn'}
                  </span>
                </td>
                
                <td className="p-4">
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {coupons.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có mã giảm giá nào</h3>
          <p className="text-gray-500">Tạo mã giảm giá đầu tiên để bắt đầu</p>
        </div>
      )}
    </div>
  );
}
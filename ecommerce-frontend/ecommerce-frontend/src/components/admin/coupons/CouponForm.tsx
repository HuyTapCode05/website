export default function CouponForm({ form, updateField, createCoupon }: any) {
  const isFormValid = form.code && form.value > 0 && form.startAt && form.endAt;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Tạo mã giảm giá mới</h2>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Code */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mã giảm giá <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="code"
              value={form.code}
              onChange={updateField}
              placeholder="Ví dụ: SALE10"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              
            </div>
          </div>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Loại giảm giá <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={updateField}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
          >
            <option value="PERCENT">Giảm phần trăm (%)</option>
            <option value="FIXED">Giảm tiền (đ)</option>
            <option value="FREESHIP">Miễn phí ship</option>
          </select>
        </div>

        {/* Value */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Giá trị <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="value"
              type="number"
              value={form.value}
              onChange={updateField}
              placeholder={form.type === 'PERCENT' ? '0-100' : '0'}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              {form.type === 'PERCENT' ? '%' : 'đ'}
            </div>
          </div>
        </div>

        {/* Min order */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Đơn tối thiểu
          </label>
          <div className="relative">
            <input
              name="minimumOrderAmount"
              type="number"
              value={form.minimumOrderAmount}
              onChange={updateField}
              placeholder="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              đ
            </div>
          </div>
        </div>

        {/* Usage limit */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Giới hạn sử dụng
          </label>
          <div className="relative">
            <input
              name="usageLimit"
              type="number"
              value={form.usageLimit}
              onChange={updateField}
              placeholder="Không giới hạn"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              
            </div>
          </div>
        </div>

        {/* Start */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Bắt đầu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="startAt"
              type="datetime-local"
              value={form.startAt}
              onChange={updateField}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              
            </div>
          </div>
        </div>

        {/* End */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Kết thúc <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="endAt"
              type="datetime-local"
              value={form.endAt}
              onChange={updateField}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full ${isFormValid ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span>
            {isFormValid 
              ? 'Đã sẵn sàng để tạo mã giảm giá' 
              : 'Vui lòng điền đầy đủ thông tin bắt buộc'
            }
          </span>
        </div>

        <button
          onClick={createCoupon}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isFormValid
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tạo mã giảm giá
        </button>
      </div>
    </div>
  );
}
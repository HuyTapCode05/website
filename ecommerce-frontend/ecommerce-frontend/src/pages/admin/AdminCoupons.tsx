import { useAdminCoupons } from "../../hooks/useAdminCoupons";
import CouponForm from "../../components/admin/coupons/CouponForm";
import CouponList from "../../components/admin/coupons/CouponList";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminCoupons() {
  const {
    coupons,
    loading,
    form,
    updateField,
    createCoupon,
    deleteCoupon,
  } = useAdminCoupons();

  return (
    <div className="min-h-screen p-6" style={{ background: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Quản lý mã giảm giá" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý mã giảm giá
            </h1>
            <p className="text-gray-600 mt-2">
              Tạo và quản lý các mã giảm giá, khuyến mãi trong hệ thống
            </p>
          </div>
          <div className="ml-auto px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
            {coupons.length} mã giảm giá
          </div>
        </div>

        {/* Coupon Form */}
        <div className="mb-8">
          <CouponForm
            form={form}
            updateField={updateField}
            createCoupon={createCoupon}
          />
        </div>

        {/* Coupon List */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
                <p className="text-gray-600 font-medium">Đang tải mã giảm giá...</p>
              </div>
            </div>
          ) : (
            <CouponList coupons={coupons} deleteCoupon={deleteCoupon} />
          )}
        </div>

        {/* Quick Stats */}

      </div>
    </div>
  );
}
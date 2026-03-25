import { useAdminCoupons } from "../../hooks/useAdminCoupons";
import CouponForm from "../../components/admin/coupons/CouponForm";
import CouponList from "../../components/admin/coupons/CouponList";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminCoupons() {
  const {
    coupons, loading, form, updateField, createCoupon, deleteCoupon,
  } = useAdminCoupons();

  return (
    <div className="min-h-screen" style={{ background: "#0F1117" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AdminHeader title="Quản lý mã giảm giá" />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Mã giảm giá</h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Tạo và quản lý coupon khuyến mãi</p>
          </div>
          <span className="text-sm font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
            {coupons.length} mã
          </span>
        </div>

        {/* Coupon Form */}
        <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <h2 className="font-bold text-white mb-4">➕ Tạo mã giảm giá mới</h2>
          <CouponForm form={form} updateField={updateField} createCoupon={createCoupon} />
        </div>

        {/* Coupon List */}
        <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <h2 className="font-bold text-white mb-4">🎟️ Danh sách mã giảm giá</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-gray-700 rounded-full animate-spin" style={{ borderTopColor: "#C9A96E" }}></div>
                <p className="text-sm" style={{ color: "#6B7280" }}>Đang tải...</p>
              </div>
            </div>
          ) : (
            <CouponList coupons={coupons} deleteCoupon={deleteCoupon} />
          )}
        </div>
      </div>
    </div>
  );
}
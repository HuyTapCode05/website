import AdminMenu from "../../components/AdminMenu";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-6" style={{ background: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminHeader title="Bảng điều khiển" />

        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <div>
            <p className="text-sm" style={{ color: '#C9A96E' }}>Chào mừng quay lại</p>
            <h1 className="text-2xl font-bold text-white mt-1">
              Bảng điều khiển Admin
            </h1>
            <p className="mt-2" style={{ color: '#9CA3AF' }}>
              Truy cập nhanh các chức năng quản trị bên dưới.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
              Đang hoạt động
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Sản phẩm", icon: "👕", value: "--" },
            { label: "Đơn hàng", icon: "📦", value: "--" },
            { label: "Mã giảm giá", icon: "🎟️", value: "--" },
            { label: "Danh mục", icon: "📂", value: "--" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(201,169,110,0.1)' }}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-lg font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Menu */}
        <AdminMenu />
      </div>
    </div>
  );
}

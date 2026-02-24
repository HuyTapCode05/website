import { Link } from "react-router-dom";

export default function AdminMenu() {
  const menuItems = [
    {
      to: "/admin/categories",
      label: "Quản lý danh mục",
      desc: "Thêm, sửa, xóa danh mục sản phẩm",
      icon: "📂",
      color: "#C9A96E",
    },
    {
      to: "/admin/products",
      label: "Quản lý sản phẩm",
      desc: "Quản lý sản phẩm trong cửa hàng",
      icon: "👕",
      color: "#C9A96E",
    },
    {
      to: "/admin/coupons",
      label: "Quản lý mã giảm giá",
      desc: "Tạo và quản lý coupon khuyến mãi",
      icon: "🎟️",
      color: "#C9A96E",
    },
    {
      to: "/admin/orders",
      label: "Quản lý đơn hàng",
      desc: "Theo dõi và xử lý đơn hàng",
      icon: "📦",
      color: "#C9A96E",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="mb-5">
        <h2 className="font-bold text-lg text-gray-900">Chức năng quản trị</h2>
        <div className="w-10 h-0.5 mt-2 rounded-full" style={{ background: '#C9A96E' }}></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {menuItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="group p-4 rounded-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-md"
            style={{ background: '#FAFAFA' }}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="font-semibold text-sm text-gray-800 group-hover:text-amber-700 transition-colors">
              {item.label}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }}></div>
          <span>Hệ thống đang hoạt động</span>
        </div>
      </div>
    </div>
  );
}
import { Link, useNavigate, useLocation } from "react-router-dom";

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title = "Quản trị Admin" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("role-changed"));
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/products", label: "Sản phẩm", icon: "👕" },
    { to: "/admin/categories", label: "Danh mục", icon: "📂" },
    { to: "/admin/coupons", label: "Mã giảm giá", icon: "🎟️" },
    { to: "/admin/orders", label: "Đơn hàng", icon: "📦" },
  ];

  return (
    <div className="mb-6" style={{ background: '#111827', borderRadius: '16px', padding: '16px 24px', border: '1px solid #1F2937' }}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #C9A96E, #B8943F)', color: '#111827' }}>
            FS
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Khu vực quản trị hệ thống</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-1.5">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(201,169,110,0.15)' : 'transparent',
                  color: isActive ? '#C9A96E' : '#D1D5DB',
                  border: isActive ? '1px solid rgba(201,169,110,0.3)' : '1px solid transparent',
                }}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{ background: '#DC2626', color: 'white' }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

interface HeaderProps {
  name: string;
  email: string;
  logout: () => void;
  cartCount: number;
  orderCount: number;
}

export default function Header({ name, email, logout, cartCount, orderCount }: HeaderProps) {
  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-200/60 mb-6">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
            <span className="text-white font-bold text-sm tracking-tight">FS</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold tracking-tight text-gray-900 leading-none">FASHION</h1>
            <p className="text-[10px] tracking-[0.2em] text-gray-400 font-medium">STORE</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">

          {/* Home */}
          <Link to="/"
            className="flex items-center gap-1.5 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="hidden lg:inline">Trang chủ</span>
          </Link>

          {/* Search */}
          <Link to="/search"
            className="flex items-center gap-1.5 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span className="hidden lg:inline">Tìm kiếm</span>
          </Link>

          {/* Cart */}
          <Link to="/cart"
            className="relative flex items-center gap-1.5 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span className="hidden lg:inline">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 left-6 lg:relative lg:top-0 lg:left-0 bg-gray-900 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Orders */}
          <Link to="/orders"
            className="relative flex items-center gap-1.5 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span className="hidden lg:inline">Đơn hàng</span>
            {orderCount > 0 && (
              <span className="absolute -top-0.5 left-6 lg:relative lg:top-0 lg:left-0 bg-amber-600 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] rounded-full flex items-center justify-center">
                {orderCount}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

          {/* User info */}
          {name && (
            <div className="hidden sm:flex items-center gap-2 px-2">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium max-w-[100px] truncate">{name}</span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium btn-press"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden md:inline">Đăng xuất</span>
          </button>

        </nav>
      </div>
    </header>
  );
}

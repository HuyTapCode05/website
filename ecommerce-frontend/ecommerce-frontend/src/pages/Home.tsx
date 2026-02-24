import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";
import { Link } from "react-router-dom";
import AdminMenu from "../components/AdminMenu";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [promo, setPromo] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const loadCartCount = async () => {
    try {
      const params = userId ? {} : { sessionId };
      const res = await api.get("/api/cart", { params });
      setCartCount(res.data?.items?.length || 0);
    } catch { /* silent */ }
  };

  const loadOrderCount = async () => {
    try {
      if (!userId) return;
      const res = await api.get("/api/orders", { params: { userId } });
      setOrderCount(res.data.length || 0);
    } catch { /* silent */ }
  };

  const loadHomeData = async () => {
    try {
      const res = await api.get("/products");
      const products = res.data || [];
      setAllProducts(products);
      setLatest([...products].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 8));
      setPromo(products.filter((p: any) => p.salePrice != null && p.salePrice !== 0).slice(0, 8));
    } catch { /* silent */ }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch { /* silent */ }
  };

  useEffect(() => {
    loadHomeData();
    loadCartCount();
    loadOrderCount();
    loadCategories();
  }, []);

  const categoryIcons: Record<string, string> = {
    "áo": "👕", "áo thun": "👕", "áo sơ mi": "👔", "áo khoác": "🧥",
    "quần": "👖", "quần jean": "👖", "quần kaki": "👖",
    "giày": "👟", "giày dép": "👟", "dép": "🩴",
    "phụ kiện": "👜", "túi": "👜", "mũ": "🧢", "kính": "🕶️",
    "váy": "👗", "đầm": "👗",
  };

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (lower.includes(key)) return icon;
    }
    return "🏷️";
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Header
        name={name || ""}
        email={email || ""}
        logout={logout}
        cartCount={cartCount}
        orderCount={orderCount}
      />

      {/* Admin Menu */}
      {role === "ROLE_ADMIN" && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <AdminMenu />
        </div>
      )}

      {/* ============================== */}
      {/* HERO SECTION */}
      {/* ============================== */}
      <section className="relative overflow-hidden text-white" style={{ backgroundColor: '#111827' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl animate-fade-in">
            <p className="text-amber-400 text-sm font-medium tracking-[0.2em] uppercase mb-3">
              Bộ sưu tập mới 2026
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] mb-4">
              Phong cách
              <span className="block text-gradient italic mt-1">của riêng bạn</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Khám phá xu hướng thời trang mới nhất với chất lượng vượt trội và giá cả hợp lý
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/search"
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg btn-press"
              >
                Khám phá ngay
              </Link>
              <a
                href="#sale"
                className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/10 transition-all btn-press"
              >
                Ưu đãi hôm nay
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        {/* ============================== */}
        {/* CATEGORIES */}
        {/* ============================== */}
        {categories.length > 0 && (
          <section className="py-10 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Danh mục sản phẩm</h2>
              <Link to="/search" className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {categories.slice(0, 6).map((cat: any) => (
                <Link
                  key={cat.id}
                  to={`/search?categoryId=${cat.id}`}
                  className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all card-hover"
                >
                  <span className="text-2xl group-hover:animate-float">{getCategoryIcon(cat.name)}</span>
                  <span className="text-xs font-medium text-gray-700 text-center line-clamp-1">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============================== */}
        {/* LATEST PRODUCTS */}
        {/* ============================== */}
        <section id="latest" className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Sản phẩm mới</h2>
              <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                NEW
              </span>
            </div>
            {latest.length > 0 && (
              <span className="text-sm text-gray-400">{latest.length} sản phẩm</span>
            )}
          </div>

          {latest.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">👕</p>
              <p className="text-sm">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
              {latest.map((p) => (
                <ProductCard key={p.id} p={p} sessionId={sessionId!} userId={userId} />
              ))}
            </div>
          )}
        </section>

        {/* ============================== */}
        {/* SALE PRODUCTS */}
        {/* ============================== */}
        {promo.length > 0 && (
          <section id="sale" className="py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Đang giảm giá</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  SALE
                </span>
              </div>
              <span className="text-sm text-gray-400">{promo.length} sản phẩm</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
              {promo.map((p) => (
                <ProductCard key={p.id} p={p} sessionId={sessionId!} userId={userId} />
              ))}
            </div>
          </section>
        )}

        {/* ============================== */}
        {/* ALL PRODUCTS */}
        {/* ============================== */}
        <section className="py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Tất cả sản phẩm</h2>
            <span className="text-sm text-gray-400">{allProducts.length} sản phẩm</span>
          </div>

          {allProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">🏪</p>
              <p className="text-sm">Chưa có sản phẩm nào trong cửa hàng</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
              {allProducts.map((p) => (
                <ProductCard key={p.id} p={p} sessionId={sessionId!} userId={userId} />
              ))}
            </div>
          )}
        </section>

        {/* ============================== */}
        {/* FOOTER */}
        {/* ============================== */}
        <footer className="border-t border-gray-200 py-10 text-center">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 tracking-tight">FASHION STORE</h3>
            <p className="text-xs text-gray-400 tracking-[0.15em] mt-0.5">STYLE • QUALITY • VALUE</p>
          </div>
          <div className="flex items-center justify-center gap-6 mb-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Trang chủ</Link>
            <Link to="/search" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Sản phẩm</Link>
            <Link to="/cart" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Giỏ hàng</Link>
            <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Đơn hàng</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 Fashion Store. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

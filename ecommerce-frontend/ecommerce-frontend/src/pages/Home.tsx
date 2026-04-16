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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [savedCodes, setSavedCodes] = useState<Set<string>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("savedVouchers") || "[]");
      return new Set(stored);
    } catch { return new Set(); }
  });
  const [toastCode, setToastCode] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? allProducts.filter((p: any) => p.categoryId === selectedCategory || p.category?.id === selectedCategory)
    : allProducts;

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

  const loadVouchers = async () => {
    try {
      const url = userId ? `/api/coupons/available?userId=${userId}` : "/api/coupons/available";
      const res = await api.get(url);
      setVouchers(Array.isArray(res.data) ? res.data : []);
    } catch { /* silent */ }
  };

  const copyVoucher = (v: any) => {
    navigator.clipboard.writeText(v.code);
    const updated = new Set(savedCodes);
    updated.add(v.code);
    setSavedCodes(updated);
    localStorage.setItem("savedVouchers", JSON.stringify([...updated]));
    setToastCode(v.code);
    setTimeout(() => setToastCode(null), 3000);
  };

  useEffect(() => {
    loadHomeData();
    loadCartCount();
    loadOrderCount();
    loadCategories();
    loadVouchers();
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
              <a
                href="#all-products"
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg btn-press"
              >
                Khám phá ngay
              </a>
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
              <a href="#all-products" className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
                Xem tất cả →
              </a>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {categories.slice(0, 6).map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                    setTimeout(() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className={`group flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all card-hover ${selectedCategory === cat.id
                      ? 'bg-amber-50 border-amber-300 shadow-md'
                      : 'bg-white border-gray-100 hover:border-amber-200 hover:shadow-md'
                    }`}
                >
                  <span className="text-2xl group-hover:animate-float">{getCategoryIcon(cat.name)}</span>
                  <span className={`text-xs font-medium text-center line-clamp-1 ${selectedCategory === cat.id ? 'text-amber-700' : 'text-gray-700'}`}>{cat.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ============================== */}
        {/* SHOPEE-STYLE VOUCHER BANNER */}
        {/* ============================== */}
        {vouchers.length > 0 && (
          <section className="py-6">
            <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%)', border: '1px solid #FDE68A' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #FDE68A' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎫</span>
                  <h2 className="text-base font-bold" style={{ color: '#C2410C' }}>Mã Giảm Giá</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm text-white" style={{ background: '#EF4444' }}>HOT</span>
                </div>
                <span className="text-xs font-medium" style={{ color: '#C2410C' }}>{vouchers.length} mã khả dụng</span>
              </div>
              {/* Voucher cards */}
              <div className="flex gap-3 px-5 py-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {vouchers.map((v: any) => {
                  const isPercent = v.type === 'PERCENT';
                  const isFixed = v.type === 'FIXED';
                  const isFreeShip = v.type === 'FREESHIP';
                  const usedPct = v.usageLimit ? Math.round(((v.usedCount || 0) / v.usageLimit) * 100) : 0;
                  const isSaved = savedCodes.has(v.code);
                  return (
                    <div key={v.id} className="flex-shrink-0 flex" style={{ width: '280px' }}>
                      {/* Left ticket side */}
                      <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center relative rounded-l-lg"
                        style={{ background: isFreeShip ? '#0891B2' : '#EE4D2D', color: 'white' }}>
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: '#FFF7ED' }}></div>
                        {isFreeShip ? (
                          <>
                            <span className="text-lg">🚚</span>
                            <span className="text-[10px] font-bold mt-1">FREESHIP</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-medium opacity-80">Giảm</span>
                            <span className="text-xl font-black leading-tight">{isPercent ? `${v.value}%` : `${Math.round(v.value/1000)}K`}</span>
                          </>
                        )}
                      </div>
                      {/* Right content side */}
                      <div className="flex-1 bg-white rounded-r-lg border border-l-0 px-3 py-2.5 flex flex-col justify-between relative"
                        style={{ borderColor: '#f3f4f6' }}>
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: '#FFF7ED' }}></div>
                        <div>
                          <p className="text-[11px] font-black tracking-widest px-1.5 py-0.5 rounded inline-block mb-0.5"
                            style={{ background: '#FFF7ED', color: '#C2410C', border: '1px dashed #FDBA74' }}>
                            {v.code}
                          </p>
                          <p className="text-xs font-bold text-gray-800 leading-tight">
                            {isPercent ? `Giảm ${v.value}%` : isFixed ? `Giảm ${v.value?.toLocaleString()}đ` : 'Miễn phí vận chuyển'}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {v.minimumOrderAmount > 0 ? `Đơn tối thiểu ${v.minimumOrderAmount?.toLocaleString()}đ` : 'Không giới hạn'}
                          </p>
                        </div>
                        <div className="mt-2">
                          {v.usageLimit && (
                            <div className="mb-1.5">
                              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#FEE2E2' }}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${usedPct}%`, background: '#EF4444' }}></div>
                              </div>
                              <p className="text-[9px] mt-0.5" style={{ color: usedPct > 70 ? '#EF4444' : '#9CA3AF' }}>
                                {usedPct > 70 ? 'Sắp hết' : `Đã dùng ${usedPct}%`}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              HSD: {new Date(v.endAt).toLocaleDateString('vi-VN')}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyVoucher(v); }}
                              className="text-[11px] font-bold px-3 py-1 rounded transition-all"
                              style={{
                                background: isSaved ? '#DCFCE7' : (isFreeShip ? '#0891B2' : '#EE4D2D'),
                                color: isSaved ? '#16A34A' : 'white',
                              }}
                            >
                              {isSaved ? '✓ Đã lưu' : 'Lưu'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
        <section id="all-products" className="py-8 pb-16 scroll-mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                {selectedCategory ? categories.find((c: any) => c.id === selectedCategory)?.name || 'Danh mục' : 'Tất cả sản phẩm'}
              </h2>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">✕ Bỏ lọc</button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{filteredProducts.length} sản phẩm</span>
              <Link to="/search" className="text-sm font-medium hover:underline" style={{ color: '#C9A96E' }}>Tìm kiếm →</Link>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">🏪</p>
              <p className="text-sm">Không có sản phẩm nào trong danh mục này</p>
              <button onClick={() => setSelectedCategory(null)} className="mt-3 text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">Xem tất cả</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
              {filteredProducts.map((p: any) => (
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

      {/* Voucher Toast */}
      {toastCode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
            <span className="text-xl">🎫</span>
            <div>
              <p className="text-xs text-gray-400">Đã copy mã giảm giá</p>
              <p className="text-sm font-black tracking-widest text-white">{toastCode}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
              Dùng khi thanh toán
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

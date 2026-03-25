import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import type { ProductDetail, ProductVariant } from "../../types/ProductDetail";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const userId = localStorage.getItem("userId");
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = "guest_" + crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  useEffect(() => {
    if (!slug) return;
    api.get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        // Auto-select first size/color
        const v = res.data.variants;
        if (v && v.length > 0) {
          const sizes = [...new Set(v.map((x: ProductVariant) => x.size).filter(Boolean))];
          const colors = [...new Set(v.map((x: ProductVariant) => x.color).filter(Boolean))];
          if (sizes.length > 0) setSelectedSize(sizes[0] as string);
          if (colors.length > 0) setSelectedColor(colors[0] as string);
        }
      })
      .catch((err) => console.log("Error load product:", err));
  }, [slug]);

  // Get unique sizes and colors
  const variants = product?.variants || [];
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];

  // Find selected variant
  const selectedVariant = variants.find(v =>
    (!selectedSize || v.size === selectedSize) &&
    (!selectedColor || v.color === selectedColor)
  );

  // Display price (variant price > product price)
  const displayPrice = selectedVariant?.salePrice || selectedVariant?.price || product?.salePrice || product?.price || 0;
  const originalPrice = selectedVariant?.price || product?.price || 0;
  const hasDiscount = product ? (selectedVariant ? (selectedVariant.salePrice && selectedVariant.salePrice < selectedVariant.price) : (product.salePrice && product.salePrice < product.price)) : false;
  const discountPercent = hasDiscount ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;
  const stockCount = selectedVariant?.stock;

  const addToCart = async () => {
    if (!product || adding) return;
    setAdding(true);
    try {
      await api.post(
        "/api/cart/add",
        {
          productId: product.id,
          quantity,
          ...(selectedVariant ? { variantId: selectedVariant.id } : {}),
        },
        { params: userId ? {} : { sessionId } }
      );
      window.dispatchEvent(new CustomEvent("cartNotification", {
        detail: { message: "Đã thêm vào giỏ hàng!", type: "success" },
      }));
    } catch (err: any) {
      console.log(err);
      window.dispatchEvent(new CustomEvent("cartNotification", {
        detail: { message: "Lỗi khi thêm vào giỏ hàng!", type: "error" },
      }));
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAFA' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#C9A96E' }}></div>
          <p className="text-gray-500 font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 border-b border-gray-200 glass">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: '#C9A96E' }}>FS</span>
            <span className="text-xs text-gray-400">FASHION STORE</span>
          </div>
          <button onClick={() => navigate('/cart')} className="text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative img-zoom" style={{ background: '#F3F4F6' }}>
              <img
                src={imageError ? "/no-image.png" : `http://localhost:8080${product.imageUrl}`}
                className="w-full aspect-square object-cover"
                alt={product.name}
                onError={() => setImageError(true)}
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4">
                  <span className="text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
                    style={{ background: '#DC2626' }}>
                    -{discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Category */}
              {product.categoryName && (
                <span className="text-xs font-medium tracking-[0.15em] uppercase mb-2" style={{ color: '#C9A96E' }}>
                  {product.categoryName}
                </span>
              )}

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold" style={{ color: '#DC2626' }}>
                      {displayPrice.toLocaleString()}đ
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {originalPrice.toLocaleString()}đ
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {displayPrice.toLocaleString()}đ
                  </span>
                )}
              </div>

              {/* ====== SIZE SELECTOR ====== */}
              {sizes.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
                    Kích thước
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => {
                      const isActive = selectedSize === s;
                      // Check if this size is in stock
                      const sizeVariant = variants.find(v => v.size === s && (!selectedColor || v.color === selectedColor));
                      const outOfStock = sizeVariant ? sizeVariant.stock === 0 : false;

                      return (
                        <button key={s} onClick={() => !outOfStock && setSelectedSize(s)}
                          disabled={outOfStock}
                          className="min-w-[48px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                          style={{
                            background: isActive ? '#111827' : outOfStock ? '#F3F4F6' : 'white',
                            color: isActive ? 'white' : outOfStock ? '#D1D5DB' : '#374151',
                            border: isActive ? '2px solid #111827' : '2px solid #E5E7EB',
                            cursor: outOfStock ? 'not-allowed' : 'pointer',
                            textDecoration: outOfStock ? 'line-through' : 'none',
                          }}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ====== COLOR SELECTOR ====== */}
              {colors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
                    Màu sắc
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(c => {
                      const isActive = selectedColor === c;
                      return (
                        <button key={c} onClick={() => setSelectedColor(c)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                          style={{
                            background: isActive ? '#111827' : 'white',
                            color: isActive ? 'white' : '#374151',
                            border: isActive ? '2px solid #111827' : '2px solid #E5E7EB',
                          }}>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock info */}
              {stockCount !== undefined && (
                <div className="mt-3">
                  <span className="text-xs font-medium" style={{ color: stockCount > 0 ? '#22C55E' : '#EF4444' }}>
                    {stockCount > 0 ? `Còn ${stockCount} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
              )}

              {/* ====== QUANTITY SELECTOR ====== */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">Số lượng</h3>
                <div className="flex items-center gap-0 border border-gray-200 rounded-lg w-fit overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg font-medium">
                    −
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(Math.min(stockCount ?? 99, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg font-medium">
                    +
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              </div>

              {/* Info badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
                {[
                  { icon: '✓', label: 'Chính hãng' },
                  { icon: '🚚', label: 'Giao nhanh' },
                  { icon: '🔒', label: 'Bảo mật' },
                ].map(b => (
                  <div key={b.label} className="text-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1" style={{ background: 'rgba(201,169,110,0.1)' }}>
                      <span className="text-sm">{b.icon}</span>
                    </div>
                    <span className="text-xs text-gray-500">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Add to Cart */}
              <div className="mt-auto pt-6">
                <button
                  onClick={addToCart}
                  disabled={adding || (stockCount !== undefined && stockCount === 0)}
                  className="w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 btn-press"
                  style={{
                    background: adding || (stockCount !== undefined && stockCount === 0) ? '#D1D5DB' : '#111827',
                    color: adding || (stockCount !== undefined && stockCount === 0) ? '#9CA3AF' : 'white',
                    cursor: adding || (stockCount !== undefined && stockCount === 0) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {adding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang thêm...
                    </>
                  ) : stockCount !== undefined && stockCount === 0 ? (
                    'Hết hàng'
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Thêm vào giỏ hàng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
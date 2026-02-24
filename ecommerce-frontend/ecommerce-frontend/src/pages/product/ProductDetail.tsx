import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosClient";
import type { ProductDetail } from "../../types/ProductDetail";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const userId = localStorage.getItem("userId");
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = "guest_" + crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  useEffect(() => {
    if (!slug) return;
    api.get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log("Error load product:", err));
  }, [slug]);

  const addToCart = async () => {
    if (!product || adding) return;
    setAdding(true);
    try {
      await api.post(
        "/api/cart/add",
        { productId: product.id, quantity: 1 },
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

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice! / product.price) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 border-b border-gray-200 glass">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: '#C9A96E' }}>FS</span>
            <span className="text-xs text-gray-400">FASHION STORE</span>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
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
                      {product.salePrice!.toLocaleString()}đ
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price.toLocaleString()}đ
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price.toLocaleString()}đ
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              </div>

              {/* Info badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1" style={{ background: 'rgba(201,169,110,0.1)' }}>
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-xs text-gray-500">Chính hãng</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1" style={{ background: 'rgba(201,169,110,0.1)' }}>
                    <span className="text-sm">🚚</span>
                  </div>
                  <span className="text-xs text-gray-500">Giao nhanh</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1" style={{ background: 'rgba(201,169,110,0.1)' }}>
                    <span className="text-sm">🔒</span>
                  </div>
                  <span className="text-xs text-gray-500">Bảo mật</span>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="mt-auto pt-6">
                <button
                  onClick={addToCart}
                  disabled={adding}
                  className="w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 btn-press"
                  style={{
                    background: adding ? '#D1D5DB' : '#111827',
                    color: adding ? '#9CA3AF' : 'white',
                    cursor: adding ? 'not-allowed' : 'pointer',
                  }}
                >
                  {adding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang thêm...
                    </>
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
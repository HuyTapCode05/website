import { api } from "../api/axiosClient";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  p: any;
  sessionId: string;
  userId: string | null;
}

export default function ProductCard({ p, sessionId, userId }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    try {
      await api.post(
        "/api/cart/add",
        { productId: p.id, quantity: 1 },
        { params: userId ? {} : { sessionId } }
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);

      window.dispatchEvent(new CustomEvent("cartNotification", {
        detail: { message: "Đã thêm vào giỏ hàng!", type: "success" },
      }));
    } catch (err) {
      console.log(err);
      window.dispatchEvent(new CustomEvent("cartNotification", {
        detail: { message: "Lỗi khi thêm vào giỏ hàng!", type: "error" },
      }));
    } finally {
      setIsAdding(false);
    }
  };

  const discountPercent = p.salePrice
    ? Math.round((1 - p.salePrice / p.price) * 100)
    : 0;

  return (
    <Link
      to={`/product/${p.slug}`}
      className="group block card-hover rounded-xl overflow-hidden bg-white border border-gray-100 animate-fade-in"
    >
      {/* Image Container — 4:5 ratio for clothing */}
      <div className="relative img-zoom bg-gray-50" style={{ paddingBottom: '125%' }}>
        <img
          src={imageError ? "/no-image.png" : "http://localhost:8080" + p.imageUrl}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
          alt={p.name}
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>

        {/* Sale Badge */}
        {p.salePrice && discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Category */}
        {p.categoryName && (
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-medium px-2 py-1 rounded-md">
              {p.categoryName}
            </span>
          </div>
        )}

        {/* Quick Add Button — appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={addToCart}
            disabled={isAdding}
            className={`w-full py-2.5 rounded-lg font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-2 btn-press ${showSuccess
                ? 'bg-green-600 text-white'
                : isAdding
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
              }`}
          >
            {showSuccess ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Đã thêm!</span>
              </>
            ) : isAdding ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>THÊM VÀO GIỎ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        {/* Name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-2 group-hover:text-gray-900 transition-colors">
          {p.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          {p.salePrice ? (
            <>
              <span className="text-base font-bold text-red-600">
                {p.salePrice.toLocaleString()}₫
              </span>
              <span className="text-xs text-gray-400 line-through">
                {p.price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-900">
              {p.price.toLocaleString()}₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
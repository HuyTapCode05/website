import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductCardSearchProps {
  product: any;
}

export default function ProductCardSearch({ product }: ProductCardSearchProps) {
  const [imageError, setImageError] = useState(false);

  const discountPercent = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block card-hover rounded-xl overflow-hidden bg-white border border-gray-100 animate-fade-in"
    >
      {/* Image — 4:5 ratio */}
      <div className="relative img-zoom bg-gray-50" style={{ paddingBottom: '125%' }}>
        <img
          src={imageError ? "/no-image.png" : `http://localhost:8080${product.imageUrl}`}
          className="absolute inset-0 w-full h-full object-cover"
          alt={product.name}
          onError={() => setImageError(true)}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>

        {/* Sale Badge */}
        {product.salePrice && discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Category */}
        {product.categoryName && (
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-medium px-2 py-1 rounded-md">
              {product.categoryName}
            </span>
          </div>
        )}

        {/* Quick view on hover */}
        <div className="absolute bottom-3 left-0 right-0 px-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="bg-gray-900/90 backdrop-blur-sm text-white text-center text-xs font-medium py-2.5 rounded-lg">
            Xem chi tiết
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-2 group-hover:text-gray-900 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 flex-wrap">
          {product.salePrice ? (
            <>
              <span className="text-base font-bold text-red-600">
                {product.salePrice.toLocaleString()}₫
              </span>
              <span className="text-xs text-gray-400 line-through">
                {product.price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-900">
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export interface ProductVariant {
  id: number;
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  salePrice?: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  stock?: number;
  variants?: ProductVariant[];
}


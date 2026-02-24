export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  imageUrl: string;
  categoryName: string;
}

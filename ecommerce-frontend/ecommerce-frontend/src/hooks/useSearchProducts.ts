import { useState } from "react";
import { api } from "../api/axiosClient";

export function useSearchProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async (filters: any) => {
    setLoading(true);

    const res = await api.get("/products/search", { params: filters });

    setProducts(res.data.content || res.data);
    setLoading(false);
  };

  return { products, loading, searchProducts };
}

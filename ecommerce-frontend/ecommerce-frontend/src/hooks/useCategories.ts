import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  return categories;
}

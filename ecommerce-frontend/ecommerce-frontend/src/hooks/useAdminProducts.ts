import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";

export function useAdminProducts() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [product, setProduct] = useState({
    id: null,
    name: "",
    slug: "",
    price: "",
    salePrice: "",
    description: "",
    categoryId: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  const loadData = async () => {
    try {
      const cats = await api.get("/categories");
      setCategories(cats.data);

      const prods = await api.get("/products/admin");
      setProducts(prods.data);
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await api.post("/admin/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  };

  const saveProduct = async () => {
    try {
      let imageUrl = product.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const body = { ...product, imageUrl };

      if (product.id) {
        await api.put(`/products/admin/${product.id}`, body);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await api.post("/products/admin", body);
        alert("Thêm sản phẩm thành công!");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi lưu sản phẩm");
    }
  };

const deleteProduct = async (id: number) => {
  if (!confirm("Bạn chắc chắn muốn xóa?")) return;

  await api.delete(`/products/admin/${id}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  alert("Xóa thành công!");
  loadData();
};


  const editProduct = (p: any) => {
    setProduct({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      description: p.description,
      categoryId: p.categoryId,
      imageUrl: p.imageUrl,
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setProduct({
      id: null,
      name: "",
      slug: "",
      price: "",
      salePrice: "",
      description: "",
      categoryId: "",
      imageUrl: "",
    });
    setImageFile(null);
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    categories,
    products,
    product,
    setProduct,
    imageFile,
    setImageFile,
    generateSlug,
    saveProduct,
    deleteProduct,
    editProduct,
    resetForm,
  };
}

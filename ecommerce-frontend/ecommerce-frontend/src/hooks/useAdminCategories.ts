import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";
import type { Category } from "../types/Category";
import type { NewCategory } from "../types/NewCategory";

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState<NewCategory>({
    name: "",
    description: "",
    active: true,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  const loadData = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const createCategory = async () => {
    if (editingId !== null) return updateCategory(); // nếu đang edit thì update luôn

    await api.post("/admin/categories", newCat, {
      headers: { Authorization: "Bearer " + token }
    });

    alert("Tạo danh mục thành công!");
    resetForm();
    loadData();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setNewCat({
      name: cat.name,
      description: cat.description ?? "",
      active: cat.active,
    });
  };

  const updateCategory = async () => {
    if (editingId === null) return;

    await api.put(`/admin/categories/${editingId}`, newCat, {
      headers: { Authorization: "Bearer " + token }
    });

    alert("Cập nhật thành công!");
    resetForm();
    loadData();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    await api.delete(`/admin/categories/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    alert("Xóa thành công!");
    loadData();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewCat({
      name: "",
      description: "",
      active: true,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    categories,
    newCat,
    setNewCat,
    createCategory,
    startEdit,
    deleteCategory,
    editingId,
  };
}

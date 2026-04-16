import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";

export function useAdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: 0,
    minimumOrderAmount: 0,
    usageLimit: 0,
    targetRole: "ALL",
    startAt: "",
    endAt: ""
  });

  const loadCoupons = async () => {
    try {
      const res = await api.get("/admin/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.log("Load coupons error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createCoupon = async () => {
    try {
      await api.post("/admin/coupons", form);
      alert("🎉 Đã tạo mã giảm giá!");
      loadCoupons();

      setForm({
        code: "",
        type: "PERCENT",
        value: 0,
        minimumOrderAmount: 0,
        usageLimit: 0,
        targetRole: "ALL",
        startAt: "",
        endAt: ""
      });
    } catch (err) {
      console.log(err);
      alert("❌ Lỗi tạo mã!");
    }
  };

  const deleteCoupon = async (id: number) => {
    if (!confirm("Xóa mã giảm giá này?")) return;

    try {
      await api.delete(`/admin/coupons/${id}`);
      alert("Đã xóa!");
      loadCoupons();
    } catch (err) {
      console.log(err);
      alert("Không thể xóa mã!");
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  return {
    coupons,
    loading,
    form,
    updateField,
    createCoupon,
    deleteCoupon,
  };
}

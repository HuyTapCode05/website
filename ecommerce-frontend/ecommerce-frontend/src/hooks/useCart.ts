import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";

export function useCart() {

  const userId = localStorage.getItem("userId");
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  const getCartParams = () => {
    if (userId) return {};
    return { sessionId };
  };

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const res = await api.get("/api/cart", {
        params: getCartParams(),
      });
      setCart(res.data);
    } catch (err) {
      console.log("Cart load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (itemId: number, type: "inc" | "dec") => {
    try {
      await api.put(
        "/api/cart/update",
        { cartItemId: itemId, action: type },
        { params: getCartParams() }
      );
      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.delete("/api/cart/remove", {
        params: {
          cartItemId: itemId,
          ...getCartParams(),
        },
      });
      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart?.items?.reduce(
    (sum: number, i: any) => sum + Number(i.price) * i.quantity,
    0
  );

  return {
    cart,
    loading,
    total,
    updateQty,
    removeItem,
  };
}

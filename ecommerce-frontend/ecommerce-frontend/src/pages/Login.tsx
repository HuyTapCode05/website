import { useState, useEffect } from "react";
import { api } from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      navigate(role === "ROLE_ADMIN" ? "/admin/products" : "/");
    }
  }, [navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.token;
      const userId = res.data.id;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", res.data.role);
      window.dispatchEvent(new Event("role-changed"));

      const profile = await api.get(`/api/profile?userId=${userId}`, {
        headers: { Authorization: "Bearer " + token },
      });

      localStorage.setItem("name", profile.data.name);
      localStorage.setItem("email", profile.data.email);
      localStorage.setItem("avatar", profile.data.avatarUrl || "");

      navigate(res.data.role === "ROLE_ADMIN" ? "/admin" : "/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Lỗi đăng nhập");
      } else {
        alert("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20V6H0V4h20V0h2v20.5z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative z-10 text-center animate-fade-in">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10">
            <span className="text-white font-bold text-3xl">FS</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Chào mừng
            <span className="block text-gradient italic mt-1">trở lại</span>
          </h2>
          <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
            Đăng nhập để khám phá bộ sưu tập thời trang mới nhất và nhận ưu đãi độc quyền
          </p>
          <div className="flex items-center justify-center gap-4 mt-10 text-xs text-gray-500">
            <span>🔒 Bảo mật</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>🚀 Nhanh chóng</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>✨ Dễ dàng</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#FAFAFA]">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">FS</span>
            </div>
            <h1 className="text-sm font-bold tracking-[0.2em] text-gray-400">FASHION STORE</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Đăng nhập</h1>
            <p className="text-gray-500 text-sm">Nhập thông tin để tiếp tục mua sắm</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none placeholder:text-gray-300"
                onChange={onChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none placeholder:text-gray-300"
                onChange={onChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all btn-press ${loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>

            {/* Register link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
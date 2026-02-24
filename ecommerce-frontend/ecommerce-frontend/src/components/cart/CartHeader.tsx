import { Link } from "react-router-dom";

export default function CartHeader({ name, email }: any) {
  return (
    <div className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <div>
        <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ color: '#C9A96E' }}>
          Giỏ hàng
        </p>
        <h1 className="text-2xl font-bold text-white">Giỏ hàng của bạn</h1>
        {name && (
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            {name} — {email}
          </p>
        )}
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
        style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
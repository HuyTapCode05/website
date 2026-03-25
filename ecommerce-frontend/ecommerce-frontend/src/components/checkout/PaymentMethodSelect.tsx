interface PaymentMethodSelectProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export default function PaymentMethodSelect({ paymentMethod, setPaymentMethod }: PaymentMethodSelectProps) {
  const methods = [
    { value: "COD", label: "Thanh toán khi nhận hàng", desc: "Trả tiền mặt khi nhận hàng", icon: "💵" },
    { value: "BANKING", label: "Chuyển khoản ngân hàng", desc: "Chuyển khoản hoặc quét mã QR", icon: "🏦" },
  ];

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3">Phương thức thanh toán</h3>
      <div className="space-y-2.5">
        {methods.map(m => {
          const active = paymentMethod === m.value;
          return (
            <div key={m.value} onClick={() => setPaymentMethod(m.value)}
              className="flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2"
              style={{
                background: active ? '#f8f6f3' : 'white',
                borderColor: active ? '#C9A96E' : '#f0f0f0',
              }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: `2px solid ${active ? '#C9A96E' : '#d1d5db'}`, background: active ? '#C9A96E' : 'transparent' }}>
                {active && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <span className="text-xl">{m.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${active ? 'text-gray-900' : 'text-gray-600'}`}>{m.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
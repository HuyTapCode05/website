interface PaymentMethodSelectProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export default function PaymentMethodSelect({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSelectProps) {
  const paymentMethods = [
    {
      value: "COD",
      label: "Thanh toán khi nhận hàng",
      description: "Trả tiền mặt khi nhận được hàng"
    },
    {
      value: "BANKING",
      label: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua tài khoản ngân hàng hoặc quét mã QR"
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <label className="font-semibold text-gray-700 text-lg">Phương thức thanh toán</label>
      </div>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.value}
            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === method.value
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => setPaymentMethod(method.value)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                paymentMethod === method.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400'
              }`}>
                {paymentMethod === method.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${
                    paymentMethod === method.value ? 'text-blue-600' : 'text-gray-800'
                  }`}>
                    {method.label}
                  </span>
                  {paymentMethod === method.value && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                      Đã chọn
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-3">
        Lựa chọn phương thức thanh toán phù hợp với bạn
      </p>
    </div>
  );
}
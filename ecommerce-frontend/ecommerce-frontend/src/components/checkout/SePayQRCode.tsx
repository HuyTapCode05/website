import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";

interface SePayQRCodeProps {
  qrCode: string;
  orderNo: string;
  paymentReference?: string; // Nội dung chuyển khoản (DH{orderId})
  amount: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export default function SePayQRCode({ qrCode, orderNo, paymentReference, amount, bankName, accountNumber, accountName }: SePayQRCodeProps) {
  const [qrSize, setQrSize] = useState(256);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setQrSize(192);
      } else if (window.innerWidth < 768) {
        setQrSize(224);
      } else {
        setQrSize(256);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 text-center">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 sm:border-4 border-blue-500 shadow-xl">
          {qrCode.startsWith("http") ? (
            // Nếu là URL từ SEPAY, hiển thị image trực tiếp
            <img 
              src={qrCode} 
              alt="QR Code thanh toán" 
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain"
            />
          ) : (
            // Nếu là data string, tạo QR code từ string
            <QRCodeSVG
              value={qrCode}
              size={qrSize}
              level="H"
              includeMargin={true}
            />
          )}
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
          <span className="text-gray-800 font-bold font-mono text-xs sm:text-sm">{orderNo}</span>
        </div>
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-gray-600 font-medium">Số tiền:</span>
          <span className="text-red-600 font-bold text-lg sm:text-xl">
            {amount.toLocaleString()}₫
          </span>
        </div>
        {paymentReference && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-blue-200 pt-2 mt-2 gap-1">
            <span className="text-gray-600 font-medium text-xs sm:text-sm">Nội dung CK:</span>
            <span className="text-red-600 font-bold font-mono text-sm sm:text-base md:text-lg break-all sm:break-normal">
              {paymentReference}
            </span>
          </div>
        )}
        {accountNumber && (
          <>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <p className="text-xs text-gray-500 mb-1.5 sm:mb-2">Thông tin tài khoản nhận thanh toán:</p>
              {bankName && (
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="text-gray-800 font-semibold text-right break-words">{bankName}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm mt-1 gap-1">
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="text-gray-800 font-mono font-bold break-all sm:break-normal">{accountNumber}</span>
              </div>
              {accountName && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm mt-1 gap-1">
                  <span className="text-gray-600">Chủ tài khoản:</span>
                  <span className="text-gray-800 font-semibold text-right break-words">{accountName}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
        <p className="text-xs text-yellow-800 text-center">
          💳 Quét QR bằng ứng dụng ngân hàng bất kỳ để thanh toán
        </p>
      </div>
    </div>
  );
}


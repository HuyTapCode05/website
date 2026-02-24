import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] ${type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
          }`}
      >
        {type === "success" ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: "success" | "error" }>
  >([]);

  useEffect(() => {
    const handleCartNotification = (e: CustomEvent) => {
      const { message, type } = e.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
    };

    window.addEventListener(
      "cartNotification",
      handleCartNotification as EventListener
    );

    return () => {
      window.removeEventListener(
        "cartNotification",
        handleCartNotification as EventListener
      );
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}


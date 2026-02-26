import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Toast } from "../components/ui/Toast";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  isClosing?: boolean;
}

interface ToastContextProps {
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(
  undefined
);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 3000
  ) => {
    const id = Date.now().toString();

    setToasts((prev) => [...prev, { id, message, type, isClosing: false }]);

    setTimeout(() => {
      // Mark as closing to trigger exit animation
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isClosing: true } : t))
      );

      // Remove after animation completes (600ms)
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 600);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isClosing: true } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 600);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes slideOutUp {
          from {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
        }

        .toast-enter {
          animation: slideInDown 0.6s ease-out forwards;
        }

        .toast-exit {
          animation: slideOutUp 0.6s ease-in forwards;
        }
      `}</style>

      <div className="fixed top-7 left-1/2 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={toast.isClosing ? "toast-exit" : "toast-enter"}
          >
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToast must be used within ToastProvider");
  return context;
};
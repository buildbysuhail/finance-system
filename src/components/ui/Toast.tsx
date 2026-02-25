interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: (id: string) => void;
}

export const Toast = ({
  id,
  message,
  type = "info",
  onClose,
}: ToastProps) => {
  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-600",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`text-white px-4 py-3 rounded-lg shadow-lg flex justify-between items-center gap-4 ${typeStyles[type]}`}
    >
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="font-bold">
        ✕
      </button>
    </div>
  );
};
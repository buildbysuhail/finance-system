import {  useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black w-full text-center">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black hover:cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
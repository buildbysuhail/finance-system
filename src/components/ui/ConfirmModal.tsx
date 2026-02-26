import { Modal } from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean
}

export const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex items-center gap-3 text-red-600">
          <div className="text-2xl">⚠️</div>
          <p className="text-gray-700">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border text-black border-gray-300 hover:cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition hover:cursor-pointer"
            disabled={loading}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function CartStatusModal({ open, success, message, onClose }) {
  if (!open) return null;

  const isSuccess = success === true;
  const iconClass = isSuccess ? "text-green-500" : "text-red-500";
  const Icon = isSuccess ? FaCheckCircle : FaTimesCircle;
  const defaultMessage = isSuccess
    ? "Pohon berhasil masuk keranjang"
    : "Pohon gagal ditambahkan ke keranjang";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[320px] text-center">
        <div className="flex justify-center mb-4">
          <Icon className={`${iconClass} text-5xl`} />
        </div>
        <p className="text-gray-800 font-medium">
          {message || defaultMessage}
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 w-full"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

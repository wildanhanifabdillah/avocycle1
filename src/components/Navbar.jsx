import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow fixed top-0 left-0 right-0 z-40">
      {/* Kiri: tombol sidebar + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 text-xl hover:text-green-700 transition"
        >
          <FaBars />
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className="font-semibold text-gray-700 text-lg tracking-wide">
            AVOCYCLE
          </h1>
        </Link>
      </div>

      {/* Kanan: profil */}
      <div
        onClick={() => navigate("/profile")}
        className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-100 transition"
        title="Lihat Profil"
      >
        <span className="text-gray-500 text-sm">👤</span>
      </div>
    </header>
  );
}

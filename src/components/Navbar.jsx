import { useEffect, useRef, useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [role, setRole] = useState(null);

  const resolveRole = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        return user.role || user.Role || user.role_name || null;
      }

      const token = localStorage.getItem("token");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payloadPart = parts[1];
          const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
          const padded = normalized + "===".slice((normalized.length + 3) % 4);
          const json = atob(padded);
          const payload = JSON.parse(json);
          return payload.role || payload.Role || payload.user_role || null;
        }
      }
    } catch (err) {
      console.warn("Failed to resolve role in Navbar:", err);
    }
    return null;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setRole(resolveRole());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpenMenu(false);
    navigate("/login");
  };

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

      {/* Kanan: keranjang (pembeli) + profil */}
      <div className="flex items-center gap-3">
        {role === "Pembeli" && (
          <Link
            to="/keranjang"
            className="flex items-center justify-center text-gray-600 hover:text-green-700 transition"
            title="Keranjang"
          >
            <img src="/icons/cart.svg" alt="Keranjang" className="w-7 h-7" />
          </Link>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-100 transition"
            title="Menu Profil"
          >
            <FaUserCircle className="text-gray-600 text-xl" />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

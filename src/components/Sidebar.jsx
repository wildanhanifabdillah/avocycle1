import { FaLeaf, FaBug, FaClipboardList } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function Sidebar({ open }) {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [role, setRole] = useState(null); // "Petani" | "Pembeli" | null

  // sinkronkan active dengan URL sekarang
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  // helper decode JWT (base64url)
  const decodeJwtPayload = (token) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payloadPart = parts[1];
      // base64url -> base64
      const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      // tambahin padding kalau perlu
      const padded =
        normalized + "===".slice((normalized.length + 3) % 4);

      const json = atob(padded);
      return JSON.parse(json);
    } catch (err) {
      console.warn("Failed to decode JWT:", err);
      return null;
    }
  };

  // ambil role dari localStorage.user atau dari JWT token
  useEffect(() => {
    try {
      // 1️⃣ coba dari localStorage.user
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        const userRole = user.role || user.Role || user.role_name;

        if (userRole) {
          setRole(userRole);
          console.log("[Sidebar] Current role (from user):", userRole);
          return;
        }
      }

      // 2️⃣ kalau user belum ada / tidak ada role → coba dari JWT token
      const token = localStorage.getItem("token");
      if (token) {
        const payload = decodeJwtPayload(token);
        if (payload) {
          const tokenRole =
            payload.role || payload.Role || payload.user_role;

          if (tokenRole) {
            setRole(tokenRole);
            console.log("[Sidebar] Current role (from token):", tokenRole);

            // OPTIONAL: kalau mau, bisa simpan minimal user ke localStorage
            // biar konsisten dengan flow lain:
            // localStorage.setItem(
            //   "user",
            //   JSON.stringify({ role: tokenRole, email: payload.email })
            // );

            return;
          }
        }
      }

      console.warn("[Sidebar] Role tidak ditemukan di localStorage.");
    } catch (err) {
      console.error("Failed to resolve role in Sidebar:", err);
    }
  }, []);

  const menuGroups = useMemo(
    () => [
      {
        title: "Dashboard",
        items: [{ name: "Dashboard", icon: <FaLeaf />, path: "/dashboard" }],
      },
      {
        title: "Manajemen Tanaman",
        items: [{ name: "Manajemen Pohon", icon: <FaLeaf />, path: "/kebun" }],
      },
      {
        title: "Deteksi Penyakit",
        items: [
          { name: "Monitoring Penyakit", icon: <FaBug />, path: "/monitoring" },
          { name: "Laporan Penyakit", icon: <FaClipboardList />, path: "/report" },
        ],
      },
    ],
    []
  );

  // filter menu berdasarkan role
  const filteredMenuGroups = useMemo(() => {
    if (role === "Pembeli") {
      // hanya Manajemen Pohon
      const tanamanGroup = menuGroups.find(
        (g) => g.title === "Manajemen Tanaman"
      );
      if (!tanamanGroup) return [];

      return [
        {
          ...tanamanGroup,
          items: tanamanGroup.items.filter((item) => item.path === "/kebun"),
        },
      ];
    }

    // default (Petani / role lain / belum ketemu) → semua menu
    return menuGroups;
  }, [role, menuGroups]);

  return (
    <aside
      className={`bg-white shadow-md fixed top-14 left-0 h-[calc(100vh-56px)] transition-all duration-300 ${
        open ? "w-60" : "w-15"
      }`}
    >
      <div className="flex flex-col h-full py-4">
        {filteredMenuGroups.map((group) => (
          <div key={group.title} className="mb-4">
            {open && (
              <p className="px-4 text-xs text-gray-400 uppercase mb-2">
                {group.title}
              </p>
            )}
            {group.items.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActive(item.path)}
                className={`flex items-center gap-3 px-4 py-2 w-full text-gray-600 hover:bg-green-50 transition ${
                  active === item.path
                    ? "bg-green-100 text-green-700 font-medium"
                    : ""
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {open && <span className="text-sm">{item.name}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
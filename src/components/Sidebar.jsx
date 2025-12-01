import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaLeaf, FaBug, FaClipboardList, FaTree } from "react-icons/fa";

const normalizeRole = (val) => {
  if (!val) return null;
  const raw = val.toString().trim();

  // Handle numeric role ids (e.g., 1 = petani, 2 = pembeli)
  if (/^\d+$/.test(raw)) {
    if (raw === "1") return "petani";
    if (raw === "2") return "pembeli";
  }

  const str = raw.toLowerCase();
  return str.replace(/^role[_-\s]?/, "");
};

const extractRole = (user) => {
  if (!user) return null;

  const candidates = [
    user.role,
    user.Role,
    user.role_name,
    user.roleName,
    user.RoleName,
    user.role_type,
    user.roleType,
    user.RoleType,
    user.role_id,
    user.roleId,
    user.RoleId,
    user.role?.name,
    user.role?.RoleName,
    user.role?.role_name,
    user.role?.role_id,
    user.data?.role,
    user.data?.role_name,
    user.data?.role_id,
    user.profile?.role,
    user.profile?.role_name,
    user.profile?.role_id,
    Array.isArray(user.roles) ? user.roles[0] : null,
  ];

  for (const c of candidates) {
    const normalized = normalizeRole(c?.name ?? c);
    if (normalized) return normalized;
  }

  return null;
};

export default function Sidebar({ open }) {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    try {
      const u = JSON.parse(raw);
      const detected = extractRole(u);
      setRole(detected);
    } catch (e) {
      console.error("Failed to read role from localStorage.user", e);
      const fallback = normalizeRole(raw);
      if (fallback) setRole(fallback);
    }
  }, []);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const isPetani = role?.includes("petani");

  const isActive = (path) => {
    if (path === "/dashboard") return active === "/dashboard";
    return active === path || active.startsWith(`${path}/`);
  };

  // Menu dynamic based on role
  const menuGroups =
    isPetani
      ? [
          {
            title: "Dashboard",
            items: [
              { name: "Dashboard", icon: <FaLeaf />, path: "/dashboard" },
            ],
          },
          {
            title: "Manajemen Tanaman",
            items: [
              {
                name: "Manajemen Kebun",
                icon: <FaTree />,
                path: "/kebun",
              },
              // {
              //   name: "Manajemen Pohon",
              //   icon: <FaLeaf />,
              //   path: "/dashboard/plants",
              // },
            ],
          },
          {
            title: "Deteksi Penyakit",
            items: [
              {
                name: "Monitoring Penyakit",
                icon: <FaBug />,
                path: "/monitoring",
              },
              {
                name: "Laporan Penyakit",
                icon: <FaClipboardList />,
                path: "/report",
              },
            ],
          },
        ]
      : [
          {
            title: "",
            items: [
              {
                name: "Daftar Tanaman",
                icon: <FaLeaf />,
                path: "/plants",
              },
            ],
          },
        ];

  return (
    <aside
      className={`bg-white shadow-md fixed top-14 left-0 h-[calc(100vh-56px)] transition-all duration-300 ${
        open ? "w-60" : "w-15"
      }`}
    >
      <div className="flex flex-col h-full py-4">
        {menuGroups.map(
          (group, i) =>
            group && (
              <div key={i} className="mb-4">
                {open && group.title && (
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
                      isActive(item.path)
                        ? "bg-green-100 text-green-700 font-medium"
                        : ""
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {open && <span className="text-sm">{item.name}</span>}
                  </Link>
                ))}
              </div>
            )
        )}
      </div>
    </aside>
  );
}

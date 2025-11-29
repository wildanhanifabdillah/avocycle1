import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaLeaf, FaBug, FaClipboardList, FaTree } from "react-icons/fa";

export default function Sidebar({ open }) {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      setRole(u.role || u.Role || null);
    }
  }, []);

  // Menu dynamic based on role
  const menuGroups =
    role === "Petani"
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
                path: "/dashboard/kebun",
              },
              {
                name: "Manajemen Pohon",
                icon: <FaLeaf />,
                path: "/dashboard/plants",
              },
            ],
          },
          {
            title: "Deteksi Penyakit",
            items: [
              {
                name: "Monitoring Penyakit",
                icon: <FaBug />,
                path: "/dashboard/monitoring",
              },
              {
                name: "Laporan Penyakit",
                icon: <FaClipboardList />,
                path: "/dashboard/report",
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
                path: "/dashboard/plants",
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
            )
        )}
      </div>
    </aside>
  );
}

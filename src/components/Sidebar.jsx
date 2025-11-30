import { FaLeaf, FaBug, FaClipboardList } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ open }) {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const menuGroups = [
    {
      title: "Dashboard",
      items: [
        { name: "Dashboard", icon: <FaLeaf />, path: "/dashboard" },
      ],
    },
    
    {
      title: "Manajemen Tanaman",
      items: [
        { name: "Manajemen Pohon", icon: <FaLeaf />, path: "/kebun" },
      ],
    },
    {
      title: "Deteksi Penyakit",
      items: [
        { name: "Monitoring Penyakit", icon: <FaBug />, path: "/monitoring" },
        { name: "Laporan Penyakit", icon: <FaClipboardList />, path: "/report" },
      ],
    },
  ];

  return (
    <aside
      className={`bg-white shadow-md fixed top-[56px] left-0 h-[calc(100vh-56px)] transition-all duration-300 ${
        open ? "w-60" : "w-15"
      }`}
    >
      <div className="flex flex-col h-full py-4">
        {menuGroups.map((group) => (
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
                  active === item.path ? "bg-green-100 text-green-700 font-medium" : ""
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

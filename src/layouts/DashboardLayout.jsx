import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-linear-to-b from-[#e4ffe0] to-[#ffffff]">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Konten utama */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Konten halaman */}
        <main className="p-6 pt-20 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

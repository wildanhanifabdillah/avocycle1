import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    // <>
    //   {/* Toast notifications */}
    //   <Toaster
    //     position="top-right"
    //     toastOptions={{
    //       duration: Infinity,
    //       style: { fontSize: "14px" }
    //     }}
    //   />
    <div className="min-h-screen w-full flex">
      {/* Panel kiri: gradient hijau + konten form */}
      <div
        className="w-full lg:w-1/2 flex flex-col"
        style={{
          background: "linear-gradient(180deg, var(--bg-grad-from), var(--bg-grad-to))",
        }}
      >
        <div className="max-w-[720px] w-full mx-auto px-6 sm:px-10 py-6 sm:py-10">
          <Outlet />
        </div>
      </div>

      {/* Panel kanan: gambar */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/avocado-bg.png')" }}
        aria-hidden="true"
      />
    </div>
    // </>
  );
}

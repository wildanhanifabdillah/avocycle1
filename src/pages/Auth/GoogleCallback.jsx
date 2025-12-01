// src/pages/auth/GoogleCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // "loading" | "error"
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setStatus("error");
      setError("Login Google gagal: " + errorParam);
      return;
    }

    if (!token) {
      setStatus("error");
      setError("Token tidak ditemukan. Silakan coba login ulang.");
      return;
    }

    try {
      // 🔎 Decode JWT untuk cek role di console
      try {
        const [, payloadPart] = token.split(".");
        if (payloadPart) {
          // JWT pakai base64url, jadi perlu ganti -_ ke +/
          const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
          const decoded = atob(normalized);
          const payload = JSON.parse(decoded);

          const role =
            payload.role ||
            payload.Role ||
            payload.user_role ||
            "(role tidak ditemukan di token)";
          // console.log("✅ Google login success — current role:", role);
        } else {
          console.warn("JWT payload part not found");
        }
      } catch (e) {
        console.warn("Gagal decode JWT untuk baca role:", e);
      }

      // simpan token seperti biasa
      localStorage.setItem("token", token);

      // kalau mau, bisa fetch data user di sini

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Gagal menyimpan token. Coba lagi.");
    }
  }, [searchParams, navigate]);

  // ⬇️ Saat loading: blank saja
  if (status === "loading") {
    return null;
  }

  // status === "error"
  return (
    <div className="max-w-md mx-auto mt-10">
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 border rounded"
      >
        Kembali ke Login
      </button>
    </div>
  );
}
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
      localStorage.setItem("token", token);
      // kalau mau fetch user, bisa di sini
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Gagal menyimpan token. Coba lagi.");
    }
  }, [searchParams, navigate]);

  // ⬇️ Saat loading: jangan render apa-apa (blank)
  if (status === "loading") {
    return null;
    // atau return <></>;
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
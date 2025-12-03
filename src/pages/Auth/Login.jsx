// src/pages/auth/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Brand from "../../components/Brand.jsx";
import Field, { Label } from "../../components/Field.jsx";
import Divider from "../../components/Divider.jsx";
import { FcGoogle } from "react-icons/fc";
import Button from "../../components/Button.jsx";

import api from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const API_BASE =
  api.defaults?.baseURL || import.meta.env.VITE_API_BASE_URL || "http://localhost:2005";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const fd = new FormData(e.target);
      const email = fd.get("email");
      const password = fd.get("password");

      // Panggil API login pakai axios instance
      const res = await api.post(ENDPOINTS.LOGIN, { email, password });

      const data = res.data;
      console.log("Login response:", data);

      // Sesuaikan dengan struktur respons BE kamu
      const token = data?.data?.token || data?.token || data?.jwtToken;
      if (!token) {
        throw new Error("Token tidak ditemukan di response login");
      }

      localStorage.setItem("token", token);

      const userPayload = data?.data?.user || data?.user || null;
      if (userPayload) {
        localStorage.setItem("user", JSON.stringify(userPayload));
      }

      // Tentukan role untuk redirect
      const resolveRole = () => {
        const fromUser =
          userPayload?.role ||
          userPayload?.Role ||
          userPayload?.role_name ||
          data?.role;
        if (fromUser) return fromUser;

        try {
          const [, payloadPart] = token.split(".");
          if (payloadPart) {
            const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
            const padded = normalized + "===".slice((normalized.length + 3) % 4);
            const json = atob(padded);
            const payload = JSON.parse(json);
            return (
              payload.role ||
              payload.Role ||
              payload.user_role ||
              payload.userRole ||
              null
            );
          }
        } catch (err) {
          console.warn("Failed to decode token role:", err);
        }
        return null;
      };

      const role = resolveRole();
      const target = role === "Pembeli" ? "/tanaman" : "/dashboard";
      navigate(target);
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan saat login";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    /**
     * Flow:
     * 1) FE redirect ke BE: /api/v1/auth/google/pembeli (atau petani, bebas default)
     * 2) User login di Google
     * 3) BE callback:
     *    - user lama → redirect ke FRONTEND_GOOGLE_CALLBACK_URL?token=...
     *    - user baru → redirect ke FRONTEND_CHOOSE_ROLE_URL?tempToken=...&defaultRole=...
     *
     * Di FE:
     *  - /auth/google/callback  → GoogleCallback.jsx
     *  - /auth/google/choose-role → RoleSelectionGoogle.jsx
     */
    window.location.href = `${API_BASE}${ENDPOINTS.GOOGLE_PEMBELI}`;
    // kalau mau default-nya petani: pakai ENDPOINTS.GOOGLE_PETANI
  };

  return (
    <div>
      <Brand />

      <h1 className="text-[40px] leading-none sm:text-5xl font-extrabold mb-8">
        Sign in
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl">
        {/* Error message */}
        {errorMsg && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {errorMsg}
          </p>
        )}

        <div className="mb-5">
          <Label htmlFor="email">E-mail</Label>
          <Field
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
          />
        </div>

        <div className="mb-7">
          <Label htmlFor="password">Password</Label>
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
          />
        </div>

        {/* tombol sign in biasa */}
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <Divider label="OR" />

        {/* tombol sign in google */}
        <Button type="button" onClick={handleGoogleLogin}>
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </Button>

        <div className="mt-6 flex items-center justify-end text-sm">
          <Link to="/register-role" className="text-brand-700 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

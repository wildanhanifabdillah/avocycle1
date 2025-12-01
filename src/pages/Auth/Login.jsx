// src/pages/auth/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [googleRole, setGoogleRole] = useState("pembeli");

  const normalizeRole = (val) => {
    if (!val) return "";
    const raw = val.toString().toLowerCase();
    if (raw.includes("petani") || raw === "1") return "petani";
    if (raw.includes("pembeli") || raw === "2") return "pembeli";
    return raw;
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const role =
        normalizeRole(parsed?.role) ||
        normalizeRole(parsed?.Role) ||
        normalizeRole(parsed?.role_name) ||
        normalizeRole(parsed?.roleName) ||
        normalizeRole(parsed?.role_id) ||
        normalizeRole(parsed?.roleId) ||
        normalizeRole(parsed?.data?.role);
      if (role) setGoogleRole(role.includes("petani") ? "petani" : "pembeli");
    } catch (e) {
      console.warn("Failed to read stored user role", e);
    }
  }, []);

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

      let userPayload = data?.data?.user || data?.user || null;
      if (!userPayload && data?.data && typeof data.data === "object") {
        userPayload = data.data;
      }
      if (userPayload && data?.role && !userPayload.role && !userPayload.Role) {
        userPayload = { ...userPayload, role: data.role };
      }
      if (userPayload) localStorage.setItem("user", JSON.stringify(userPayload));

      navigate("/dashboard");
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
    const role = googleRole === "petani" ? "petani" : "pembeli";
    const endpoint =
      role === "petani" ? ENDPOINTS.GOOGLE_PETANI : ENDPOINTS.GOOGLE_PEMBELI;
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
    window.location.href = `${API_BASE}${endpoint}`;
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

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="#" className="text-brand-700 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register-role" className="text-brand-700 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

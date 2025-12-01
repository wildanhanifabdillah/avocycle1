import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Brand from "../../components/Brand";
import Button from "../../components/Button";
import api from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

export default function RoleSelectionGoogle() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tempToken, setTempToken] = useState("");
  const [defaultRole, setDefaultRole] = useState("");
  const [error, setError] = useState("");
  const [loadingRole, setLoadingRole] = useState(""); // "Petani" / "Pembeli"

  useEffect(() => {
    const token = searchParams.get("tempToken");
    const defRole = searchParams.get("defaultRole");

    if (!token) {
      setError("Token sementara tidak ditemukan. Silakan ulangi login Google.");
      return;
    }

    setTempToken(token);
    if (defRole === "Petani" || defRole === "Pembeli") {
      setDefaultRole(defRole);
    }
  }, [searchParams]);

  const handleChooseRole = async (role) => {
    if (!tempToken) return;
    setError("");
    setLoadingRole(role);

    try {
      const endpoint =
        role === "Petani"
          ? ENDPOINTS.GOOGLE_COMPLETE_PETANI // "/api/v1/auth/google/complete/petani"
          : ENDPOINTS.GOOGLE_COMPLETE_PEMBELI; // "/api/v1/auth/google/complete/pembeli"

      const res = await api.post(endpoint, { tempToken });
      const data = res.data;

      // Sesuaikan dengan response BE: { success, token, user }
      const token = data.token || data.jwtToken;
      if (!token) throw new Error("Token tidak ditemukan di response.");

      localStorage.setItem("token", token);
      if (data.user || data.data) {
        localStorage.setItem("user", JSON.stringify(data.user || data.data));
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Gagal menyelesaikan registrasi.");
    } finally {
      setLoadingRole("");
    }
  };

  if (error) {
    return (
      <div>
        <Brand />
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-sm mx-auto text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate("/login")}>Kembali ke Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!tempToken) {
    return (
      <div>
        <Brand />
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
          <p>Sedang memproses login Google...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Brand />

      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-sm mx-auto text-center">
          <h1 className="text-3xl font-extrabold mb-10">Pilih Role Anda:</h1>

          <div className="flex flex-col items-center gap-6">
            <Button
              className={`w-64 py-5 text-lg rounded-xl ${
                defaultRole === "Petani" ? "ring-2 ring-brand-500" : ""
              }`}
              disabled={loadingRole === "Petani"}
              onClick={() => handleChooseRole("Petani")}
            >
              {loadingRole === "Petani" ? "Memproses..." : "Petani"}
            </Button>

            <Button
              className={`w-64 py-5 text-lg rounded-xl ${
                defaultRole === "Pembeli" ? "ring-2 ring-brand-500" : ""
              }`}
              disabled={loadingRole === "Pembeli"}
              onClick={() => handleChooseRole("Pembeli")}
            >
              {loadingRole === "Pembeli" ? "Memproses..." : "Pembeli"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
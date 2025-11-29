import Brand from "../components/Brand";
import Button from "../components/Button";
import { ENDPOINTS } from "../api/endpoints";
import api from "../api/axiosInstance";

export default function RoleSelectionGoogle() {
  const API_BASE = api.defaults?.baseURL || "";

  const goToGoogle = (endpoint, role) => {
    // simpan role yang dipilih supaya callback bisa membaca
    sessionStorage.setItem("google_role", role);
    window.location.href = `${API_BASE}${endpoint}`;
  };

  return (
    <div>
      <Brand />

      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-sm mx-auto text-center">
          <h1 className="text-3xl font-extrabold mb-10">Pilih Role Anda:</h1>

          <div className="flex flex-col items-center gap-6">
            <Button
              className="w-64 py-5 text-lg rounded-xl"
              onClick={() => goToGoogle(ENDPOINTS.GOOGLE_PETANI, "Petani")}
            >
              Petani
            </Button>

            <Button
              className="w-64 py-5 text-lg rounded-xl"
              onClick={() => goToGoogle(ENDPOINTS.GOOGLE_PEMBELI, "Pembeli")}
            >
              Pembeli
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import AuthService from "../services/AuthService";

const extractError = (e) =>
  e?.response?.data?.error ||
  e?.response?.data?.message ||
  "Terjadi kesalahan, coba lagi.";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const user = AuthService.getUser();

  // ============================
  // LOGIN
  // ============================
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await AuthService.login(email, password);

      return {
        success: true,
        data: res,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e?.response?.data?.error ||
          e?.response?.data?.message ||
          "Login gagal, coba lagi",
      };
    } finally {
      setLoading(false);
    }
  };

// ============================
// REGISTER PETANI
// ============================
const registerPetani = async (payload) => {
  setLoading(true);

  try {
    const res = await AuthService.registerPetani(payload);

    return {
      success: res?.success ?? false,
      data: res,
      message: res?.message,
      error: res?.error,
    };
  } catch (e) {
    return {
      success: false,
      error: extractError(e),
    };
  } finally {
    setLoading(false);
  }
};

// ============================
// REGISTER PEMBELI
// ============================
const registerPembeli = async (payload) => {
  setLoading(true);

  try {
    const res = await AuthService.registerPembeli(payload);

    return {
      success: res?.success ?? false,
      data: res,
      message: res?.message,
      error: res?.error,
    };
  } catch (e) {
    return {
      success: false,
      error: extractError(e),
    };
  } finally {
    setLoading(false);
  }
};


  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    AuthService.logout();
  };

  return {
    user,
    loading,
    login,
    logout,
    registerPetani,
    registerPembeli,
    isLoggedIn: AuthService.isLoggedIn(),
  };
}

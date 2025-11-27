import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      AuthService.saveSession(token, JSON.parse(user));
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Sedang memproses login...</p>;
}

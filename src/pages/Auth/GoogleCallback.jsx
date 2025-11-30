import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name") || params.get("fullname");
    const email = params.get("email");
    const role =
      params.get("role") ||
      sessionStorage.getItem("google_role") ||
      null;

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ fullName: name, email, role })
      );
      sessionStorage.removeItem("google_role");
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p className="mt-10 text-center">Memproses login Google...</p>;
}

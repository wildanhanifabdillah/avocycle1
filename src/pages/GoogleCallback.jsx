import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ fullName: name, email }));

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, 
);

  return <p className="mt-10 text-center">Memproses login Google...</p>;
}

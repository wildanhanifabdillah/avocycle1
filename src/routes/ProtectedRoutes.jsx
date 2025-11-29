import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

export default function ProtectedRoute({ children }) {
  const token = AuthService.getToken();
  const user = AuthService.getUser();

  console.log("🔐 ProtectedRoute Check");
  console.log("Token:", token);
  console.log("User:", user);

  // tidak ada session ⇒ redirect ke login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

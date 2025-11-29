import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

export default function ProtectedRoute({ children }) {
  if (!AuthService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

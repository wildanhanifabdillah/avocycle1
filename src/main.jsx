import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GoogleCallback from "./pages/Auth/GoogleCallback";
import ProtectedRoute from "./routes/ProtectedRoutes";
import "./index.css";
import RegisterPembeli from "./pages/Auth/RegisterPembeli.jsx";
import App from "./App.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Plants from "./pages/Plants.jsx";
import Profile from "./pages/Profile.jsx";
import PlantDetail from "./pages/PlantDetail.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import Report from "./pages/Report.jsx";
import Kebun from "./pages/Kebun.jsx";
import RoleSelectionRegister from "./pages/Auth/RoleSelectionRegister.jsx";
import RoleSelectionGoogle from "./pages/Auth/RoleSelectionGoogle.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },

      { path: "register-role", element: <RoleSelectionRegister /> },
      { path: "login-google", element: <RoleSelectionGoogle /> },
      { path: "register", element: <Register /> },
      { path: "register-pembeli", element: <RegisterPembeli /> },

      { path: "auth/google/callback", element: <GoogleCallback /> },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "kebun", element: <Kebun /> },
      { path: "kebun/:kebunId/plants", element: <Plants /> },
      { path: "kebun/:kebunId/plants/:id", element: <PlantDetail /> },
      { path: "plants", element: <Plants /> },
      { path: "plants/:id", element: <PlantDetail /> },
      { path: "monitoring", element: <Monitoring /> },
      { path: "profile", element: <Profile /> },
      { path: "report", element: <Report /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);

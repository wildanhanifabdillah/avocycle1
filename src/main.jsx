import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GoogleCallback from "./pages/Auth/GoogleCallback";
import "./index.css";
import RegisterPembeli from "./pages/Auth/RegisterPembeli.jsx";
import App from "./App.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Plants from "./pages/Plants.jsx";
import PlantDetail from "./pages/PlantDetail.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import Report from "./pages/Report.jsx";
import Kebun from "./pages/Kebun.jsx";
import RoleSelectionRegister from "./pages/Auth/RoleSelectionRegister.jsx";
import ChooseRole from "./pages/Auth/RoleSelectionGoogle.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },

      { path: "register-role", element: <RoleSelectionRegister /> },
      { path: "register", element: <Register /> },
      { path: "register-pembeli", element: <RegisterPembeli /> },

      { path: "auth/google/callback", element: <GoogleCallback /> },
      { path: "auth/google/callback/petani", element: <GoogleCallback /> },
      { path: "auth/google/choose-role", element: <ChooseRole /> },
    ],
  },

  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "plants", element: <Plants /> },
      { path: "kebun", element: <Kebun /> },
      { path: "kebun/:kebunId/plants", element: <Plants /> },
      { path: "kebun/:kebunId/plants/:id", element: <PlantDetail /> },
      { path: "monitoring", element: <Monitoring /> },
      { path: "report", element: <Report /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

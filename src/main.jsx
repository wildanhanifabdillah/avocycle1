import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Plants from "./pages/plants/Plants.jsx";
import Profile from "./pages/profile/Profile.jsx";
import PlantDetail from "./pages/plants/PlantDetail.jsx";
import Monitoring from "./pages//monitoring/Monitoring.jsx";
import Report from "./pages/reports/Report.jsx";
import Kebun from "./pages/kebun/Kebun.jsx";
import ChooseRole from "./pages/auth/RoleSelectionGoogle.jsx";
import GoogleCallback from "./pages/auth/GoogleCallback.jsx";

const router = createBrowserRouter([
  // Layout login & register (2 panel)
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "auth/google/callback", element: <GoogleCallback /> },

    ],
  },

  // Layout dashboard Avocycle
  {
  element: <DashboardLayout />,
  children: [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/kebun", element: <Kebun /> },
    { path: "/kebun/:kebunId/plants", element: <Plants /> },
    { path: "/kebun/:kebunId/plants/:id", element: <PlantDetail /> },
    { path: "/monitoring", element: <Monitoring /> },
    { path: "/report", element: <Report /> },
    { path: "/profile", element: <Profile /> },
    { path: "/auth/google/choose-role", element: <ChooseRole />}
  ],
},
 
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

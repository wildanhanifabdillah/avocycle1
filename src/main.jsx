import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GoogleCallback from "./pages/GoogleCallback";
import ProtectedRoute from "./routes/ProtectedRoutes";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Plants from "./pages/Plants.jsx";
import Profile from "./pages/Profile.jsx";
import PlantDetail from "./pages/PlantDetail.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import Report from "./pages/Report.jsx";

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
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "plants", element: <Plants /> },
      { path: "plants/:id", element: <PlantDetail /> },
      { path: "monitoring", element: <Monitoring /> },
      { path: "profile", element: <Profile /> },
      { path: "report", element: <Report /> },
    ],
  },
]);

export default function Main() {
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

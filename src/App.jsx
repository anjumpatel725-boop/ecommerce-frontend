import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/orders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

// USER PROTECTION
function PrivateRoute({ children }) {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("userRole");

  return loggedIn && role !== "ROLE_ADMIN"
    ? children
    : <Navigate to="/login" />;
}

// ADMIN PROTECTION
function AdminRoute({ children }) {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("userRole");

  return loggedIn && role === "ROLE_ADMIN"
    ? children
    : <Navigate to="/admin-login" />;
}

export default function App() {
  return (
    <div style={{ padding: "40px", fontSize: "30px" }}>
      App is rendering ✅
    </div>
  );
}
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export function RequireAuth() {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function PublicOnly() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

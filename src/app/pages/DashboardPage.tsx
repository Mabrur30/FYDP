import { Navigate } from "react-router-dom";
import { getAuthRole } from "../utils/auth";
import { EngineerDashboardPage } from "./EngineerDashboardPage";
import { ClientDashboardPage } from "./ClientDashboardPage";

export function DashboardPage() {
  const role = getAuthRole();

  if (role === "client") {
    return <ClientDashboardPage />;
  }

  if (role === "engineer") {
    return <EngineerDashboardPage />;
  }

  return <Navigate to="/login" replace />;
}

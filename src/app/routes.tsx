import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { CostEstimatorPage } from "./pages/CostEstimtorPage";
import { EngineerDirectoryPage } from "./pages/EngineerDirectoryPage";
import { ProjectPostingPage } from "./pages/ProjextPostingPage";
import { EngineerDashboardPage } from "./pages/EngineerDashboardPage";
import { EngineerProfilePage } from "./pages/EngineerProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { NetworkPage } from "./pages/NetworkPage";
import { ChatPage } from "./pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/cost-estimator",
    element: <CostEstimatorPage />,
  },
  {
    path: "/engineers",
    element: <EngineerDirectoryPage />,
  },
  {
    path: "/post-project",
    element: <ProjectPostingPage />,
  },
  {
    path: "/dashboard",
    element: <EngineerDashboardPage />,
  },
  {
    path: "/engineer/:id",
    element: <EngineerProfilePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/network",
    element: <NetworkPage />,
  },
  {
    path: "/messages",
    element: <ChatPage />,
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#1E88E5] mb-4">404</h1>
          <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
          <a href="/" className="text-[#1E88E5] hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    ),
  },
]);

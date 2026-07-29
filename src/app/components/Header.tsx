import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  MessageCircle,
  LogOut,
  LayoutDashboard,
  FileText,
  Gavel,
  DollarSign,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  clearAuth,
  getAuthRole,
  getAuthToken,
  getAuthUser,
  isAuthenticated,
} from "../utils/auth";

type HeaderProject = {
  id?: string;
  _id?: string;
  client_id?: string;
  ownerId?: string;
  status?: string;
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const role = getAuthRole();
  const token = getAuthToken();
  const authUser = getAuthUser();
  const isEngineerDashboard =
    authenticated &&
    role === "engineer" &&
    location.pathname.startsWith("/dashboard");
  const dashboardBasePath = location.pathname.startsWith("/dashboard/engineer")
    ? "/dashboard/engineer"
    : "/dashboard";
  const activeDashboardSection =
    new URLSearchParams(location.search).get("section") || "overview";

  const isActive = (path: string) => location.pathname === path;

  const isDashboardSectionActive = (section: string) =>
    isEngineerDashboard && activeDashboardSection === section;

  const messageTargetId = (() => {
    const rawId = authUser?._id || authUser?.id;
    if (!rawId) return null;

    const numericId = Number(rawId);
    return Number.isFinite(numericId) ? numericId : null;
  })();

  const messagesLink = isEngineerDashboard
    ? messageTargetId
      ? `${dashboardBasePath}?section=messages&conversation=${messageTargetId}`
      : `${dashboardBasePath}?section=messages`
    : messageTargetId
      ? `/messages?conversation=${messageTargetId}`
      : "/messages";

  const [progressLink, setProgressLink] = useState("/projects");

  useEffect(() => {
    let isMounted = true;

    async function resolveProgressLink() {
      if (!authenticated || role !== "client") {
        if (isMounted) setProgressLink("/projects");
        return;
      }

      const currentUserId = String(authUser?._id || authUser?.id || "");
      if (!currentUserId) {
        if (isMounted) setProgressLink("/projects");
        return;
      }

      try {
        const response = await fetch("/api/projects", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const text = await response.text();
        const data = text ? (JSON.parse(text) as HeaderProject[]) : [];

        if (!response.ok || !Array.isArray(data)) {
          if (isMounted) setProgressLink("/projects");
          return;
        }

        const activeProjects = data.filter((project) => {
          const projectClientId = String(project.client_id || "");
          const projectOwnerId = String(project.ownerId || "");
          const status = String(project.status || "").toLowerCase();
          const belongsToCurrentUser =
            projectClientId === currentUserId ||
            projectOwnerId === currentUserId;
          const isActive = status !== "completed" && status !== "cancelled";
          return belongsToCurrentUser && isActive;
        });

        if (isMounted) {
          if (activeProjects.length === 1) {
            const projectId = String(
              activeProjects[0].id || activeProjects[0]._id || "",
            );
            setProgressLink(
              projectId ? `/projects/${projectId}/progress` : "/projects",
            );
          } else {
            setProgressLink("/projects");
          }
        }
      } catch {
        if (isMounted) setProgressLink("/projects");
      }
    }

    resolveProgressLink();

    return () => {
      isMounted = false;
    };
  }, [authUser?._id, authUser?.id, authenticated, role, token]);

  function handleLogout() {
    clearAuth();
    setIsMenuOpen(false);
    navigate("/");
  }

  const engineerSectionLinks = [
    { label: "Overview", value: "overview", icon: LayoutDashboard },
    { label: "Projects", value: "projects", icon: FileText },
    { label: "Bids", value: "bids", icon: Gavel },
    { label: "Earnings", value: "earnings", icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#1E88E5] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">CH</span>
            </div>
            <span className="text-2xl font-bold text-[#1A1A1A]">CivilHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {authenticated ? (
              isEngineerDashboard ? (
                <>
                  {engineerSectionLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.value}
                        to={`${dashboardBasePath}?section=${item.value}`}
                        className={`inline-flex items-center gap-2 text-base transition-colors ${
                          isDashboardSectionActive(item.value)
                            ? "text-[#1E88E5] font-semibold"
                            : "text-[#1A1A1A] hover:text-[#1E88E5]"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </>
              ) : (
                <>
                  <Link
                    to="/cost-estimator"
                    className={`text-base ${
                      isActive("/cost-estimator")
                        ? "text-[#1E88E5] font-semibold"
                        : "text-[#1A1A1A] hover:text-[#1E88E5]"
                    } transition-colors`}
                  >
                    Cost Estimator
                  </Link>
                  <Link
                    to="/engineers"
                    className={`text-base ${
                      isActive("/engineers")
                        ? "text-[#1E88E5] font-semibold"
                        : "text-[#1A1A1A] hover:text-[#1E88E5]"
                    } transition-colors`}
                  >
                    Find Engineers
                  </Link>
                  <Link
                    to="/post-project"
                    className={`text-base ${
                      isActive("/post-project")
                        ? "text-[#1E88E5] font-semibold"
                        : "text-[#1A1A1A] hover:text-[#1E88E5]"
                    } transition-colors`}
                  >
                    Post Project
                  </Link>
                  <Link
                    to="/network"
                    className={`text-base ${
                      isActive("/network")
                        ? "text-[#1E88E5] font-semibold"
                        : "text-[#1A1A1A] hover:text-[#1E88E5]"
                    } transition-colors`}
                  >
                    Network
                  </Link>
                  <Link
                    to="/projects"
                    className={`text-base ${
                      isActive("/projects") || isActive("/dashboard/client")
                        ? "text-[#1E88E5] font-semibold"
                        : "text-[#1A1A1A] hover:text-[#1E88E5]"
                    } transition-colors`}
                  >
                    My Projects
                  </Link>
                  <Link
                    to={progressLink}
                    className={`text-base ${
                      location.pathname.includes("/projects/") &&
                      location.pathname.endsWith("/progress")
                        ? "text-[#1E88E5] font-semibold"
                        : "text-[#1A1A1A] hover:text-[#1E88E5]"
                    } transition-colors`}
                  >
                    Progress
                  </Link>
                </>
              )
            ) : null}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {authenticated ? (
              <>
                {isEngineerDashboard ? (
                  <>
                    <Link
                      to={messagesLink}
                      className="relative rounded-full p-2 transition-colors hover:bg-gray-100"
                      aria-label="Messages"
                    >
                      <MessageCircle
                        size={24}
                        className={
                          isActive("/messages")
                            ? "text-[#1E88E5]"
                            : "text-[#1A1A1A]"
                        }
                      />
                      <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF8F00] text-xs text-white">
                        3
                      </span>
                    </Link>
                    <Link
                      to={`${dashboardBasePath}?section=profile`}
                      className={`rounded-full p-2 transition-colors hover:bg-gray-100 ${
                        isDashboardSectionActive("profile")
                          ? "text-[#1E88E5]"
                          : "text-[#1A1A1A]"
                      }`}
                      aria-label="Profile"
                    >
                      <User size={24} />
                    </Link>
                  </>
                ) : (
                  <Link
                    to={messagesLink}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MessageCircle
                      size={24}
                      className={
                        isActive("/messages")
                          ? "text-[#1E88E5]"
                          : "text-[#1A1A1A]"
                      }
                    />
                    <span className="absolute top-0 right-0 bg-[#FF8F00] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Link>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-[#1A1A1A] hover:text-[#1E88E5]"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#FF8F00] hover:bg-[#F57C00] text-white shadow-lg hover:shadow-xl transition-all">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {authenticated ? (
                isEngineerDashboard ? (
                  <>
                    {engineerSectionLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.value}
                          to={`${dashboardBasePath}?section=${item.value}`}
                          className={`inline-flex items-center gap-2 text-base ${
                            isDashboardSectionActive(item.value)
                              ? "text-[#1E88E5] font-semibold"
                              : "text-[#1A1A1A]"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                    <Link
                      to={messagesLink}
                      className={`inline-flex items-center gap-2 text-base ${
                        isActive("/messages")
                          ? "text-[#1E88E5] font-semibold"
                          : "text-[#1A1A1A]"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MessageCircle size={18} />
                      <span>Messages</span>
                    </Link>
                    <Link
                      to={`${dashboardBasePath}?section=profile`}
                      className={`inline-flex items-center gap-2 text-base ${
                        isDashboardSectionActive("profile")
                          ? "text-[#1E88E5] font-semibold"
                          : "text-[#1A1A1A]"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <button
                      type="button"
                      className="text-left text-base text-[#1A1A1A]"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/cost-estimator"
                      className={`text-base ${isActive("/cost-estimator") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cost Estimator
                    </Link>
                    <Link
                      to="/engineers"
                      className={`text-base ${isActive("/engineers") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Find Engineers
                    </Link>
                    <Link
                      to="/post-project"
                      className={`text-base ${isActive("/post-project") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Post Project
                    </Link>
                    <Link
                      to="/network"
                      className={`text-base ${isActive("/network") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Network
                    </Link>
                    <Link
                      to="/projects"
                      className={`text-base ${isActive("/projects") || isActive("/dashboard/client") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Projects
                    </Link>
                    <Link
                      to={progressLink}
                      className={`text-base ${location.pathname.includes("/projects/") && location.pathname.endsWith("/progress") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Progress
                    </Link>
                    <Link
                      to="/messages"
                      className={`text-base ${isActive("/messages") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                    <button
                      type="button"
                      className="text-left text-base text-[#1A1A1A]"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                )
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-base text-[#1A1A1A]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-base text-[#1A1A1A]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

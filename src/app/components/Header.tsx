import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { clearAuth, isAuthenticated } from "../utils/auth";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const isActive = (path: string) => location.pathname === path;

  function handleLogout() {
    clearAuth();
    setIsMenuOpen(false);
    navigate("/");
  }

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
              </>
            ) : null}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {authenticated ? (
              <>
                <Link
                  to="/messages"
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
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
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
                    to="/dashboard"
                    className={`text-base ${isActive("/dashboard") ? "text-[#1E88E5] font-semibold" : "text-[#1A1A1A]"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
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

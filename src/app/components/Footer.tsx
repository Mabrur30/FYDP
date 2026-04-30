import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#1E88E5] rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">CH</span>
              </div>
              <span className="text-2xl font-bold">CivilHub</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Bangladesh's premier marketplace connecting clients with verified
              civil engineers and construction professionals.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#1E88E5] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#1E88E5] transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#1E88E5] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#1E88E5] transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/engineers"
                  className="text-gray-400 hover:text-[#1E88E5] transition-colors text-sm"
                >
                  Find Engineers
                </Link>
              </li>
              <li>
                <Link
                  to="/cost-estimator"
                  className="text-gray-400 hover:text-[#1E88E5] transition-colors text-sm"
                >
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/post-project"
                  className="text-gray-400 hover:text-[#1E88E5] transition-colors text-sm"
                >
                  Post a Project
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-[#1E88E5] transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Structural Engineering</li>
              <li className="text-gray-400 text-sm">Foundation Design</li>
              <li className="text-gray-400 text-sm">RCC Design</li>
              <li className="text-gray-400 text-sm">Soil Testing</li>
              <li className="text-gray-400 text-sm">Project Management</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone size={16} className="flex-shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@civilhub.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 CivilHub. All rights reserved. | Privacy Policy | Terms of
            Service
          </p>
        </div>
      </div>
    </footer>
  );
}

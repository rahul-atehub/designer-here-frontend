"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "../Components/SearchBar";
import { ThemeToggle } from "../components/ui/theme.toggle";
import {
  User,
  Menu,
  X,
  Heart,
  Home,
  Settings,
  FileText,
  MessageSquare,
  Mail,
  Images,
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const pathname = usePathname();

  // Sidebar-style items for mobile menu (grouped)
  const dashboardLinks = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Images, label: "Portfolio", href: "/portfolio" },
    { icon: Heart, label: "Favorites", href: "/favorites" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
  ];

  const moreLinks = [
    { icon: FileText, label: "About Us", href: "/about" },
    { icon: Mail, label: "Contact Us", href: "/contact" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  // Desktop navbar links (unchanged)
  const links = [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About Us", href: "/aboutus" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#f9f9f9] dark:bg-[#101010] shadow-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 items-center gap-4 py-2">
          {/* Left Section: Logo + Mobile Toggle */}
          <div className="flex items-center justify-between lg:justify-start space-x-4">
            <div className="flex items-center space-x-4">
              <Image
                src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                alt="My Logo"
                width={40}
                height={40}
              />
              <span className="text-[#EF4444] font-semibold text-lg">
                DESIGNER HERE
              </span>
            </div>
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Center Section: Search */}
          <div className="w-full max-w-md mx-auto px-2">
            <SearchBar />
          </div>

          {/* Right Section: Nav Links + Icons */}
          <div className="hidden lg:flex items-center justify-end space-x-6">
            <div className="flex space-x-6">
              {links.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="lg:text-sm md:text-xs text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/favorites">
                <button className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444]">
                  <Heart className="w-5 h-5" />
                </button>
              </Link>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] rounded-full transition-colors duration-200">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col justify-between h-full pt-4 overflow-y-auto lg:hidden">
            {/* Top: Logo + Close */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Image
                  src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                  alt="My Logo"
                  width={40}
                  height={40}
                />
                <span className="text-gray-900 dark:text-white font-semibold text-lg">
                  DESIGNER HERE
                </span>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-4">
              <div className="space-y-6">
                {/* Dashboard Section */}
                <div>
                  <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Dashboard
                  </p>
                  <div className="space-y-2">
                    {dashboardLinks.map(({ icon: Icon, label, href }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={label}
                          href={href}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                            isActive
                              ? "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* More Section */}
                <div>
                  <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    More
                  </p>
                  <div className="space-y-2">
                    {moreLinks.map(({ icon: Icon, label, href }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={label}
                          href={href}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                            isActive
                              ? "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <ThemeToggle />
              </div>
            </div>

            {/* Bottom Section (unchanged) */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-gray-800 dark:hover:bg-neutral-800 border border-neutral-800 transition">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black dark:text-white truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                    john@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

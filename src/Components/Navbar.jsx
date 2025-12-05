"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/Components/SearchBar";
import { ThemeToggle } from "@/components/ui/theme.toggle";
import UserCard from "./UserCard";
import { useUser } from "@/context/UserContext";

import {
  User,
  Menu,
  X,
  Heart,
  Home,
  Settings,
  FileText,
  Save,
  MessageSquare,
  Mail,
  Images,
  ChevronDown,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user, loading, error, logout } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const pathname = usePathname();
  const isLoggedIn = !!user;

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup in case component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMobileMenuOpen]);

  // Sidebar-style items for mobile menu (grouped)
  const dashboardLinks = [
    { icon: Home, label: "Home", href: "/", badge: null },
    { icon: Images, label: "Portfolio", href: "/portfolio", badge: null },
    { icon: FileText, label: "About Us", href: "/about", badge: null },
    { icon: Mail, label: "Contact Us", href: "/contact", badge: null },
  ];

  const moreLinks = [
    { icon: Heart, label: "Liked", href: "/liked", badge: null },
    { icon: Save, label: "Saved", href: "/saved", badge: null },
    { icon: MessageSquare, label: "Messages", href: "/messages", badge: null },
    { icon: User, label: "Profile", href: "/profile", badge: null },
    { icon: Settings, label: "Settings", href: "/settings", badge: null },
  ];

  // Desktop navbar links (enhanced with active states)
  const links = [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-[#101010]/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-800/50"
            : "bg-[#f9f9f9] dark:bg-[#101010] shadow-lg border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 items-center gap-4 py-2">
            {/* Left Section: Logo + Mobile Toggle */}
            <div className="flex items-center justify-between lg:justify-start space-x-4">
              <div className="flex items-center space-x-4 group">
                <div className="relative">
                  <Image
                    src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                    alt="My Logo"
                    width={40}
                    height={40}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444]/20 to-[#F97316]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#EF4444] to-[#F97316] bg-clip-text text-transparent">
                  DESIGNER HERE
                </span>
              </div>

              <div className="lg:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl group"
                >
                  <div className="relative w-6 h-6">
                    <Menu
                      size={24}
                      className={`absolute inset-0 transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "rotate-180 opacity-0"
                          : "rotate-0 opacity-100"
                      }`}
                    />
                    <X
                      size={24}
                      className={`absolute inset-0 transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "rotate-0 opacity-100"
                          : "rotate-180 opacity-0"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Center Section: Search */}
            <div className="w-full max-w-md mx-auto px-2">
              <div className="relative group">
                <SearchBar />
              </div>
            </div>

            {/* Right Section: Nav Links + Icons */}
            <div className="hidden lg:flex items-center justify-end space-x-6">
              <div className="flex space-x-6">
                {links.map(({ label, href }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={label}
                      href={href}
                      className={`relative lg:text-sm md:text-xs transition-all duration-200 group ${
                        isActive
                          ? "text-[#EF4444] font-semibold"
                          : "text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444]"
                      }`}
                    >
                      {label}
                      <span
                        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#EF4444] to-[#F97316] transition-all duration-300 group-hover:w-full ${
                          isActive ? "w-full" : ""
                        }`}
                      ></span>
                    </Link>
                  );
                })}
              </div>

              {/* Enhanced Icons */}
              <div className="flex items-center space-x-3">
                {/* Enhanced Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#EF4444] to-[#F97316] rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {loading ? (
                        <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                          Checking session...
                        </div>
                      ) : isLoggedIn ? (
                        <>
                          {/* Logged-in Menu */}
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user?.username || "User"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user?.email || ""}
                            </p>
                          </div>
                          <Link
                            href="/profile"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <User size={16} />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Settings size={16} />
                            <span>Settings</span>
                          </Link>
                          <hr className="my-2 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={logout}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                          >
                            <LogOut size={16} />
                            <span>Log Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Logged-out Menu */}
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              Welcome Guest
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Please log in to continue
                            </p>
                          </div>
                          <Link
                            href="/auth/login"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-[#EF4444] dark:text-[#EF4444] hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <User size={16} />
                            <span>Login</span>
                          </Link>
                          <Link
                            href="/auth/signup"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-[#F97316] dark:text-[#F97316] hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <User size={16} />
                            <span>Sign Up</span>
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <div
        className={`mobile-menu-container fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        ></div>

        {/* Menu Panel */}
        <div
          className={`relative bg-white dark:bg-neutral-900 w-full h-full flex flex-col shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Enhanced Header */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-[#EF4444]/10 to-[#F97316]/10 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                  alt="My Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-[#EF4444] to-[#F97316] bg-clip-text text-transparent">
                DESIGNER HERE
              </span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="space-y-8">
              {/* Dashboard Section */}
              <div>
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Dashboard
                </p>
                <div className="space-y-2">
                  {dashboardLinks.map(({ icon: Icon, label, href, badge }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                          isActive
                            ? "text-white bg-gradient-to-r from-[#EF4444] to-[#F97316] shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                        </div>
                        {badge && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-[#EF4444] text-white"
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* More Section */}
              <div>
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  More
                </p>
                <div className="space-y-2">
                  {moreLinks.map(({ icon: Icon, label, href }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive
                            ? "text-white bg-gradient-to-r from-[#EF4444] to-[#F97316] shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Theme Toggle Section */}
              <div className="pt-4">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <UserCard />
          </div>
        </div>
      </div>

      {/* Click outside handler for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
}

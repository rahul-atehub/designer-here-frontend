"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/Components/SearchBar";
import NotificationPanel from "@/Components/NotificationPanel";
import { ThemeToggle } from "@/components/ui/theme.toggle";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";

import {
  User,
  Menu,
  X,
  Heart,
  Home,
  Settings,
  FileText,
  Bookmark,
  MessageSquare,
  Mail,
  Images,
  ChevronDown,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

export default function Navbar() {
  const { user, loading, error, logout, hasServerUser, gracePassed } =
    useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoggedIn = !!user;
  const [imgError, setImgError] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const [unreadCount, setUnreadCount] = useState(0);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Main navigation links
  const mainLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Posts", href: "/portfolio", icon: Images },
    { label: "About Us", href: "/about", icon: FileText },
    { label: "Contact Us", href: "/contact", icon: Mail },
  ];

  // Additional menu links (shown in dropdown and mobile)
  const additionalLinks = [
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "Liked", href: "/liked", icon: Heart },
    { label: "Saved", href: "/saved", icon: Bookmark },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const closeMenus = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-[#101010]/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-800/50"
            : "bg-[#f9f9f9] dark:bg-[#101010] shadow-lg border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image
                    src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                    alt="My Logo"
                    width={40}
                    height={40}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-[#EF4444]/20 to-[#F97316]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                </div>
                <span className="font-bold text-lg bg-linear-to-r from-[#EF4444] to-[#F97316] bg-clip-text text-transparent">
                  DESIGNER HERE
                </span>
              </div>
            </div>

            {/* Center Section: Navigation Links - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Main Navigation */}
              {mainLinks.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group flex items-center space-x-2 ${
                      isActive
                        ? "text-[#EF4444] bg-red-50/50 dark:bg-red-950/20"
                        : "text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] "
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    <span
                      className={`absolute -bottom-1 left-4 right-4 h-0.5 bg-linear-to-r from-[#EF4444] to-[#F97316] transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    ></span>
                  </Link>
                );
              })}

              {/* Separator */}
              <div className="w-px h-6 bg-gray-400 dark:bg-gray-600 mx-2"></div>

              {/* Additional Links */}
              {additionalLinks.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group flex items-center space-x-2 ${
                      isActive
                        ? "text-[#EF4444] bg-red-50/50 dark:bg-red-950/20"
                        : "text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] "
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    <span
                      className={`absolute -bottom-1 left-4 right-4 h-0.5 bg-linear-to-r from-[#EF4444] to-[#F97316] transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section: Icons and Profile */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] rounded-xl transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications - Hidden on Mobile */}
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="hidden sm:flex p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] rounded-xl transition-all duration-200 relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
                )}
              </button>

              {/* Theme Toggle - Hidden on Mobile */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Profile Dropdown - Always Visible */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] rounded-xl  transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-[#EF4444] to-[#F97316] rounded-full flex items-center justify-center overflow-hidden">
                    {isLoggedIn && user?.profileImage && !imgError ? (
                      <Image
                        src={user.profileImage}
                        alt={user?.name || user?.username || "User"}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`hidden sm:block transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {!hasServerUser && loading && !gracePassed ? (
                      <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        Checking session...
                      </div>
                    ) : isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user?.username || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email || ""}
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            await logout();
                            closeMenus();
                          }}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors duration-200"
                        >
                          <LogOut size={16} />
                          <span>Log Out</span>
                        </button>
                      </>
                    ) : (
                      <>
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
                          onClick={() => closeMenus()}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-[#EF4444] dark:text-[#EF4444] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <User size={16} />
                          <span>Login</span>
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => closeMenus()}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-[#F97316] dark:text-[#F97316] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <User size={16} />
                          <span>Sign Up</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Hamburger Menu - Mobile Only */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay - OUTSIDE THE NAV */}
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Desktop: Slide-out Panel */}
          <div className="hidden md:block fixed top-0 right-0 bottom-0 w-96 bg-white dark:bg-black shadow-2xl z-50 border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>

          {/* Mobile: Fullscreen */}
          <div className="md:hidden fixed inset-0 bg-white dark:bg-black z-50 animate-in fade-in duration-200">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </>
      )}

      {/* Notification Overlay */}
      {isNotificationOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => setIsNotificationOpen(false)}
          />

          {/* Desktop: Slide-out Panel */}
          <div className="hidden md:block fixed top-0 right-0 bottom-0 w-96 bg-white dark:bg-neutral-900 shadow-2xl z-50 border-l border-gray-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
            <NotificationPanel
              onClose={() => setIsNotificationOpen(false)}
              onMarkAsRead={() => setUnreadCount(0)}
            />
          </div>

          {/* Mobile: Fullscreen */}
          <div className="md:hidden fixed inset-0 bg-white dark:bg-neutral-900 z-50 animate-in fade-in duration-200">
            <NotificationPanel
              onClose={() => setIsNotificationOpen(false)}
              onMarkAsRead={() => setUnreadCount(0)}
            />
          </div>
        </>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        <div
          className={`relative bg-white dark:bg-neutral-900 w-full h-full flex flex-col shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <SearchBar />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shrink-0"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Main
                </p>
                <div className="space-y-2">
                  {mainLinks.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive
                            ? "text-[#EF4444] dark:text-[#EF4444]"
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

              <div>
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  More
                </p>
                <div className="space-y-2">
                  {additionalLinks.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive
                            ? "text-[#EF4444] dark:text-[#EF4444]"
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

              <div className="sm:hidden">
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Settings
                </p>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </span>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="relative inline-flex h-6 w-10 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-colors"
                  >
                    <span
                      className={`absolute h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform flex items-center justify-center ${
                        theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    >
                      {theme === "dark" ? (
                        <FiMoon className="w-4 h-4 text-neutral-950" />
                      ) : (
                        <FiSun className="w-4 h-4 text-orange-500" />
                      )}
                    </span>
                  </button>
                </div>

                {/* Notifications - Mobile Only */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsNotificationOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="font-medium">Notifications</span>
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="w-2 h-2 bg-[#EF4444] rounded-full"></span>
                    )}
                  </div>
                </button>
              </div>
            </div>
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

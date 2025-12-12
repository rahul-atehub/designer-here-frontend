import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronUp,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Bell,
  Shield,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";

const UserCard = () => {
  const { user, loading, logout, hasServerUser, gracePassed } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const dropdownRef = useRef(null);
  const cardRef = useRef(null);

  const isAuthenticated = !!user;
  const isGuest = !isAuthenticated;

  const toggleMenu = () => {
    setExpanded((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        cardRef.current &&
        !cardRef.current.contains(event.target)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setActionLoading("logout");
      await logout(); // from context
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setExpanded(false);
      setActionLoading(null);
      // optional redirect:
      // window.location.href = "/auth/login";
    }
  };

  const handleProfile = () => {
    setActionLoading("profile");
    setExpanded(false);
    window.location.href = "/profile";
  };

  const handleSettings = () => {
    setActionLoading("settings");
    setExpanded(false);
    window.location.href = "/settings";
  };

  const handleNotifications = () => {
    setActionLoading("notifications");
    setExpanded(false);
    window.location.href = "/notifications";
  };

  // Loading state
  if (!hasServerUser && loading && !gracePassed) {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
        </div>
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className="flex items-center space-x-3 p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200"
      >
        {/* Profile Image/Avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-linear-to-br from-[#EF4444] to-[#F97316] shadow-sm">
            {isAuthenticated && user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user?.name || user?.username || "User"}
                width={32}
                height={32}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>

          {isAuthenticated && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black dark:text-white truncate">
            {user?.name || user?.username || "Guest"}
          </p>
          {isAuthenticated && user?.email && (
            <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
              {user.email}
            </p>
          )}
        </div>

        {/* Action Button/Dropdown Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="User menu"
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-2 w-full min-w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50"
          >
            {isGuest ? (
              <div className="py-1">
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
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || user?.username}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  )}
                  {user?.role && user.role !== "user" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full mt-1">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={handleProfile}
                    disabled={actionLoading === "profile"}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "profile" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    Profile
                  </button>

                  <button
                    onClick={handleSettings}
                    disabled={actionLoading === "settings"}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "settings" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Settings className="w-4 h-4" />
                    )}
                    Settings
                  </button>

                  <button
                    onClick={handleNotifications}
                    disabled={actionLoading === "notifications"}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "notifications" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                    Notifications
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                  <button
                    onClick={handleLogout}
                    disabled={actionLoading === "logout"}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "logout" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    Logout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserCard;

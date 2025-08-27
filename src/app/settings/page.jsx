"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function Settings() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      // Verify token and get user role
      const response = await axios.get("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const role = response.data.role;
      setUserRole(role);

      // Navigate based on role
      if (role === "admin") {
        router.push("/admin/settings");
      } else if (role === "user") {
        router.push("/user/settings");
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      localStorage.removeItem("auth_token");
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Show authentication required if no valid role
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 p-8">
            {/* Logo/Icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white">🔒</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You need to sign in to access your settings and manage your
              account.
            </p>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-red-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // This shouldn't be reached as users are redirected, but just in case
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
    </div>
  );
}

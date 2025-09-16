// pages/profile/index.js or components/ProfileRouter.js
"use client";

import { motion } from "framer-motion";

import { useRouter } from "next/navigation"; // ✅ correct
import UserProfile from "./user/page"; // ✅ explicit page import
import AdminProfile from "./admin/page"; // ✅ explicit page import
import LayoutWrapper from "@/Components/LayoutWrapper";
import useUserRole from "@/hooks/useUserRole"; // adjust path if needed
import AuthRequired from "@/components/ui/AuthRequired";

export default function ProfileRouter() {
  const { userRole, loading, error } = useUserRole();
  const router = useRouter();

  // Loading state
  if (loading) {
    return (
      <LayoutWrapper>
        <div className="min-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-80px)] bg-white dark:bg-neutral-950 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400 font-medium"
            >
              Loading your profile...
            </motion.p>
          </motion.div>
        </div>
      </LayoutWrapper>
    );
  }

  // Error state
  if (error) {
    return <AuthRequired error={error} />;
  }

  // Route based on user role
  if (userRole === "admin") {
    return <AdminProfile />;
  } else if (userRole === "user") {
    return <UserProfile />;
  } else {
    // Fallback for unknown roles
    return (
      <LayoutWrapper>
        <div className="min-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-80px)] bg-white dark:bg-neutral-950 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-10 h-10 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Issue
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              We're having trouble determining your account permissions. Please
              contact support or try signing in again.
            </p>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/auth")}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Sign In Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/contact")}
                className="w-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </LayoutWrapper>
    );
  }
}

// src/app/login/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import { API } from "@/config";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  // Form data
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State management
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Validation state
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { refetchProfile } = useUser();
  const router = useRouter();

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  // Validation functions
  const validateLogin = (value) => {
    if (!value.trim()) {
      setLoginError("Please enter email or username");
      return false;
    }

    if (value.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setLoginError("Invalid email address");
        return false;
      }
    } else {
      if (value !== value.toLowerCase()) {
        setLoginError("Username must be lowercase");
        return false;
      }
    }

    setLoginError("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLoginChange = (e) => {
    const value = e.target.value;
    setLogin(value);
    if (value.trim()) {
      validateLogin(value);
    } else {
      setLoginError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.trim()) {
      validatePassword(value);
    } else {
      setPasswordError("");
    }
  };

  const isFormValid = () => {
    return login.trim() && password.trim() && !loginError && !passwordError;
  };

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLogin(login) || !validatePassword(password)) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        API.AUTH.LOGIN,
        {
          login,
          password,
          rememberMe,
        },
        { withCredentials: true },
      );

      showToast("Logged in successfully");
      await refetchProfile();
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-neutral-950 px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Log in to your account
            </p>
          </div>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key="login-form"
              onSubmit={handleLogin}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {/* Email/Username Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email or Username
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={login}
                  onChange={handleLoginChange}
                  placeholder="you@example.com or username"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                <AnimatePresence>
                  {loginError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {loginError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-red-500 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={!isFormValid() || loading}
                variants={buttonVariants}
                whileHover={isFormValid() && !loading ? "hover" : ""}
                whileTap={isFormValid() && !loading ? "tap" : ""}
                initial="hidden"
                animate="visible"
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>

              {/* Google Login */}
              <motion.button
                type="button"
                disabled={loading}
                variants={buttonVariants}
                whileHover={!loading ? "hover" : ""}
                whileTap={!loading ? "tap" : ""}
                initial="hidden"
                animate="visible"
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-neutral-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="1" />
                  <path d="M12 1v6m0 6v6" />
                </svg>
                Login with Google
              </motion.button>

              {/* Sign Up Link */}
              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-gray-600 dark:text-gray-400"
              >
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-semibold transition"
                >
                  Sign up
                </Link>
              </motion.p>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {toast &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-9999 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 whitespace-nowrap">
              <span className="text-sm font-medium">{toast}</span>
            </div>
          </div>,
          document.body,
        )}
    </LayoutWrapper>
  );
}

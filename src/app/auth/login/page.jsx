"use client";

import { useState } from "react";
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
  const [message, setMessage] = useState({ type: "", text: "" });

  // Validation state
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { refetchProfile, user } = useUser();

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

  const messageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  const successScreenVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const successItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
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
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        API.AUTH.LOGIN,
        {
          login,
          password,
        },
        { withCredentials: true }
      );

      setMessage({ type: "success", text: "Login successful!" });

      // Refresh user context after login
      await refetchProfile();

      // Optional: Redirect
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      setMessage({ type: "error", text: errorMsg });
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </motion.div>

          {/* Message Alert */}
          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                key={message.text}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`mb-6 p-3 rounded-lg text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

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

          {/* Success State */}
          <AnimatePresence mode="wait">
            {user && (
              <motion.div
                key="success-screen"
                variants={successScreenVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center space-y-6"
              >
                <motion.div
                  variants={successItemVariants}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full"
                >
                  <motion.svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>

                <motion.div variants={successItemVariants}>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welcome back!
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                </motion.div>

                <motion.p
                  variants={successItemVariants}
                  className="text-sm text-gray-500 dark:text-gray-500"
                >
                  Redirecting to your profile...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </LayoutWrapper>
  );
}

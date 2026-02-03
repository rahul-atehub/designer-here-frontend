"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "@/config";
import { Eye, EyeOff } from "lucide-react";

export default function LinkForm({ onSuccess }) {
  // Form data
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State management
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Validation state
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  // Validation functions
  const validateIdentifier = (value) => {
    if (!value.trim()) {
      setIdentifierError("Please enter email or username");
      return false;
    }

    if (value.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setIdentifierError("Invalid email address");
        return false;
      }
    } else {
      if (value !== value.toLowerCase()) {
        setIdentifierError("Username must be lowercase");
        return false;
      }
    }

    setIdentifierError("");
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

  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);
    if (value.trim()) {
      validateIdentifier(value);
    } else {
      setIdentifierError("");
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
    return (
      identifier.trim() && password.trim() && !identifierError && !passwordError
    );
  };

  // Handle link submit
  const handleLink = async (e) => {
    e.preventDefault();

    if (!validateIdentifier(identifier) || !validatePassword(password)) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        API.ACCOUNTS.LINK,
        {
          identifier,
          password,
        },
        { withCredentials: true },
      );

      setMessage({ type: "success", text: "Account linked successfully!" });

      // Call success callback after a short delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to link account";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Link Existing Account
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your existing account credentials
        </p>
      </div>

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

      {/* Link Form */}
      <AnimatePresence mode="wait">
        {message.type !== "success" && (
          <motion.form
            key="link-form"
            onSubmit={handleLink}
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
                value={identifier}
                onChange={handleIdentifierChange}
                placeholder="you@example.com or username"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
              <AnimatePresence>
                {identifierError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {identifierError}
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

            {/* Link Button */}
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
              {loading ? "Linking Account..." : "Link Account"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "@/config";
import { useUser } from "@/context/UserContext";

export default function SignupForm({ mode = "signup", onSuccess }) {
  // Form data
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { refetchProfile } = useUser();

  // State management
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  // Step 1: Send verification code to email
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(
        API.AUTH.SEND_VERIFICATION,
        { email },
        { withCredentials: true },
      );
      setMessage({
        type: "success",
        text: "Verification code sent to your email",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send code";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify the OTP
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setMessage({ type: "error", text: "Please enter the verification code" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(
        API.AUTH.VERIFY,
        { email, verificationCode },
        { withCredentials: true },
      );

      setMessage({ type: "success", text: "Email verified successfully" });
      setTimeout(() => {
        setStep(2);
        setMessage({ type: "", text: "" });
      }, 500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Invalid verification code";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Use different endpoint based on mode
      const endpoint =
        mode === "add-account" ? API.ACCOUNTS.ADD : API.AUTH.SIGNUP;

      await axios.post(
        endpoint,
        { email, name, username, password },
        { withCredentials: true },
      );

      if (mode === "add-account") {
        // For add account mode, call success callback
        setMessage({ type: "success", text: "Account added successfully!" });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        // For normal signup, refetch profile and show success
        await refetchProfile();
        setMessage({ type: "success", text: "Account created successfully!" });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed";
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
          {mode === "add-account" ? "Add Account" : "Create Account"}
        </h2>
        <motion.p
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {step === 1 ? "Step 1: Verify Email" : "Step 2: Complete Signup"}
        </motion.p>
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

      {/* Step 1: Email Verification */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1-email"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <form onSubmit={handleSendCode} className="space-y-4 mb-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
              </motion.div>
              <motion.button
                type="submit"
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="hidden"
                animate="visible"
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Code"}
              </motion.button>
            </form>

            {mode === "signup" && (
              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-gray-600 dark:text-gray-400"
              >
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-semibold transition"
                >
                  Log in
                </Link>
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: OTP Verification */}
      <AnimatePresence mode="wait">
        {step === 1 && message.type === "success" && (
          <motion.form
            key="step1-otp"
            onSubmit={handleVerifyCode}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter 6-Digit Code
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                maxLength="6"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="000000"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-center text-lg tracking-widest"
              />
            </motion.div>
            <motion.button
              type="submit"
              disabled={loading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial="hidden"
              animate="visible"
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Step 2: Complete Signup */}
      <AnimatePresence mode="wait">
        {step === 2 && (
          <motion.form
            key="step2-signup"
            onSubmit={handleSignup}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial="hidden"
              animate="visible"
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? mode === "add-account"
                  ? "Adding Account..."
                  : "Creating Account..."
                : mode === "add-account"
                  ? "Add Account"
                  : "Create Account"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Success State - Only for normal signup */}
      <AnimatePresence mode="wait">
        {step === 2 && message.type === "success" && mode === "signup" && (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.5,
              }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full"
            >
              <motion.svg
                variants={checkmarkVariants}
                initial="hidden"
                animate="visible"
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

            <p className="text-gray-600 dark:text-gray-400">
              Your account has been created successfully!
            </p>

            <Link
              href="/profile"
              className="inline-block py-2 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
            >
              Go to Profile
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

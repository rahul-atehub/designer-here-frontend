"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [toast, setToast] = useState(null);

  // State management
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  // Step 1: Send verification code to email
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        API.AUTH.SEND_VERIFICATION,
        { email },
        { withCredentials: true },
      );
      showToast("Verification code sent to your email");
      setMessage({
        type: "success",
        text: "Verification code sent to your email",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send code";
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify the OTP
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      showToast("Please enter the verification code");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        API.AUTH.VERIFY,
        { email, verificationCode },
        { withCredentials: true },
      );

      showToast("Email verified successfully");
      setTimeout(() => {
        setStep(2);
      }, 500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Invalid verification code";
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      showToast("Please fill in all fields");
      return;
    }

    setLoading(true);

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
        showToast("Account added successfully!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        // For normal signup, refetch profile and show success
        await refetchProfile();
        showToast("Account created successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed";
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {mode === "add-account" ? "Add Account" : "Create Account"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {mode === "add-account"
            ? "Link another account"
            : "Get started for free"}
        </p>
      </div>

      {/* Step 1: Email Verification */}
      <AnimatePresence mode="wait">
        {step === 1 && message.type !== "success" && (
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
    </div>
  );
}

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

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`,
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    // Listen for success message from popup
    const handleMessage = async (event) => {
      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        window.removeEventListener("message", handleMessage);
        await refetchProfile();
        router.push("/");
      }
    };

    window.addEventListener("message", handleMessage);
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

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-neutral-950 text-gray-500">
                    or
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="hidden"
                animate="visible"
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-neutral-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
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

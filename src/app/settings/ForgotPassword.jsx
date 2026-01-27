"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/config";

export default function ForgotPassword({ defaultTab = "recovery" }) {
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: OTP + password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    resetOTP: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    setStep(1);
    setForgotPasswordData({
      email: "",
      resetOTP: "",
      newPassword: "",
      confirmPassword: "",
    });
    setMessage(null);
  }, [defaultTab]);

  // ============================================
  // STEP 1: Send Reset OTP
  // ============================================
  const sendResetOTP = async () => {
    setMessage(null);

    // Validation
    if (!forgotPasswordData.email) {
      setMessage({
        success: false,
        text: "Please enter your email address",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordData.email)) {
      setMessage({
        success: false,
        text: "Invalid email format",
      });
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(API.AUTH.SEND_VERIFICATION, {
        email: forgotPasswordData.email,
        type: "forgot_password",
      });

      setMessage({
        success: true,
        text: "If this email exists, a password reset code has been sent",
      });

      // Move to step 2 after 1 second
      setTimeout(() => {
        setStep(2);
      }, 1000);
    } catch (error) {
      console.error("Error sending reset OTP:", error);
      setMessage({
        success: false,
        text: error.response?.data?.message || "Failed to send reset code",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // STEP 2: Reset Password with OTP
  // ============================================
  const resetPassword = async () => {
    setMessage(null);

    // Validation
    if (!forgotPasswordData.resetOTP) {
      setMessage({
        success: false,
        text: "Please enter the reset code from your email",
      });
      return;
    }

    if (!forgotPasswordData.newPassword) {
      setMessage({
        success: false,
        text: "Please enter a new password",
      });
      return;
    }

    if (!forgotPasswordData.confirmPassword) {
      setMessage({
        success: false,
        text: "Please confirm your new password",
      });
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setMessage({
        success: false,
        text: "Passwords do not match",
      });
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setMessage({
        success: false,
        text: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(API.AUTH.VERIFY, {
        email: forgotPasswordData.email,
        verificationCode: forgotPasswordData.resetOTP,
        newPassword: forgotPasswordData.newPassword,
        type: "forgot_password",
      });

      setMessage({
        success: true,
        text: "Password reset successfully! Please log in with your new password.",
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setForgotPasswordData({
          email: "",
          resetOTP: "",
          newPassword: "",
          confirmPassword: "",
        });
        setStep(1);
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage({
        success: false,
        text: error.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-light text-black dark:text-white mb-8">
          Forgot Password?
        </h2>

        {/* Forgot Password Card */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 text-xs font-medium border ${
                message.success
                  ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300"
                  : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-light text-black dark:text-white mb-6">
                  Step 1: Enter Your Email
                </h3>
              </div>
              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotPasswordData.email}
                  onChange={(e) =>
                    setForgotPasswordData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="your.email@example.com"
                  className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We'll send a password reset code to your email address.
              </p>
              <button
                onClick={sendResetOTP}
                disabled={isSaving}
                className="w-full mt-7 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
              >
                {isSaving ? "Sending..." : "Send Reset Code"}
              </button>
            </div>
          )}

          {/* STEP 2: Verify OTP and Reset Password */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-light text-black dark:text-white mb-2">
                  Step 2: Reset Your Password
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                  Enter the reset code from your email and your new password.
                </p>
              </div>
              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                  Reset Code
                </label>
                <input
                  type="text"
                  value={forgotPasswordData.resetOTP}
                  onChange={(e) =>
                    setForgotPasswordData((prev) => ({
                      ...prev,
                      resetOTP: e.target.value,
                    }))
                  }
                  placeholder="000000"
                  maxLength="6"
                  className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  value={forgotPasswordData.newPassword}
                  onChange={(e) =>
                    setForgotPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={forgotPasswordData.confirmPassword}
                  onChange={(e) =>
                    setForgotPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>
              <button
                onClick={resetPassword}
                disabled={isSaving}
                className="w-full mt-7 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
              >
                {isSaving ? "Resetting..." : "Reset Password"}
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setMessage(null);
                }}
                className="w-full px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                Back to Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Toast helper functions
  const showSuccess = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showError = (message) => {
    setToastMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 3000);
  };

  useEffect(() => {
    setStep(1);
    setForgotPasswordData({
      email: "",
      resetOTP: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [defaultTab]);

  // ============================================
  // STEP 1: Send Reset OTP
  // ============================================
  const sendResetOTP = async () => {
    // Validation
    if (!forgotPasswordData.email) {
      showError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordData.email)) {
      showError("Invalid email format");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(API.AUTH.SEND_VERIFICATION, {
        email: forgotPasswordData.email,
        type: "forgot_password",
      });

      showSuccess("Password reset code sent to your email");

      // Move to step 2 after 1 second
      setTimeout(() => {
        setStep(2);
      }, 1000);
    } catch (error) {
      console.error("Error sending reset OTP:", error);
      showError(error.response?.data?.message || "Failed to send reset code");
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // STEP 2: Reset Password with OTP
  // ============================================
  const resetPassword = async () => {
    // Validation
    if (!forgotPasswordData.resetOTP) {
      showError("Please enter the reset code from your email");
      return;
    }

    if (!forgotPasswordData.newPassword) {
      showError("Please enter a new password");
      return;
    }

    if (!forgotPasswordData.confirmPassword) {
      showError("Please confirm your new password");
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      showError("Password must be at least 6 characters");
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

      showSuccess("Password reset successfully");

      // Reset form after 2 seconds
      setTimeout(() => {
        setForgotPasswordData({
          email: "",
          resetOTP: "",
          newPassword: "",
          confirmPassword: "",
        });
        setStep(1);
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      showError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div>
          <h2 className="text-2xl font-light text-black dark:text-white mb-8">
            Forgot Password?
          </h2>

          {/* Forgot Password Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
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

      {/* Success Toast - Instagram Style */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Error Toast - Instagram Style */}
      {showErrorToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/config";
import { Mail, Lock, HelpCircle } from "lucide-react";
import ForgotPassword from "@/app/settings/ForgotPassword";

export default function PasswordAndSecurity({ defaultTab = "password" }) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(defaultTab);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Email change state
  const [emailChangeStep, setEmailChangeStep] = useState(1); // 1, 2, or 3
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailData, setEmailData] = useState({
    newEmail: "",
    currentPassword: "",
    oldEmailOTP: "",
    newEmailOTP: "",
  });

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

  // Fetch current email on component mount
  useEffect(() => {
    const fetchCurrentEmail = async () => {
      try {
        const response = await axios.get(API.PROFILE.ME, {
          withCredentials: true,
        });
        setCurrentEmail(response.data.email || "");
      } catch (error) {
        console.error("Error fetching current email:", error);
      }
    };
    fetchCurrentEmail();
  }, []);

  // ============================================
  // PASSWORD CHANGE LOGIC
  // ============================================
  const changePassword = async () => {
    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showError("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New password and confirmation do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      showError("New password must be different from current password");
      return;
    }

    try {
      setIsSaving(true);
      await axios.put(
        API.USER.CHANGE_PASSWORD,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          withCredentials: true,
        },
      );

      showSuccess("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      showError(error.response?.data?.error || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // EMAIL CHANGE LOGIC - STEP 1: Send OTP
  // ============================================
  const sendEmailVerificationOTP = async () => {
    // Validation
    if (!emailData.newEmail) {
      showError("Please enter a new email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      showError("Invalid email format");
      return;
    }

    if (emailData.newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      showError("New email must be different from current email");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(
        API.AUTH.SEND_VERIFICATION,
        {
          newEmail: emailData.newEmail,
          type: "email_change",
        },
        {
          withCredentials: true,
        },
      );

      showSuccess("Verification codes sent to both emails");

      // Move to step 2 after 1 second
      setTimeout(() => {
        setEmailChangeStep(2);
      }, 1000);
    } catch (error) {
      console.error("Error sending verification OTP:", error);
      showError(
        error.response?.data?.message || "Failed to send verification code",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // EMAIL CHANGE LOGIC - STEP 2: Verify Old Email
  // ============================================
  const verifyOldEmail = async () => {
    // Validation
    if (!emailData.oldEmailOTP) {
      showError("Please enter the verification code from your old email");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(
        API.AUTH.VERIFY,
        {
          email: emailData.newEmail,
          verificationCode: emailData.oldEmailOTP,
          type: "verify_old_email",
        },
        {
          withCredentials: true,
        },
      );

      showSuccess("Old email verified");

      // Move to step 3 after 1 second
      setTimeout(() => {
        setEmailChangeStep(3);
      }, 1000);
    } catch (error) {
      console.error("Error verifying old email:", error);
      showError(error.response?.data?.message || "Invalid verification code");
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // EMAIL CHANGE LOGIC - STEP 3: Verify New Email
  // ============================================
  const verifyNewEmail = async () => {
    // Validation
    if (!emailData.newEmailOTP) {
      showError("Please enter the verification code from your new email");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(
        API.AUTH.VERIFY,
        {
          email: emailData.newEmail,
          verificationCode: emailData.newEmailOTP,
          type: "verify_new_email",
        },
        {
          withCredentials: true,
        },
      );

      showSuccess("Email changed successfully");

      // Reset email change state
      setTimeout(() => {
        setCurrentEmail(emailData.newEmail);
        setEmailData({
          newEmail: "",
          currentPassword: "",
          oldEmailOTP: "",
          newEmailOTP: "",
        });
        setEmailChangeStep(1);
      }, 2000);
    } catch (error) {
      console.error("Error verifying new email:", error);
      showError(error.response?.data?.message || "Invalid verification code");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setActiveSection("password")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeSection === "password"
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </div>
          </button>
          <button
            onClick={() => setActiveSection("forgot-password")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeSection === "forgot-password"
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Forgot Password
            </div>
          </button>
          <button
            onClick={() => setActiveSection("email")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeSection === "email"
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Change Email
            </div>
          </button>
        </div>

        {/* PASSWORD CHANGE SECTION */}
        {activeSection === "password" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                Change Password
              </h2>

              {/* Password Change Card */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8">
                <h3 className="text-lg font-light text-black dark:text-white mb-6">
                  Update Your Password
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                      className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
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
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                      className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={changePassword}
                  disabled={isSaving}
                  className="w-full mt-7 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                >
                  {isSaving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD SECTION */}
        {activeSection === "forgot-password" && (
          <ForgotPassword defaultTab={activeSection} />
        )}

        {/* EMAIL CHANGE SECTION */}
        {activeSection === "email" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                Change Email
              </h2>

              {/* Email Change Card */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                {/* STEP 1: Enter new email */}
                {emailChangeStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-light text-black dark:text-white mb-6">
                        Step 1: Enter New Email
                      </h3>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                        Current Email Address
                      </label>
                      <div className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white rounded-lg px-4 py-3 flex items-center">
                        <span>{currentEmail || "Loading..."}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        value={emailData.newEmail}
                        onChange={(e) =>
                          setEmailData((prev) => ({
                            ...prev,
                            newEmail: e.target.value,
                          }))
                        }
                        placeholder="your.new.email@example.com"
                        className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                      />
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      We'll send verification codes to both your current and new
                      email addresses.
                    </p>
                    <button
                      onClick={sendEmailVerificationOTP}
                      disabled={isSaving}
                      className="w-full mt-7 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                    >
                      {isSaving ? "Sending..." : "Next"}
                    </button>
                  </div>
                )}

                {/* STEP 2: Verify old email */}
                {emailChangeStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-light text-black dark:text-white mb-2">
                        Step 2: Verify Your Current Email
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                        Enter the verification code sent to your current email
                        address.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={emailData.oldEmailOTP}
                        onChange={(e) =>
                          setEmailData((prev) => ({
                            ...prev,
                            oldEmailOTP: e.target.value,
                          }))
                        }
                        placeholder="000000"
                        maxLength="6"
                        className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                      />
                    </div>
                    <button
                      onClick={verifyOldEmail}
                      disabled={isSaving}
                      className="w-full mt-7 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                    >
                      {isSaving ? "Verifying..." : "Verify Current Email"}
                    </button>
                  </div>
                )}

                {/* STEP 3: Verify new email */}
                {emailChangeStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-light text-black dark:text-white mb-2">
                        Step 3: Verify Your New Email
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                        Enter the verification code sent to your new email
                        address.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={emailData.newEmailOTP}
                        onChange={(e) =>
                          setEmailData((prev) => ({
                            ...prev,
                            newEmailOTP: e.target.value,
                          }))
                        }
                        placeholder="000000"
                        maxLength="6"
                        className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                      />
                    </div>
                    <button
                      onClick={verifyNewEmail}
                      disabled={isSaving}
                      className="w-full mt-7 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                    >
                      {isSaving ? "Completing..." : "Complete Email Change"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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

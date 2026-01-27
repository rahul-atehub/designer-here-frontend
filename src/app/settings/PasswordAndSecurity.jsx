"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/config";
import { Mail, Lock, HelpCircle } from "lucide-react";
import ForgotPassword from "@/app/settings/ForgotPassword";

export default function PasswordAndSecurity({ defaultTab = "password" }) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(defaultTab); // "password", "email", or "forgot-password"

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

  // Success/Error messages
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);

  // Fetch current email on component mount
  useEffect(() => {
    const fetchCurrentEmail = async () => {
      try {
        const response = await axios.get(API.PROFILE.ME, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
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
    // Clear previous messages
    setPasswordMessage(null);

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordMessage({
        success: false,
        text: "All password fields are required",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        success: false,
        text: "New password and confirmation do not match",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        success: false,
        text: "New password must be at least 6 characters",
      });
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      setPasswordMessage({
        success: false,
        text: "New password must be different from current password",
      });
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      setPasswordMessage({
        success: true,
        text: "Password changed successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage({
        success: false,
        text: error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // EMAIL CHANGE LOGIC - STEP 1: Send OTP
  // ============================================
  const sendEmailVerificationOTP = async () => {
    // Clear previous messages
    setEmailMessage(null);

    // Validation
    if (!emailData.newEmail) {
      setEmailMessage({
        success: false,
        text: "Please enter a new email address",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      setEmailMessage({
        success: false,
        text: "Invalid email format",
      });
      return;
    }

    if (emailData.newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setEmailMessage({
        success: false,
        text: "New email must be different from current email",
      });
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      setEmailMessage({
        success: true,
        text: "Verification codes sent to both emails",
      });

      // Move to step 2 after 1 second
      setTimeout(() => {
        setEmailChangeStep(2);
      }, 1000);
    } catch (error) {
      console.error("Error sending verification OTP:", error);
      setEmailMessage({
        success: false,
        text:
          error.response?.data?.message || "Failed to send verification code",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // EMAIL CHANGE LOGIC - STEP 2: Verify Old Email
  // ============================================
  const verifyOldEmail = async () => {
    // Clear previous messages
    setEmailMessage(null);

    // Validation
    if (!emailData.oldEmailOTP) {
      setEmailMessage({
        success: false,
        text: "Please enter the verification code from your old email",
      });
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      setEmailMessage({
        success: true,
        text: "Old email verified! Please check your new email for the next code.",
      });

      // Move to step 3 after 1 second
      setTimeout(() => {
        setEmailChangeStep(3);
      }, 1000);
    } catch (error) {
      console.error("Error verifying old email:", error);
      setEmailMessage({
        success: false,
        text: error.response?.data?.message || "Invalid verification code",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // EMAIL CHANGE LOGIC - STEP 3: Verify New Email
  // ============================================
  const verifyNewEmail = async () => {
    // Clear previous messages
    setEmailMessage(null);

    // Validation
    if (!emailData.newEmailOTP) {
      setEmailMessage({
        success: false,
        text: "Please enter the verification code from your new email",
      });
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      setEmailMessage({
        success: true,
        text: "Email changed successfully!",
      });

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
        setEmailMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error verifying new email:", error);
      setEmailMessage({
        success: false,
        text: error.response?.data?.message || "Invalid verification code",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
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

              {/* Success/Error Message */}
              {passwordMessage && (
                <div
                  className={`p-4 rounded-lg mb-6 text-xs font-medium border ${
                    passwordMessage.success
                      ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300"
                      : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

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
              {/* Success/Error Message */}
              {emailMessage && (
                <div
                  className={`p-4 rounded-lg mb-6 text-xs font-medium border ${
                    emailMessage.success
                      ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300"
                      : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300"
                  }`}
                >
                  {emailMessage.text}
                </div>
              )}

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
  );
}

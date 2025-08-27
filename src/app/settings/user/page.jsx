"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Head from "next/head";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    profilePicture: null,
    profilePicturePreview: null,
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state
  const [deleteData, setDeleteData] = useState({
    password: "",
    confirmDelete: false,
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      setProfile({
        name: response.data.name || "",
        bio: response.data.bio || "",
        email: response.data.email || "",
        profilePicture: response.data.profilePicture || null,
        profilePicturePreview: response.data.profilePicture || null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("bio", profile.bio);
      formData.append("email", profile.email);

      if (profile.profilePicture instanceof File) {
        formData.append("profilePicture", profile.profilePicture);
      }

      await axios.put("/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setIsSaving(true);
      await axios.put(
        "/api/user/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      alert("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!deleteData.confirmDelete) {
      alert("Please confirm account deletion");
      return;
    }

    try {
      setIsSaving(true);
      await axios.delete("/api/user/delete-account", {
        data: { password: deleteData.password },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      localStorage.removeItem("auth_token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: "👤" },
    { id: "password", label: "Change Password", icon: "🔒" },
    { id: "delete", label: "Delete Account", icon: "🗑️" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Settings - DesignStudio</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-red-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Profile Settings
                      </h2>

                      {/* Profile Picture */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-purple-500 p-1">
                            <div className="w-full h-full rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                              {profile.profilePicturePreview ? (
                                <img
                                  src={profile.profilePicturePreview}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl text-gray-400">
                                  👤
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                          >
                            📷
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Profile Picture
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            JPG, PNG up to 5MB
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) =>
                              handleProfileChange("name", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              handleProfileChange("email", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) =>
                            handleProfileChange("bio", e.target.value)
                          }
                          rows="4"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <button
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="w-full bg-gradient-to-r from-red-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Saving..." : "Save Profile"}
                      </button>
                    </motion.div>
                  )}

                  {activeTab === "password" && (
                    <motion.div
                      key="password"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Change Password
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                oldPassword: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Enter current password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>

                      <button
                        onClick={changePassword}
                        disabled={isSaving}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Changing..." : "Change Password"}
                      </button>
                    </motion.div>
                  )}

                  {activeTab === "delete" && (
                    <motion.div
                      key="delete"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 bg-red-50 dark:bg-red-950/20">
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                          Delete Account
                        </h2>
                        <p className="text-red-700 dark:text-red-300 mb-6">
                          This action cannot be undone. All your data, designs,
                          and account information will be permanently deleted.
                        </p>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                              Enter your password to confirm
                            </label>
                            <input
                              type="password"
                              value={deleteData.password}
                              onChange={(e) =>
                                setDeleteData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-3 rounded-lg border border-red-300 dark:border-red-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                              placeholder="Enter your password"
                            />
                          </div>

                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={deleteData.confirmDelete}
                              onChange={(e) =>
                                setDeleteData((prev) => ({
                                  ...prev,
                                  confirmDelete: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300">
                              I understand that this action cannot be undone
                            </span>
                          </label>
                        </div>

                        <button
                          onClick={deleteAccount}
                          disabled={
                            isSaving ||
                            !deleteData.password ||
                            !deleteData.confirmDelete
                          }
                          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                          {isSaving ? "Deleting..." : "Delete My Account"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

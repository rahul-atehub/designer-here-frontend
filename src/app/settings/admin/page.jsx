"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API } from "@/config";
import Head from "next/head";

export default function AdminSettings() {
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

  // Admin-specific states
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, blocked

  useEffect(() => {
    fetchUserData();
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API.ADMIN.PROFILE, {
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
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API.ADMIN.USERS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setUsers(response.data.users || []);
      setBlockedUsers(response.data.blockedUsers || []);
    } catch (error) {
      console.error("Error fetching users:", error);
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

      await axios.put(API.ADMIN.PROFILE, formData, {
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
        API.ADMIN.CHANGE_PASSWORD,
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
      await axios.delete(API.ADMIN.DELETE_ACCOUNT, {
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

  const blockUser = async (userId) => {
    try {
      await axios.post(
        API.ADMIN.BLOCK_USER,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      fetchUsers();
      alert("User blocked successfully");
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user");
    }
  };

  const unblockUser = async (userId) => {
    try {
      await axios.post(
        API.ADMIN.UNBLOCK_USER,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      fetchUsers();
      alert("User unblocked successfully");
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isBlocked) ||
      (filterStatus === "blocked" && user.isBlocked);
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: "👤" },
    { id: "password", label: "Change Password", icon: "🔒" },
    { id: "users", label: "User Management", icon: "👥" },
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
        <title>Admin Settings - DesignStudio</title>
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
              Admin Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and user administration
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
                            Admin Profile Picture
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

                  {activeTab === "users" && (
                    <motion.div
                      key="users"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          User Management
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          />
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          >
                            <option value="all">All Users</option>
                            <option value="active">Active Users</option>
                            <option value="blocked">Blocked Users</option>
                          </select>
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
                          <h3 className="text-lg font-semibold">Total Users</h3>
                          <p className="text-2xl font-bold">{users.length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
                          <h3 className="text-lg font-semibold">
                            Active Users
                          </h3>
                          <p className="text-2xl font-bold">
                            {users.filter((u) => !u.isBlocked).length}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4 text-white">
                          <h3 className="text-lg font-semibold">
                            Blocked Users
                          </h3>
                          <p className="text-2xl font-bold">
                            {users.filter((u) => u.isBlocked).length}
                          </p>
                        </div>
                      </div>

                      {/* Users List */}
                      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
                        <div className="max-h-96 overflow-y-auto">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <motion.div
                                key={user._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-purple-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                                      {user.profilePicture ? (
                                        <img
                                          src={user.profilePicture}
                                          alt="Profile"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-sm text-gray-400">
                                          👤
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                      {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {user.email}
                                    </p>
                                    <span
                                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                                        user.isBlocked
                                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      }`}
                                    >
                                      {user.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  {user.isBlocked ? (
                                    <button
                                      onClick={() => unblockUser(user._id)}
                                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                    >
                                      Unblock
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => blockUser(user._id)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                    >
                                      Block
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 dark:text-gray-400">
                                No users found
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
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
                          Delete Admin Account
                        </h2>
                        <p className="text-red-700 dark:text-red-300 mb-6">
                          ⚠️ Warning: This action cannot be undone. All admin
                          privileges, data, and account information will be
                          permanently deleted. This may affect system
                          administration.
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
                              I understand that this action cannot be undone and
                              may affect system administration
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
                          {isSaving ? "Deleting..." : "Delete Admin Account"}
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

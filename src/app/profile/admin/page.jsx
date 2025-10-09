// pages/profile/admin.js
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/Components/LayoutWrapper";

import {
  Settings,
  Bookmark,
  Heart,
  Upload,
  User,
  Image,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get(API.ADMIN.PROFILE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      if (error.response?.status === 401) {
        setError("Please log in to view your profile");
      } else if (error.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
    // Navigate to settings page
    // router.push('/settings');
  };

  const handleSavedPosts = () => {
    router.push("/saved-posts");
  };

  const handleLikedPosts = () => {
    router.push("/liked-posts");
  };

  const handleAuthRedirect = () => {
    router.push("/auth");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({
        show: true,
        type: "error",
        message: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
      });
      setTimeout(
        () => setUploadStatus({ show: false, type: "", message: "" }),
        3000
      );
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        show: true,
        type: "error",
        message: "File size must be less than 5MB",
      });
      setTimeout(
        () => setUploadStatus({ show: false, type: "", message: "" }),
        3000
      );
      return;
    }

    try {
      setUploading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("artwork", file);
      formData.append("uploadedBy", user.id);

      // Upload artwork - replace with your actual API endpoint
      const response = await axios.post(API.PORTFOLIO.UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUploadStatus({
        show: true,
        type: "success",
        message:
          "Artwork uploaded successfully! It will appear on the gallery page.",
      });

      // Clear the file input
      event.target.value = "";

      // Auto-hide success message after 4 seconds
      setTimeout(
        () => setUploadStatus({ show: false, type: "", message: "" }),
        4000
      );
    } catch (error) {
      console.error("Error uploading artwork:", error);
      setUploadStatus({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to upload artwork. Please try again.",
      });
      setTimeout(
        () => setUploadStatus({ show: false, type: "", message: "" }),
        3000
      );
    } finally {
      setUploading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Error state - user not logged in or not admin
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <User className="w-10 h-10 text-red-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error.includes("Admin")
              ? "Admin Access Required"
              : "Welcome to Our Creative Space!"}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error.includes("Admin")
              ? "You need admin privileges to access this page. Please contact support if you believe this is an error."
              : "To access your admin dashboard and manage artworks, please sign in with your admin account."}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAuthRedirect}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-white dark:bg-neutral-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Upload Status Notification */}
          {uploadStatus.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg border ${
                uploadStatus.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {uploadStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <p
                  className={`text-sm ${
                    uploadStatus.type === "success"
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {uploadStatus.message}
                </p>
              </div>
            </motion.div>
          )}

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-neutral-800 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-red-500/20"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Admin Badge */}
                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Admin
                </div>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {user?.name || "Admin"}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 dark:text-gray-400 mb-4"
                >
                  {user?.email}
                </motion.p>
              </div>

              {/* Settings Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSettingsToggle}
                className="p-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full transition-colors duration-200"
              >
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>
          </motion.div>

          {/* Admin Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Upload Artwork - Admin Only */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="md:col-span-3"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleUploadClick}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-red-500 to-violet-600 hover:from-red-600 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl p-8 text-left hover:shadow-lg transition-all duration-200 group relative overflow-hidden"
              >
                {uploading && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {uploading
                        ? "Uploading Artwork..."
                        : "Upload New Artwork"}
                    </h3>
                    <p className="text-white/80 text-sm">
                      Share your latest creation with the community
                    </p>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </motion.button>
            </motion.div>

            {/* Saved Posts */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavedPosts}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-lg group-hover:bg-violet-200 dark:group-hover:bg-violet-900/30 transition-colors duration-200">
                  <Bookmark className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Saved Posts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your bookmarks
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Liked Posts */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLikedPosts}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/30 transition-colors duration-200">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Liked Posts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your favorites
                  </p>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

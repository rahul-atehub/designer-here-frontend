// pages/profile/admin.js
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/Components/LayoutWrapper";
import { useUser } from "@/context/UserContext";
import { API } from "@/config";
import CreatePost from "@/components/ui/createPost";

import {
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
  const [hasPosts, setHasPosts] = useState(false);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const {
    user: currentUser,
    loading: userLoading,
    error: userError,
  } = useUser();

  useEffect(() => {
    // wait for context to finish loading
    if (userLoading) return;

    if (userError) {
      setError(
        typeof userError === "string" ? userError : "Failed to load user"
      );
      setLoading(false);
      return;
    }

    // not authenticated
    if (!currentUser) {
      setError("Please log in to view your profile");
      setLoading(false);
      return;
    }

    // not admin
    if (currentUser.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    setUser(currentUser);
    setError(null);
    setLoading(false);
  }, [currentUser, userLoading, userError]);

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
    if (!currentUser?._id) {
      setUploadStatus({
        show: true,
        type: "error",
        message: "Unable to upload: missing user id.",
      });
      setTimeout(
        () => setUploadStatus({ show: false, type: "", message: "" }),
        3000
      );
      return;
    }
    setShowCreatePost(true); // Open the modal instead of file input
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
      formData.append("uploadedBy", user?.id ?? "");

      // Upload artwork - replace with your actual API endpoint
      const response = await axios.post(API.PORTFOLIO.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // use cookies for auth if your backend uses them
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
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
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
            className="bg-white dark:bg-neutral-950 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-10">
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
                    className="w-36 h-36 rounded-full object-cover border border-gray-300 dark:border-neutral-700"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border border-gray-300 dark:border-neutral-700 overflow-hidden">
                    <img
                      src="/avatar-placeholder.png"
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover scale-120"
                    />
                  </div>
                )}
              </motion.div>
              {/* User Info */}
              <div className="flex flex-col gap-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 dark:text-neutral-400"
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full py-1.5 rounded-lg border border-gray-300 dark:border-neutral-700 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  Edit profile
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Upload Posts Section (only shows up, if posts 've been already made) */}
          {hasPosts && (
            <div className=" flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
                disabled={uploading || userLoading || !currentUser?._id}
                aria-disabled={uploading || userLoading || !currentUser?._id}
                title={
                  uploading
                    ? "Uploading..."
                    : userLoading
                    ? "Loading user..."
                    : !user?.id
                    ? "User not ready"
                    : "Upload new post"
                }
                className="flex items-center justify-center w-20 h-20 rounded-full border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                {uploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  "+"
                )}
              </motion.button>

              <h2 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                Upload posts
              </h2>
            </div>
          )}

          {/* posts on home page */}
          <div className="mt-8 flex justify-center border-t border-gray-200 dark:border-neutral-800 pt-3">
            <Image className="w-5 h-5 text-gray-900 dark:text-white" />
          </div>

          {/* Empty State (no posts yet — UI only) */}
          {!hasPosts && (
            <div className="mt-12 flex flex-col items-center text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
                disabled={uploading || userLoading || !currentUser?._id}
                aria-disabled={uploading || userLoading || !currentUser?._id}
                className="w-20 h-20 rounded-full border border-gray-300 dark:border-neutral-700 flex items-center justify-center mb-4 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                {uploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-900 dark:text-white" />
                )}
              </motion.button>

              <h3 className="text-xl font-semibold text-blue-600">
                Upload posts
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400 max-w-xs">
                Upload your first post to get started.
              </p>
            </div>
          )}
        </div>
      </div>
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          userId={currentUser?._id}
        />
      )}
    </LayoutWrapper>
  );
}

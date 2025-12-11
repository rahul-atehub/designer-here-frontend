// app/profile/user/page.jsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/Components/LayoutWrapper";
import { Settings, Bookmark, Heart, User } from "lucide-react";
import axios from "axios";
import { API } from "@/config";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // ⬅️ Fetch full profile details
      const res = await axios.get(API.USER.PROFILE, {
        withCredentials: true, // because your auth is cookie-based
      });

      const payload = res?.data?.data ?? res?.data ?? null;

      // Normalize backend fields to match what the frontend expects

      const normalizedUser = {
        name: payload?.name ?? payload?.username ?? "User",
        email: payload?.email ?? "",
        profilePicture: payload?.profilePicture ?? payload?.profilePic ?? null,
        memberSince: payload?.memberSince ?? payload?.createdAt ?? null,
      };

      setUser(normalizedUser);
      setError(null);
    } catch (err) {
      console.error("Error fetching user profile:", err);

      setError("Failed to load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
    // Navigate to settings page or show settings modal
    // router.push('/settings');
  };

  const handleSavedPosts = () => {
    // Navigate to saved posts
    router.push("/saved-posts");
  };

  const handleLikedPosts = () => {
    // Navigate to liked posts
    router.push("/liked-posts");
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

  // Error state - profile fetch failed
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
            Couldn’t load your profile
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchUserProfile}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-white dark:bg-neutral-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
                  <div className="w-24 h-24 bg-linear-to-br from-red-500 to-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {user?.name || "User"}
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

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
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
                    View your bookmarked artworks
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
                    Your favorite artworks
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

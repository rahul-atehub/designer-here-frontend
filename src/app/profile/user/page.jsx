// app/profile/user/page.jsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/Components/LayoutWrapper";
import { Bookmark, Heart, User } from "lucide-react";
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

          {/* posts on home page */}
          <div className="mt-8 flex justify-center border-t border-gray-200 dark:border-neutral-800 pt-3"></div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Liked Posts */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLikedPosts}
              className="bg-white dark:bg-neutral-950 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 group"
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

            {/* Saved Posts */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavedPosts}
              className="bg-white dark:bg-neutral-950 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 group"
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
          </motion.div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

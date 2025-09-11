"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import axios from "axios";
import ArtworkCard from "@/components/ui/ArtworkCard";

import {
  Bookmark,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Calendar,
  Heart,
  FolderOpen,
} from "lucide-react";

const SavedPostsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [savedPosts, setSavedPosts] = useState([]);
  const [likedPostsSet, setLikedPostsSet] = useState(new Set());
  const [, forceUpdate] = useState({});

  // Load saved posts and liked posts from localStorage

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const { data } = await axios.get(`/api/users/demoUser123/saved`);
        setSavedPosts(data); // backend returns array of saved posts
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, []);

  // useEffect(() => {
  //   const loadSavedPosts = () => {
  //     if (typeof window !== "undefined") {
  //       try {
  //         const savedPostsData = JSON.parse(
  //           window.localStorage.getItem("savedPostsData") || "[]"
  //         );
  //         const likedPosts = JSON.parse(
  //           window.localStorage.getItem("likedPosts") || "[]"
  //         );
  //         setSavedPosts(savedPostsData);
  //         setLikedPostsSet(new Set(likedPosts));
  //       } catch (error) {
  //         console.error("Error loading saved posts:", error);
  //         setSavedPosts([]);
  //         setLikedPostsSet(new Set());
  //       }
  //     }
  //   };

  //   // Initial load
  //   loadSavedPosts();

  //   // Listen for storage changes (when posts are added/removed from other components)
  //   const handleStorageChange = () => {
  //     loadSavedPosts();
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   // Custom event listener for real-time updates within the same tab
  //   window.addEventListener("savedPostsUpdated", handleStorageChange);
  //   window.addEventListener("likedPostsUpdated", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //     window.removeEventListener("savedPostsUpdated", handleStorageChange);
  //     window.removeEventListener("likedPostsUpdated", handleStorageChange);
  //   };
  // }, []);

  // Get unique categories from saved posts
  const categories = [
    "all",
    ...new Set(savedPosts.map((post) => post.category)),
  ];

  const filteredPosts = savedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      filterCategory === "all" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case "likes":
        return b.likes - a.likes;
      case "views":
        return b.views - a.views;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // const handleRemoveSaved = (postId) => {
  //   // Remove from localStorage
  //   if (typeof window !== "undefined") {
  //     try {
  //       const savedPostsData = JSON.parse(
  //         window.localStorage.getItem("savedPostsData") || "[]"
  //       );
  //       const updatedData = savedPostsData.filter((post) => post.id !== postId);
  //       window.localStorage.setItem(
  //         "savedPostsData",
  //         JSON.stringify(updatedData)
  //       );

  //       // Update saved posts set
  //       const savedPosts = JSON.parse(
  //         window.localStorage.getItem("savedPosts") || "[]"
  //       );
  //       const updatedSavedPosts = savedPosts.filter((id) => id !== postId);
  //       window.localStorage.setItem(
  //         "savedPosts",
  //         JSON.stringify(updatedSavedPosts)
  //       );

  //       // Trigger custom event for real-time updates
  //       window.dispatchEvent(new CustomEvent("savedPostsUpdated"));

  //       setSavedPosts(updatedData);
  //     } catch (error) {
  //       console.error("Error removing saved post:", error);
  //     }
  //   }
  // };

  const handleRemoveSaved = async (postId) => {
    try {
      await axios.delete(`/api/users/demoUser123/save/${postId}`);
      setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error removing saved post:", error);
    }
  };

  // const handleLikeFromSaved = (postId) => {
  //   // Toggle like status in localStorage
  //   const postData = savedPosts.find((post) => post.id === postId);
  //   if (postData) {
  //     const currentLikedPosts = JSON.parse(
  //       window.localStorage.getItem("likedPosts") || "[]"
  //     );
  //     const isCurrentlyLiked = currentLikedPosts.includes(postId);

  //     let updatedLikedPosts;
  //     if (isCurrentlyLiked) {
  //       // Remove from liked
  //       updatedLikedPosts = currentLikedPosts.filter((id) => id !== postId);
  //       // Remove from liked posts data
  //       const likedPostsData = JSON.parse(
  //         window.localStorage.getItem("likedPostsData") || "[]"
  //       );
  //       const updatedLikedData = likedPostsData.filter(
  //         (post) => post.id !== postId
  //       );
  //       window.localStorage.setItem(
  //         "likedPostsData",
  //         JSON.stringify(updatedLikedData)
  //       );
  //     } else {
  //       // Add to liked
  //       updatedLikedPosts = [...currentLikedPosts, postId];
  //       // Add to liked posts data
  //       const likedPostsData = JSON.parse(
  //         window.localStorage.getItem("likedPostsData") || "[]"
  //       );
  //       likedPostsData.push(postData);
  //       window.localStorage.setItem(
  //         "likedPostsData",
  //         JSON.stringify(likedPostsData)
  //       );
  //     }

  //     window.localStorage.setItem(
  //       "likedPosts",
  //       JSON.stringify(updatedLikedPosts)
  //     );
  //     setLikedPostsSet(new Set(updatedLikedPosts));

  //     // Trigger custom events for real-time updates
  //     window.dispatchEvent(new CustomEvent("likedPostsUpdated"));
  //   }
  // };

  const handleLikeFromSaved = async (postId) => {
    try {
      const isLiked = likedPostsSet.has(postId);

      if (isLiked) {
        await axios.delete(`/api/users/demoUser123/likes/${postId}`);
        setLikedPostsSet((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await axios.post(`/api/users/demoUser123/likes`, { postId });
        setLikedPostsSet((prev) => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen dark:bg-gray-800 transition-colors duration-300">
        {/* Header Section */}
        <motion.div
          className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
                <Bookmark className="w-8 h-8 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Saved Posts
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Your personal collection of bookmarked designs
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {sortedPosts.length} posts bookmarked
            </div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="max-w-7xl mx-auto px-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search saved designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="recent">Recently Saved</option>
                <option value="title">Alphabetical</option>
                <option value="likes">Most Liked</option>
                <option value="views">Most Viewed</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-red-500 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-red-500 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Posts Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${filterCategory}-${sortBy}-${searchTerm}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`
              ${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            `}
            >
              {sortedPosts.map((post, index) => (
                <motion.div key={post.id} variants={itemVariants} layout>
                  <ArtworkCard
                    post={post}
                    isLiked={likedPostsSet.has(post.id)}
                    isSaved={true} // because we’re inside saved page
                    onToggleLike={handleLikeFromSaved}
                    onToggleSave={handleRemoveSaved}
                    viewMode={viewMode} // if your ArtworkCard supports grid/list switch
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {sortedPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center">
                <FolderOpen className="w-16 h-16 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No saved posts found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {searchTerm || filterCategory !== "all"
                  ? "Try adjusting your search or filters to find more saved designs."
                  : "Start exploring and bookmark some amazing designs to build your personal collection!"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Action for Mobile */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Search className="w-6 h-6" />
        </motion.button>
      </div>
    </LayoutWrapper>
  );
};

export default SavedPostsPage;

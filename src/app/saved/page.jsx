"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import axios from "axios";
import { API } from "@/config";
import ArtworkCard from "@/components/ui/ArtworkCard";
import AuthRequired from "@/components/ui/AuthRequired";
import { useUser } from "@/context/UserContext";

import { Bookmark, Search, Filter, Grid, List } from "lucide-react";

const SavedPostsPage = () => {
  const { user, loading, error } = useUser();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [savedPosts, setSavedPosts] = useState([]);
  const [likedPostsSet, setLikedPostsSet] = useState(new Set());

  // Load saved posts and liked posts from localStorage

  useEffect(() => {
    if (!user || error) return; // ⬅️ don't fetch if not authenticated

    const fetchSavedPosts = async () => {
      try {
        const endpoint = API.SAVED.LIST;
        const { data } = await axios.get(endpoint, {
          withCredentials: true, // ⬅️ important for cookie auth
        });
        setSavedPosts(data);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, [user, error]); // ⬅️ run when user is available

  // Auth check using UserContext
  if (loading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
        </div>
      </LayoutWrapper>
    );
  }

  if (error || !user) {
    return <AuthRequired />;
  }

  // Get unique categories from saved posts
  const categories = [
    "all",
    ...new Set(savedPosts.map((post) => post.category)),
  ];

  const filteredPosts = savedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
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
  const handleRemoveSaved = async (postId) => {
    try {
      const endpoint = API.SAVED.SAVE_POST; // "/api/saved"
      await axios.delete(endpoint, {
        data: { postId },
        withCredentials: true,
      });

      // remove from UI
      setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error removing saved post:", error);
    }
  };

  const handleLikeFromSaved = async (postId) => {
    try {
      const isLiked = likedPostsSet.has(postId);

      if (isLiked) {
        // REMOVE LIKE
        await axios.delete(API.LIKES.LIKE_POST, {
          data: { postId },
          withCredentials: true, // ⬅️ required
        });

        setLikedPostsSet((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        // ADD LIKE
        await axios.post(
          API.LIKES.ADD_LIKE,
          { postId },
          { withCredentials: true }, // ⬅️ required
        );

        setLikedPostsSet((prev) => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <LayoutWrapper>
      <style>{`
        .saved-posts-scroll {
          height: calc(100vh - 65px);
          display: flex;
          flex-direction: column;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .saved-posts-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="saved-posts-scroll bg-white dark:bg-neutral-950 overflow-y-auto">
        {/* Header Section */}
        <motion.div
          className="relative overflow-hidden bg-white dark:bg-gray-800 border-b border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative max-w-7xl mx-auto px-6 py-8 md:px-8">
            <div className="flex items-center gap-4">
              <Bookmark
                className="w-6 h-6 text-black dark:text-white"
                fill="currentColor"
              />
              <div>
                <h1 className="text-2xl font-light text-black dark:text-white">
                  Saved Posts
                </h1>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {sortedPosts.length} posts bookmarked
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="max-w-7xl mx-auto px-6 py-8 md:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col gap-4 items-start lg:flex-row lg:items-center justify-between mb-8">
            {/* Search */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search saved designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all text-black dark:text-white appearance-none cursor-pointer"
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
                className="flex-1 px-4 py-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all text-black dark:text-white appearance-none cursor-pointer"
              >
                <option value="recent">Recently Saved</option>
                <option value="title">Alphabetical</option>
                <option value="likes">Most Liked</option>
                <option value="views">Most Viewed</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
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
                    isSaved={true} // because we're inside saved page
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
              <div className="w-20 h-20 mx-auto mb-6 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                <Bookmark
                  className="w-10 h-10 text-zinc-400 dark:text-zinc-600"
                  fill="currentColor"
                />
              </div>
              <h3 className="text-lg font-light text-black dark:text-white mb-2">
                No saved posts found
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                {searchTerm || filterCategory !== "all"
                  ? "Try adjusting your search or filters to find more saved designs."
                  : "Start exploring and bookmark some amazing designs to build your personal collection!"}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </LayoutWrapper>
  );
};

export default SavedPostsPage;

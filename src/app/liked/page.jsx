"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Share2,
  Eye,
  Calendar,
} from "lucide-react";

const LikedPostsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Mock data - replace with actual API calls later
  const [likedPosts, setLikedPosts] = useState([
    {
      id: 1,
      title: "Minimalist Brand Identity Design",
      category: "Branding",
      author: "Alex Chen",
      authorAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
      likes: 234,
      views: 1200,
      dateAdded: "2024-03-15",
      tags: ["minimalist", "branding", "logo"],
    },
    {
      id: 2,
      title: "3D Typography Exploration",
      category: "Typography",
      author: "Maria Rodriguez",
      authorAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      likes: 189,
      views: 890,
      dateAdded: "2024-03-12",
      tags: ["3d", "typography", "experimental"],
    },
    {
      id: 3,
      title: "Neon Cyberpunk Poster Series",
      category: "Poster Design",
      author: "Jake Thompson",
      authorAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      likes: 456,
      views: 2100,
      dateAdded: "2024-03-10",
      tags: ["neon", "cyberpunk", "poster"],
    },
    {
      id: 4,
      title: "Organic Shape Illustrations",
      category: "Illustration",
      author: "Sophie Kim",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      likes: 312,
      views: 1450,
      dateAdded: "2024-03-08",
      tags: ["organic", "illustration", "abstract"],
    },
    {
      id: 5,
      title: "Modern Web Interface Design",
      category: "UI/UX",
      author: "David Park",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      likes: 278,
      views: 980,
      dateAdded: "2024-03-05",
      tags: ["ui", "ux", "web", "interface"],
    },
    {
      id: 6,
      title: "Retro Gaming Logo Collection",
      category: "Branding",
      author: "Emma Wilson",
      authorAvatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
      image:
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop",
      likes: 167,
      views: 720,
      dateAdded: "2024-03-02",
      tags: ["retro", "gaming", "logo", "collection"],
    },
  ]);

  const categories = [
    "all",
    "Branding",
    "Typography",
    "Poster Design",
    "Illustration",
    "UI/UX",
  ];

  const filteredPosts = likedPosts.filter((post) => {
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

  const handleRemoveLike = (postId) => {
    setLikedPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <motion.div
        className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-400/5 dark:via-pink-400/5 dark:to-orange-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Liked Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your curated collection of inspiring designs
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {sortedPosts.length} posts saved
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
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
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
                className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer"
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
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-600 text-purple-500 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-600 text-purple-500 shadow-sm"
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
              <motion.div
                key={post.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -5 }}
                className={`
                  group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700
                  ${viewMode === "list" ? "flex items-center p-4" : ""}
                `}
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Overlay Actions */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLike(post.id);
                          }}
                          className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          <Heart className="w-4 h-4" fill="white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-black/50 text-white rounded-full shadow-lg hover:bg-black/70 transition-colors duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-black/50 text-white rounded-full shadow-lg hover:bg-black/70 transition-colors duration-200"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white text-xs font-medium rounded-full backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                        {post.title}
                      </h3>

                      {/* Author */}
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {post.author}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(post.dateAdded).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <>
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex-1 min-w-0 ml-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 truncate">
                            {post.title}
                          </h3>

                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={post.authorAvatar}
                              alt={post.author}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {post.author}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                              {post.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(post.dateAdded).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLike(post.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors duration-200"
                          >
                            <Heart className="w-4 h-4" fill="white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
              <Heart className="w-16 h-16 text-purple-400 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filters to find more designs."
                : "Start exploring and like some amazing designs to build your collection!"}
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
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Search className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default LikedPostsPage;

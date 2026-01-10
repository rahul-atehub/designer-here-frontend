"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LayoutWrapper from "@/Components/LayoutWrapper";
import Footer from "@/Components/Footer";
import ArtworkCard from "@/components/ui/ArtworkCard";
import { API } from "@/config";
import axios from "axios";
const api = axios.create({
  baseURL: API.BASE_URL,
  withCredentials: true,
});

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Heart,
  Grid,
  List,
  Search,
  X,
  Eye,
  Zap,
  Pen,
  Loader2,
} from "lucide-react";

const GraphicDesignPortfolio = () => {
  // const [filterBy, setFilterBy] = useState("all");
  // const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin mode detection
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // api.defaults.baseURL should include /api, so this hits: <BASE_URL>/api/auth/me
        const res = await api.get(API.PROFILE.ME);
        const role = res?.data?.role;
        setIsAdminMode(role === "admin");
      } catch (err) {
        // not logged in, token expired, CORS issue, or server error → treat as non-admin
        setIsAdminMode(false);
        // optional: log small amount of info for dev only
        if (process.env.NODE_ENV === "development") {
          console.debug("checkAdmin failed:", err?.message || err);
        }
      }
    };

    checkAdmin();
  }, []);

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);

  // Fetch artworks from backend
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await api.get(API.PORTFOLIO.LIST);
        setArtworks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Simple filteredArtworks that only respects the search query (no categories, no sorting)
  const filteredArtworks = useMemo(() => {
    const items = Array.isArray(artworks) ? artworks : [];

    if (!searchQuery || !searchQuery.trim()) return items;

    const q = searchQuery.toLowerCase().trim();
    return items.filter((artwork) => {
      return (
        (artwork?.title || "").toLowerCase().includes(q) ||
        (artwork?.description || "").toLowerCase().includes(q) ||
        (artwork?.author || "").toLowerCase().includes(q) ||
        (artwork?.client || "").toLowerCase().includes(q) ||
        (Array.isArray(artwork?.tags) &&
          artwork.tags.some((tag) => (tag || "").toLowerCase().includes(q)))
      );
    });
  }, [artworks, searchQuery]);

  const totalStats = {
    totalProjects: 500,
    totalHappyClients: 150,
    totalYears: 5,
  };

  // Early access email subscription component
  const EarlyAccessMessage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) return;

      setIsSubmitting(true);
      try {
        // Send to your message functionality instead of early-access endpoint
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            message: `Early access request: ${email}`,
            type: "early_access",
          }),
        });

        if (response.ok) {
          setIsSubmitted(true);
          setEmail("");
        }
      } catch (error) {
        console.error("Error submitting email:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-24"
      >
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-linear-to-br from-red-100 to-red-200 dark:from-red-950/50 dark:to-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Pen size={48} className="text-red-500" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-1/2 translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"
          />
        </div>

        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Want Early Access?
        </h3>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
          We're curating incredible artworks for you. Drop your email and be the
          first to see our collection when it goes live.
        </p>

        {!isSubmitted ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-gray-50/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-0 focus:border-red-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 text-lg backdrop-blur-sm outline-none"
              required
            />
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Notify Me"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-8 bg-linear-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-3xl border border-green-200/50 dark:border-green-800/50"
          >
            <div className="text-green-600 dark:text-green-400 text-2xl font-bold mb-2">
              ✓ You're on the list!
            </div>
            <p className="text-green-700 dark:text-green-300 text-lg">
              We'll notify you as soon as our gallery goes live.
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-neutral-800/50 shadow-xl shadow-black/5 overflow-hidden p-6"
        >
          <div className="text-center text-gray-500 dark:text-neutral-400 py-12">
            <div className="w-16 h-16 bg-linear-to-br from-red-100 to-red-200 dark:from-red-950/50 dark:to-red-900/50 rounded-2xl mb-4 mx-auto animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3 animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse" />
            <div className="flex items-center justify-center gap-4">
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
        {/* Floating Animated Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-2 h-2 bg-red-500/20 rounded-full"
          />
          <motion.div
            animate={{
              x: [0, -120, 0],
              y: [0, 80, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-40 right-20 w-3 h-3 bg-red-400/10 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-40 left-1/4 w-4 h-4 bg-red-300/20 rounded-full"
          />
        </div>

        {/* Hero Section */}
        <motion.section
          style={{ y: parallaxY }}
          className="relative py-20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-red-50/50 via-transparent to-red-100/30 dark:from-red-950/20 dark:via-transparent dark:to-red-900/10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold">
                <Zap size={16} />
                Creative Visual Solutions
              </div>

              <h2 className="text-6xl md:text-8xl font-black leading-tight">
                <span className="bg-linear-to-r from-[#EF4444] to-blue-500 bg-clip-text text-transparent">
                  Designer
                </span>
                <br />
                <span className=" text-gray-900 dark:text-white">Here</span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed">
                Transforming ideas into stunning visual experiences through
                innovative graphic design, where creativity meets strategy and
                aesthetics drive results.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                  >
                    {totalStats.totalProjects}+
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 dark:text-neutral-400 mt-1">
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                  >
                    {totalStats.totalHappyClients}+
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 dark:text-neutral-400 mt-1">
                    Happy Clients
                  </div>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                  >
                    {totalStats.totalYears}+
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 dark:text-neutral-400 mt-1">
                    Years
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Advanced Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/5 border border-gray-200/50 dark:border-neutral-800/50 p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Enhanced Search */}
              <div className="flex-1">
                <div className="relative group">
                  <Search
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 group-focus-within:text-red-500 transition-colors duration-300"
                    size={22}
                  />
                  <input
                    type="text"
                    placeholder="Search designs, clients, artists, or creative concepts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-5 py-5 bg-gray-50/80 dark:bg-neutral-800/80 rounded-2xl focus:ring-1 focus:ring-red-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 text-lg backdrop-blur-sm outline-none"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-4">
                {/* Admin Mode Indicator */}
                {isAdminMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-4 py-3 bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                      Admin Mode
                    </span>
                  </motion.div>
                )}

                {/* Category Filter
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-3 px-6 py-5 bg-gray-50/80 dark:bg-neutral-800/80 hover:bg-gray-100 dark:hover:bg-neutral-700/80 border border-gray-200 dark:border-neutral-700 rounded-2xl transition-all duration-300 text-gray-700 dark:text-neutral-300 font-semibold min-w-40 backdrop-blur-sm"
                  >
                    <Layers size={20} />
                    <span className="capitalize">{filterBy}</span>
                  </motion.button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-30"
                          onClick={() => setIsFilterOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -15, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -15, scale: 0.9 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-3 w-72 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-neutral-700/50 rounded-2xl shadow-2xl z-40 overflow-hidden"
                        >
                          {categories.map((category, index) => (
                            <motion.button
                              key={category}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                setFilterBy(category);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200 capitalize font-medium ${
                                filterBy === category
                                  ? "bg-linear-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 text-red-600 dark:text-red-400 border-r-4 border-red-500"
                                  : "text-gray-700 dark:text-neutral-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <MousePointer size={16} />
                                {category}
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div> */}

                {/* Sort Dropdown */}

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-50/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl p-2 backdrop-blur-sm">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                        : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <Grid size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                        : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <List size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex items-center justify-center mt-4 pt-2 border-t border-gray-200/60 dark:border-neutral-800/60">
              <div className="flex items-center gap-6">
                <div className="text-gray-600 dark:text-neutral-400">
                  <span className="font-bold text-2xl text-gray-900 dark:text-white">
                    {filteredArtworks.length}
                  </span>
                  <span className="ml-2 font-medium">
                    design{filteredArtworks.length !== 1 ? "s" : ""}
                  </span>
                  {searchQuery && (
                    <span className="ml-3 text-sm">
                      matching "
                      <span className="text-red-500 font-semibold">
                        {searchQuery}
                      </span>
                      "
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-neutral-500"></div>
            </div>
          </div>
        </motion.section>

        {/* Design Gallery */}
        <motion.section
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          {loading ? (
            // Loading State
            <LoadingSkeleton />
          ) : filteredArtworks.length === 0 ? (
            // No artworks found or empty state
            artworks.length === 0 ? (
              <EarlyAccessMessage />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-24"
              >
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-linear-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 rounded-full flex items-center justify-center mx-auto">
                    <Search
                      size={48}
                      className="text-gray-400 dark:text-neutral-500"
                    />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-0 right-1/2 translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  No designs found
                </h3>
                <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                  {searchQuery
                    ? `Your search for "${searchQuery}" didn't match any designs. Try different keywords or explore our categories.`
                    : "Contact us for early access to upcoming designs and be the first to see our latest work!"}
                </p>
                {searchQuery && (
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery("");
                    }}
                    className="px-8 py-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-red-500/25"
                  >
                    Reset All Filters
                  </motion.button>
                )}
              </motion.div>
            )
          ) : (
            // Artworks Grid/List
            <motion.div
              layout
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              } justify-items-center`}
            >
              <AnimatePresence mode="popLayout">
                {filteredArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut",
                      layout: { duration: 0.3 },
                    }}
                    className="w-full max-w-xs group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-neutral-800/50 shadow-xl shadow-black/5 overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-linear-to-br from-red-500/0 via-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <ArtworkCard
                        artwork={artwork}
                        isAdmin={isAdminMode}
                        onDelete={(id) => {
                          setArtworks((prev) =>
                            prev.filter((art) => art.id !== id)
                          );

                          api
                            .delete(API.PORTFOLIO.DELETE(id))
                            .catch((error) => {
                              console.error(
                                "Failed to delete portfolio item:",
                                error
                              );
                            });
                        }}
                        onEdit={(id) => {
                          console.log("Edit artwork:", id);
                        }}
                        onToggleVisibility={(id, visible) => {
                          setArtworks((prev) =>
                            prev.map((art) =>
                              art.id === id ? { ...art, visible } : art
                            )
                          );

                          api
                            .patch(API.PORTFOLIO.TOGGLE_VISIBILITY(id), {
                              visible,
                            })
                            .catch((error) => {
                              console.error(
                                "Failed to update portfolio visibility:",
                                error
                              );
                              setArtworks((prev) =>
                                prev.map((art) =>
                                  art.id === id
                                    ? { ...art, visible: !visible }
                                    : art
                                )
                              );
                            });
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results Count */}
          {!loading && filteredArtworks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-full border border-gray-200/60 dark:border-neutral-700/60">
                <span className="text-sm text-gray-600 dark:text-neutral-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredArtworks.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {artworks.length}
                  </span>{" "}
                  artworks
                  {isAdminMode && (
                    <span className="ml-1 text-xs text-red-500">
                      (including hidden)
                    </span>
                  )}
                </span>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-linear-to-r from-red-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-linear-to-l from-red-400/5 to-transparent rounded-full blur-3xl" />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </LayoutWrapper>
  );
};

export default GraphicDesignPortfolio;

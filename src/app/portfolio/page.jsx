"use client";
import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { Grid, List, Search, X, Pen, Loader2, Sparkles } from "lucide-react";

// Separate component that uses useSearchParams
const PortfolioContent = () => {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);

  // Admin mode detection
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get(API.PROFILE.ME);
        const role = res?.data?.role;
        setIsAdminMode(role === "admin");
      } catch (err) {
        setIsAdminMode(false);
        if (process.env.NODE_ENV === "development") {
          console.debug("checkAdmin failed:", err?.message || err);
        }
      }
    };

    checkAdmin();
  }, []);

  const containerRef = useRef(null);

  // Fetch artworks from backend
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

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Focus search input if coming from footer "Search Designs" link
  useEffect(() => {
    if (searchParams.get("focus") === "search" && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 500);
    }
  }, [searchParams]);

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-32"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative inline-flex mb-8"
        >
          <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Pen size={40} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
            <Sparkles size={14} className="text-yellow-900" />
          </div>
        </motion.div>

        <h3 className="text-3xl font-semibold text-black dark:text-white mb-4">
          Coming Soon
        </h3>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed">
          We're crafting something special. Be the first to explore our curated
          collection of stunning designs.
        </p>

        {!isSubmitted ? (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 text-sm bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-linear-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Sending..." : "Get Notified"}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border border-green-200 dark:border-green-900"
          >
            <div className="text-green-700 dark:text-green-400 text-lg font-semibold mb-2">
              🎉 You're on the list!
            </div>
            <p className="text-sm text-green-600 dark:text-green-500">
              We'll notify you when we launch.
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="aspect-4/3 rounded-2xl bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Subtle background decoration - very minimal */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        {/* Soft linear orbs */}
        <div className="absolute top-20 left-10 w-500px h-500px bg-linear-to-br from-red-500/5 to-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-600px h-600px bg-linear-to-tl from-purple-500/5 to-red-500/5 rounded-full blur-3xl" />

        {/* Subtle grid pattern - barely visible */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-linear(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-20">
        {/* Search & Filters Section - Sticky with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-4 z-40 mb-12"
        >
          {/* Search bar with subtle glow effect */}
          <div className="relative">
            {/* Glow effect behind search bar */}
            <div className="absolute inset-0 bg-linear-to-r from-red-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-50" />

            {/* Search container */}
            <div className="relative bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-lg shadow-black/5">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={20}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search designs, clients, artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-zinc-500" />
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <Grid size={16} />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                      viewMode === "list"
                        ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <List size={16} />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>

              {/* Results Count */}
              {!loading && (
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      <strong className="text-black dark:text-white font-semibold">
                        {filteredArtworks.length}
                      </strong>{" "}
                      {filteredArtworks.length === 1 ? "design" : "designs"}
                      {searchQuery && (
                        <span className="ml-2">
                          matching{" "}
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            "{searchQuery}"
                          </span>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <motion.section
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : filteredArtworks.length === 0 ? (
            artworks.length === 0 ? (
              <EarlyAccessMessage />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-zinc-400" />
                </div>
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-3">
                  No designs found
                </h3>
                <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try different keywords or clear your search.`
                    : "Start exploring our design collection."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-3 bg-linear-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            )
          ) : (
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 max-w-3xl mx-auto"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.05, 0.3),
                      layout: { duration: 0.3 },
                    }}
                    className="transform-gpu"
                  >
                    <ArtworkCard
                      artwork={artwork}
                      viewMode={viewMode}
                      isAdmin={isAdminMode}
                      onArchive={fetchPortfolio}
                      onDelete={(_id) => {
                        setArtworks((prev) =>
                          prev.filter((art) => art._id !== _id),
                        );

                        api.delete(API.PORTFOLIO.DELETE(_id)).catch((error) => {
                          console.error(
                            "Failed to delete portfolio item:",
                            error,
                          );
                        });
                      }}
                      onEdit={(_id) => {
                        console.log("Edit artwork:", _id);
                      }}
                      onToggleVisibility={(_id, visible) => {
                        setArtworks((prev) =>
                          prev.map((art) =>
                            art._id === _id ? { ...art, visible } : art,
                          ),
                        );

                        api
                          .patch(API.PORTFOLIO.TOGGLE_VISIBILITY(_id), {
                            visible,
                          })
                          .catch((error) => {
                            console.error(
                              "Failed to update portfolio visibility:",
                              error,
                            );
                            setArtworks((prev) =>
                              prev.map((art) =>
                                art._id === _id
                                  ? { ...art, visible: !visible }
                                  : art,
                              ),
                            );
                          });
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

// Main component with Suspense wrapper
const GraphicDesignPortfolio = () => {
  return (
    <LayoutWrapper>
      <Suspense
        fallback={
          <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        }
      >
        <PortfolioContent />
      </Suspense>
      <Footer />
    </LayoutWrapper>
  );
};

export default GraphicDesignPortfolio;

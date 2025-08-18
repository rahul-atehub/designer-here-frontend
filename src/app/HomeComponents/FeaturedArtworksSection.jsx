"use client";
import ArtworkCard from "@/components/ui/ArtworkCard";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  Plus,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";

const mockArtworks = [
  {
    id: 1,
    title: "Sunset Dreams",
    description:
      "A dreamy sunset over the ocean with vibrant colors painting the sky.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: true,
    views: 153,
    uploadDate: "2025-08-01",
    category: "landscape",
    tags: ["sunset", "ocean", "nature", "peaceful"],
    likes: 45,
    featured: true,
  },
  {
    id: 2,
    title: "Urban Nights",
    description:
      "The city lights at midnight creating a stunning urban landscape.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: false,
    views: 98,
    uploadDate: "2025-08-05",
    category: "urban",
    tags: ["city", "lights", "night", "architecture"],
    likes: 32,
    featured: false,
  },
  {
    id: 3,
    title: "Forest Escape",
    description: "A peaceful walk in the woods surrounded by ancient trees.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: true,
    views: 200,
    uploadDate: "2025-08-10",
    category: "nature",
    tags: ["forest", "trees", "peaceful", "hiking"],
    likes: 67,
    featured: true,
  },
  {
    id: 4,
    title: "Abstract Waves",
    description: "Flowing abstract patterns inspired by ocean waves.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: true,
    views: 87,
    uploadDate: "2025-08-12",
    category: "abstract",
    tags: ["abstract", "waves", "fluid", "modern"],
    likes: 28,
    featured: false,
  },
  {
    id: 5,
    title: "Portrait Study",
    description: "Intimate character study capturing raw emotion.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: true,
    views: 145,
    uploadDate: "2025-08-08",
    category: "portrait",
    tags: ["portrait", "emotion", "human", "study"],
    likes: 52,
    featured: false,
  },
  {
    id: 6,
    title: "Geometric Dreams",
    description: "Bold geometric patterns with vibrant color combinations.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: false,
    views: 76,
    uploadDate: "2025-08-15",
    category: "abstract",
    tags: ["geometric", "pattern", "colorful", "modern"],
    likes: 19,
    featured: false,
  },
];

export default function Page({ userRole = "user" }) {
  // Accept userRole as prop
  // Admin check - in real app, this would come from authentication context
  const isAdmin = userRole === "admin";

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [showHidden, setShowHidden] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Animation refs
  const headerRef = useRef(null);
  const galleryRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const isGalleryInView = useInView(galleryRef, {
    once: true,
    margin: "-100px",
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(mockArtworks.map((art) => art.category))];
    return ["all", ...cats];
  }, []);

  // Filter and sort artworks
  const filteredAndSortedArtworks = useMemo(() => {
    let filtered = mockArtworks.filter((artwork) => {
      // For regular users, only show visible artworks
      if (!isAdmin && !artwork.visible) return false;

      // For admin, show hidden only if showHidden is true
      if (isAdmin && !showHidden && !artwork.visible) return false;

      // Search filter
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || artwork.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort artworks
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "views":
          aValue = a.views;
          bValue = b.views;
          break;
        case "likes":
          aValue = a.likes;
          bValue = b.likes;
          break;
        case "uploadDate":
        default:
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, sortOrder, showHidden, isAdmin]);

  // Stats for admin
  const stats = useMemo(() => {
    if (!isAdmin) return null;

    return {
      total: mockArtworks.length,
      visible: mockArtworks.filter((art) => art.visible).length,
      hidden: mockArtworks.filter((art) => !art.visible).length,
      totalViews: mockArtworks.reduce((sum, art) => sum + art.views, 0),
      totalLikes: mockArtworks.reduce((sum, art) => sum + art.likes, 0),
    };
  }, [isAdmin]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto p-4 relative z-10">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full text-sm font-medium text-purple-800 dark:text-purple-300 mb-6"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 0 0 rgba(168, 85, 247, 0)",
                "0 0 20px rgba(168, 85, 247, 0.3)",
                "0 0 0 rgba(168, 85, 247, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp size={16} />
            {isAdmin ? (
              "Admin Gallery Dashboard"
            ) : (
              <Link
                href="/portfolio"
                className="hover:underline hover:text-purple-600 transition-colors"
              >
                Creative Gallery
              </Link>
            )}
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {isAdmin ? "Manage Your Artworks" : "Discover Amazing Art"}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isAdmin
              ? "Complete control over your gallery with advanced analytics and management tools"
              : "Explore our curated collection of stunning artworks from talented creators"}
          </motion.p>
        </motion.div>

        {/* Admin Stats Dashboard */}
        <AnimatePresence>
          {isAdmin && stats && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {[
                {
                  label: "Total Artworks",
                  value: stats.total,
                  icon: BarChart3,
                  color: "blue",
                },
                {
                  label: "Visible",
                  value: stats.visible,
                  icon: Eye,
                  color: "green",
                },
                {
                  label: "Hidden",
                  value: stats.hidden,
                  icon: EyeOff,
                  color: "red",
                },
                {
                  label: "Total Views",
                  value: stats.totalViews,
                  icon: TrendingUp,
                  color: "purple",
                },
                {
                  label: "Total Likes",
                  value: stats.totalLikes,
                  icon: Users,
                  color: "pink",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <motion.p
                        className={`text-2xl font-bold text-${stat.color}-600`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <stat.icon
                      className={`w-8 h-8 text-${stat.color}-500 opacity-60`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Controls */}
        <motion.div
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="uploadDate">Upload Date</option>
                  <option value="title">Title</option>
                  <option value="views">Views</option>
                  <option value="likes">Likes</option>
                </select>

                <motion.button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {/* Admin Toggle for Hidden Items */}
              {isAdmin && (
                <motion.label
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="checkbox"
                    checked={showHidden}
                    onChange={(e) => setShowHidden(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <EyeOff className="w-4 h-4" />
                    Show Hidden
                  </span>
                </motion.label>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-600"
                    : "bg-gray-100 dark:bg-gray-600 text-gray-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Grid3X3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-600"
                    : "bg-gray-100 dark:bg-gray-600 text-gray-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Counter */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 dark:text-gray-300">
            Showing{" "}
            <span className="font-semibold text-purple-600">
              {filteredAndSortedArtworks.length}
            </span>
            {filteredAndSortedArtworks.length === 1 ? " artwork" : " artworks"}
            {searchTerm && <span> for "{searchTerm}"</span>}
          </p>

          {isAdmin && (
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(168, 85, 247, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Add New Artwork
            </motion.button>
          )}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          ref={galleryRef}
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}
          variants={containerVariants}
          initial="hidden"
          animate={isGalleryInView ? "visible" : "hidden"}
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.05,
                }}
                whileHover={{ y: -10 }}
                className="transform-gpu"
              >
                <ArtworkCard
                  artwork={artwork}
                  isAdmin={isAdmin}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results Message */}
        <AnimatePresence>
          {filteredAndSortedArtworks.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Search className="w-12 h-12 text-purple-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No artworks found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your search terms or filters to discover more art.
              </p>
              <motion.button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSortBy("uploadDate");
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

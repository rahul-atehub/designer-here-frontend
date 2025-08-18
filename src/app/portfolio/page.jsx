"use client";
import React, { useState, useEffect, useRef } from "react";
import LayoutWrapper from "@/Components/LayoutWrapper";
import Footer from "@/Components/Footer";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Filter,
  Calendar,
  Heart,
  Plus,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  ArrowUp,
  X,
  Eye,
  Download,
  Layers,
  Palette,
  Zap,
  Sparkles,
  MousePointer,
  Pen,
} from "lucide-react";

const GraphicDesignPortfolio = () => {
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);

  // Mock graphic design data
  useEffect(() => {
    const mockDesigns = [
      {
        id: 1,
        title: "Brand Identity System",
        category: "Branding",
        likes: 2847,
        views: 15420,
        uploadDate: "2024-08-15",
        image:
          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
        description:
          "Complete brand identity system including logo design, typography, and color palette for a modern tech startup",
        tags: ["branding", "logo design", "identity", "tech"],
        software: ["Adobe Illustrator", "Figma"],
        dimensions: "Various",
        client: "TechFlow Inc.",
      },
      {
        id: 2,
        title: "Mobile App UI Design",
        category: "UI/UX Design",
        likes: 1923,
        views: 8750,
        uploadDate: "2024-08-12",
        image:
          "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800",
        description:
          "Clean and intuitive mobile app interface design focusing on user experience and modern aesthetics",
        tags: ["mobile", "ui design", "app", "user interface"],
        software: ["Figma", "Sketch"],
        dimensions: "375x812px",
        client: "Personal Project",
      },
      {
        id: 3,
        title: "Poster Design Collection",
        category: "Print Design",
        likes: 3156,
        views: 12340,
        uploadDate: "2024-08-08",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        description:
          "Creative poster designs for music festival featuring bold typography and vibrant color schemes",
        tags: ["poster", "typography", "print", "festival"],
        software: ["Adobe Photoshop", "Adobe Illustrator"],
        dimensions: "24x36 inches",
        client: "Music Fest 2024",
      },
      {
        id: 4,
        title: "E-commerce Website Design",
        category: "Web Design",
        likes: 2645,
        views: 18920,
        uploadDate: "2024-08-05",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        description:
          "Modern e-commerce website design with focus on conversion optimization and user experience",
        tags: ["web design", "ecommerce", "landing page", "conversion"],
        software: ["Figma", "Adobe XD"],
        dimensions: "1440x900px",
        client: "Fashion Boutique",
      },
      {
        id: 5,
        title: "Packaging Design Series",
        category: "Packaging",
        likes: 1789,
        views: 9560,
        uploadDate: "2024-08-01",
        image:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800",
        description:
          "Sustainable packaging design for organic food products with eco-friendly materials and design approach",
        tags: ["packaging", "sustainable", "organic", "product design"],
        software: ["Adobe Illustrator", "Cinema 4D"],
        dimensions: "Various Sizes",
        client: "EcoFresh Foods",
      },
      {
        id: 6,
        title: "Social Media Campaign",
        category: "Digital Marketing",
        likes: 2234,
        views: 14580,
        uploadDate: "2024-07-28",
        image:
          "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800",
        description:
          "Comprehensive social media campaign design including posts, stories, and ad creatives for fashion brand",
        tags: ["social media", "campaign", "fashion", "digital"],
        software: ["Adobe Photoshop", "Canva Pro"],
        dimensions: "Multiple Formats",
        client: "StyleCo Fashion",
      },
      {
        id: 7,
        title: "Magazine Layout Design",
        category: "Editorial Design",
        likes: 1567,
        views: 7230,
        uploadDate: "2024-07-25",
        image:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=900",
        description:
          "Editorial magazine layout design with sophisticated typography and visual hierarchy for lifestyle publication",
        tags: ["editorial", "magazine", "layout", "typography"],
        software: ["Adobe InDesign", "Adobe Photoshop"],
        dimensions: "8.5x11 inches",
        client: "Lifestyle Quarterly",
      },
      {
        id: 8,
        title: "Motion Graphics Storyboard",
        category: "Motion Design",
        likes: 2987,
        views: 16750,
        uploadDate: "2024-07-20",
        image:
          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=900",
        description:
          "Storyboard and style frames for animated explainer video showcasing complex data in simple visual format",
        tags: ["motion graphics", "animation", "explainer", "storyboard"],
        software: ["After Effects", "Adobe Illustrator"],
        dimensions: "1920x1080px",
        client: "DataViz Corp",
      },
    ];
    setDesigns(mockDesigns);
    setFilteredDesigns(mockDesigns);
  }, []);

  // Scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...designs];

    if (searchQuery) {
      filtered = filtered.filter(
        (design) =>
          design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          design.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          design.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          design.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterBy !== "all") {
      filtered = filtered.filter(
        (design) => design.category.toLowerCase() === filterBy.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case "oldest":
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case "most-liked":
          return b.likes - a.likes;
        case "most-viewed":
          return b.views - a.views;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredDesigns(filtered);
  }, [designs, filterBy, sortBy, searchQuery]);

  const categories = [
    "all",
    "branding",
    "ui/ux design",
    "print design",
    "web design",
    "packaging",
    "digital marketing",
    "editorial design",
    "motion design",
  ];
  const sortOptions = [
    { value: "newest", label: "Latest Projects" },
    { value: "oldest", label: "Earliest Work" },
    { value: "most-liked", label: "Most Appreciated" },
    { value: "most-viewed", label: "Most Viewed" },
    { value: "alphabetical", label: "A-Z" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalStats = {
    totalViews: designs.reduce((sum, design) => sum + design.views, 0),
    totalLikes: designs.reduce((sum, design) => sum + design.likes, 0),
    totalProjects: designs.length,
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
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
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-red-100/30 dark:from-red-950/20 dark:via-transparent dark:to-red-900/10" />

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
                <span className="bg-gradient-to-r from-[#EF4444] to-blue-500 bg-clip-text text-transparent">
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
                    {Math.round(totalStats.totalViews / 1000)}K+
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 dark:text-neutral-400 mt-1">
                    Views
                  </div>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                  >
                    {Math.round(totalStats.totalLikes / 1000)}K+
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 dark:text-neutral-400 mt-1">
                    Likes
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
                    placeholder="Search designs, clients, or creative concepts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-5 py-5 bg-gray-50/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 text-lg backdrop-blur-sm"
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
                {/* Category Filter */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-3 px-6 py-5 bg-gray-50/80 dark:bg-neutral-800/80 hover:bg-gray-100 dark:hover:bg-neutral-700/80 border border-gray-200 dark:border-neutral-700 rounded-2xl transition-all duration-300 text-gray-700 dark:text-neutral-300 font-semibold min-w-[160px] backdrop-blur-sm"
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
                                  ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 text-red-600 dark:text-red-400 border-r-4 border-red-500"
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
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-5 bg-gray-50/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-700 dark:text-neutral-300 font-semibold min-w-[180px] backdrop-blur-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-50/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-2xl p-2 backdrop-blur-sm">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
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
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                        : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <List size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200/60 dark:border-neutral-800/60">
              <div className="flex items-center gap-6">
                <div className="text-gray-600 dark:text-neutral-400">
                  <span className="font-bold text-2xl text-gray-900 dark:text-white">
                    {filteredDesigns.length}
                  </span>
                  <span className="ml-2 font-medium">
                    design{filteredDesigns.length !== 1 ? "s" : ""}
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
              <div className="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-neutral-500">
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  {filteredDesigns
                    .reduce((sum, design) => sum + design.views, 0)
                    .toLocaleString()}{" "}
                  views
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={16} />
                  {filteredDesigns
                    .reduce((sum, design) => sum + design.likes, 0)
                    .toLocaleString()}{" "}
                  likes
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Design Gallery - Your Custom Cards Go Here */}
        <motion.section
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "space-y-8"
            }`}
          >
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className={`group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-neutral-800/50 shadow-xl shadow-black/5 overflow-hidden ${
                  viewMode === "list" ? "p-8" : "p-6"
                }`}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="text-center text-gray-500 dark:text-neutral-400 py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/50 dark:to-red-900/50 rounded-2xl mb-4">
                      <Pen size={24} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {design.title}
                    </h3>
                    <p className="text-sm font-medium text-red-500 mb-3">
                      {design.category}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-neutral-400 mb-4">
                      Client: {design.client}
                    </p>

                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-red-500" />
                        <span>{design.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={12} className="text-blue-500" />
                        <span>{design.views.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-neutral-700/50">
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        Software: {design.software.join(", ")}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                        Uploaded:{" "}
                        {new Date(design.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Empty State */}
          {filteredDesigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-24"
            >
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 rounded-full flex items-center justify-center mx-auto">
                  <Search
                    size={48}
                    className="text-gray-400 dark:text-neutral-500"
                  />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-1/2 translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                No designs found
              </h3>
              <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                {searchQuery
                  ? `Your search for "${searchQuery}" didn't match any designs. Try different keywords or explore our categories.`
                  : "Adjust your filters to discover amazing graphic design work."}
              </p>
              {(searchQuery || filterBy !== "all") && (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("");
                    setFilterBy("all");
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-red-500/25"
                >
                  Reset All Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.section>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.4)",
              }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl shadow-2xl shadow-red-500/25 flex items-center justify-center transition-all duration-300 backdrop-blur-xl"
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-red-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-l from-red-400/5 to-transparent rounded-full blur-3xl" />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </LayoutWrapper>
  );
};

export default GraphicDesignPortfolio;

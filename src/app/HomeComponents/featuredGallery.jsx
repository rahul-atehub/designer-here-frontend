"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API } from "@/config";
import ArtworkCard from "@/components/ui/ArtworkCard";
import { Star, Sparkles } from "lucide-react";

export default function FeaturedGallery() {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API.BASE_URL}/api/portfolio/list/feature`,
          { withCredentials: true },
        );

        setFeaturedArtworks(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching featured artworks:", err);
        setError("Failed to load featured artworks");
        setFeaturedArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Don't render section if no featured artworks
  if (!loading && featuredArtworks.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50 dark:from-neutral-950 dark:to-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#EF4444] to-blue-500  bg-clip-text text-transparent mb-4">
            Spotlight Gallery
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Handpicked masterpieces showcasing the best of our creative work
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Featured Artworks Grid */}
        <AnimatePresence mode="popLayout">
          {!loading && !error && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {featuredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork._id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -10 }}
                  className="transform-gpu relative"
                >
                  <ArtworkCard artwork={artwork} viewMode="grid" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Button */}
        {!loading && featuredArtworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <motion.a
              href="/portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#EF4444] to-red-600 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-red-500/25"
            >
              View Full Portfolio
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

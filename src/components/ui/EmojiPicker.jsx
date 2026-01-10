// src/components/EmojiPicker.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EMOJI_DATA from "@/data/emojis.json";

export default function EmojiPicker({ onEmojiSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState("recent");
  const [recentEmojis, setRecentEmojis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    // Load recent emojis from memory (or implement with window.storage if using persistent storage)
    const stored = sessionStorage?.getItem("recentEmojis");
    if (stored) {
      try {
        setRecentEmojis(JSON.parse(stored));
      } catch (e) {
        setRecentEmojis([]);
      }
    }
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);

    // Update recent emojis
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      18
    );
    setRecentEmojis(updated);
    try {
      sessionStorage?.setItem("recentEmojis", JSON.stringify(updated));
    } catch (e) {
      // Fallback if storage fails
    }
  };

  const getFilteredEmojis = () => {
    let emojis = [];

    if (activeCategory === "recent") {
      emojis = recentEmojis.length > 0 ? recentEmojis : [];
    } else {
      const category = EMOJI_DATA.categories.find(
        (c) => c.id === activeCategory
      );
      emojis = category ? category.emojis : [];
    }

    if (searchQuery.trim()) {
      return emojis.filter((emoji) => {
        // Simple search - you can improve this with emoji names if available
        return emoji.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    return emojis;
  };

  const filteredEmojis = getFilteredEmojis();
  const allCategories = [
    { id: "recent", name: "Recent", icon: "🕐" },
    ...EMOJI_DATA.categories,
  ];

  return (
    <motion.div
      ref={pickerRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-0 mb-20 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-80 z-50"
    >
      {/* Search Input */}
      <div className="p-3 border-b border-neutral-800">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search emoji"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-800 text-white placeholder-neutral-500 rounded-full outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Emoji Grid */}
      <div className="max-h-64 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {filteredEmojis.length === 0 ? (
          <div className="text-center text-neutral-500 py-8 text-sm">
            {activeCategory === "recent" && recentEmojis.length === 0
              ? "No recent emojis"
              : "No emojis found"}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-0.5">
            {filteredEmojis.map((emoji, idx) => (
              <motion.button
                key={`${activeCategory}-${idx}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl p-2 rounded-lg hover:bg-neutral-800 transition-colors aspect-square flex items-center justify-center cursor-pointer"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 px-2 py-2 border-t border-neutral-800 overflow-x-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700">
        {allCategories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveCategory(category.id);
              setSearchQuery("");
            }}
            className={`text-lg p-2 rounded-lg transition-colors shrink-0 ${
              activeCategory === category.id
                ? "bg-neutral-700 text-white"
                : "text-neutral-400 hover:bg-neutral-800"
            }`}
            title={category.name}
          >
            {category.icon}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

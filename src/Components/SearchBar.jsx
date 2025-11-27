"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { API } from "@/config";
import { Clock, TrendingUp } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Custom debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Recent searches (start empty, fill from API/local later)
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  // src/Components/SearchBar.jsx (inside component)
  useEffect(() => {
    const fetchRecentAndTrending = async () => {
      try {
        console.log(
          "Recent URL:",
          API.SEARCH.RECENT,
          "Trending URL:",
          API.SEARCH.TRENDING
        );
        console.log("API.SEARCH object:", API.SEARCH);

        // Fetch individually so one failing endpoint doesn't explode the whole UI
        const recentPromise = axios.get(API.SEARCH.RECENT).catch((err) => {
          console.error(
            "Recent searches failed:",
            err?.response?.status,
            err?.message
          );
          return { data: [] }; // fallback
        });

        const trendingPromise = axios.get(API.SEARCH.TRENDING).catch((err) => {
          console.error(
            "Trending searches failed:",
            err?.response?.status,
            err?.message
          );
          return { data: [] }; // fallback
        });

        const [recentRes, trendingRes] = await Promise.all([
          recentPromise,
          trendingPromise,
        ]);
        setRecentSearches(recentRes.data || []);
        setTrendingSearches(trendingRes.data || []);
      } catch (err) {
        // Should be rare now, but keep a final guard
        console.error("fetchRecentAndTrending unexpected error:", err);
        setRecentSearches([]);
        setTrendingSearches([]);
      }
    };

    fetchRecentAndTrending();
  }, []);

  // Debounced API call with Axios
  const fetchResults = debounce(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(API.SEARCH.SEARCH, {
        params: { q: searchTerm }, // sends ?q=searchTerm
      });

      setResults(res.data); // ✅ directly use backend response
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]); // clear results on error
    }
    setIsSearching(false);
  }, 400);

  useEffect(() => {
    fetchResults(query);
  }, [query]);

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowResults(true);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = (result) => {
    console.log("Selected:", result);
    setShowResults(false);
    setQuery(result.title);
  };

  const handleQuickSearch = (searchTerm) => {
    setQuery(searchTerm);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "video":
        return <div className={`${iconClass} bg-red-500 rounded-sm`}></div>;
      case "code":
        return <div className={`${iconClass} bg-green-500 rounded-sm`}></div>;
      case "article":
        return <div className={`${iconClass} bg-blue-500 rounded-sm`}></div>;
      default:
        return <div className={`${iconClass} bg-gray-400 rounded-sm`}></div>;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Tutorial:
        "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
      Guide:
        "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/20",
      Examples:
        "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
      Reference:
        "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20",
      Tools: "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-900/20",
    };
    return (
      colors[category] ||
      "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative" ref={searchContainerRef}>
      {/* Main Search Input */}
      <div
        className={`
        relative flex items-center border-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md
        rounded-full px-4 py-3 shadow-lg transition-all duration-300 ease-out
        ${
          isFocused
            ? "border-red-500 shadow-2xl shadow-red-500/20 scale-[1.02] bg-white dark:bg-neutral-900"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-xl"
        }
      `}
      >
        <Search
          className={`
          w-5 h-5 mr-2 transition-all duration-200
          ${isFocused ? "text-red-500" : "text-gray-500 dark:text-gray-400"}
        `}
        />

        <span className="text-gray-400 select-none mr-2">|</span>

        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
          placeholder="Search something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
        />

        <div className="flex items-center gap-2">
          {isSearching && (
            <div className="relative">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-4 h-4 border-2 border-violet-500/30 rounded-full animate-ping"></div>
            </div>
          )}

          {query && !isSearching && (
            <button
              onClick={clearSearch}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 hover:scale-110"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div
          className={`
          absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md
          rounded-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden z-50
          transform transition-all duration-300 ease-out
          ${
            showResults
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-95"
          }
        `}
        >
          {/* Search Results */}

          {!query && (
            <div className="p-6 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Recent
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {trendingSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Trending
                    </span>
                  </div>
                  <div className="space-y-1">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

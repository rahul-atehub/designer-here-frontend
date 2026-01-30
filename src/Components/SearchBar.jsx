"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { API } from "@/config";
import { Clock, TrendingUp } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const inputRef = useRef(null);
  const { user, loading } = useUser();
  const isAdmin = user?.role === "admin";

  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }

  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  useEffect(() => {
    if (loading) return;
    let ignore = false;

    (async () => {
      try {
        console.log("Recent URL:", API.SEARCH.RECENT);
        console.log("Trending URL:", API.SEARCH.TRENDING);

        let recentRes = { data: { data: { searches: [] } } };

        if (user && user._id) {
          recentRes = await axios
            .get(`${API.SEARCH.RECENT}?userId=${user._id}`, {
              withCredentials: true,
            })
            .catch(() => ({ data: { data: { searches: [] } } }));
        }

        const trendingRes = await axios
          .get(API.SEARCH.TRENDING)
          .catch(() => ({ data: [] }));

        if (ignore) return;

        setRecentSearches(
          recentRes?.data?.data?.searches?.map((s) => s.term) || [],
        );

        setTrendingSearches(
          trendingRes?.data?.data?.trending?.map((s) => s.term) || [],
        );
      } catch (err) {
        if (ignore) return;
        console.error("Error fetching search data:", err);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [loading, user]);

  const fetchResults = debounce(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(API.SEARCH.SEARCH, {
        params: { q: searchTerm, type: activeTab },
      });

      setResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
    setIsSearching(false);
  }, 400);

  useEffect(() => {
    fetchResults(query);
  }, [query, activeTab]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = (result) => {
    console.log("Selected:", result);
    if (onClose) onClose();
    setQuery(result.title || result.username);
  };

  const handleQuickSearch = (searchTerm) => {
    setQuery(searchTerm);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-neutral-800 overflow-hidden">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {isAdmin ? (
          <div className="flex items-center gap-1 relative">
            <button
              onClick={() => setActiveTab("posts")}
              className={`
                px-4 py-2 text-sm font-medium transition-all duration-200 relative z-10
                ${
                  activeTab === "posts"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }
              `}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`
                px-4 py-2 text-sm font-medium transition-all duration-200 relative z-10
                ${
                  activeTab === "users"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }
              `}
            >
              Users
            </button>

            {/* Animated underline */}
            <div
              className="absolute bottom-0 h-0.5 bg-red-500 transition-all duration-300 ease-in-out"
              style={{
                left: activeTab === "posts" ? "0.25rem" : "calc(50% + 0.25rem)",
                width: "calc(50% - 0.5rem)",
              }}
            />
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Search
          </h2>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative flex items-center bg-gray-50 dark:bg-neutral-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800 focus-within:border-gray-400 dark:focus-within:border-gray-600 transition-colors">
          <Search className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />

          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white text-sm"
            placeholder={
              activeTab === "users" ? "Search users..." : "Search posts..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex items-center gap-2">
            {isSearching && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}

            {query && !isSearching && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Area with smooth transitions */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="animate-in fade-in duration-300">
          {!query && (
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Recent
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all duration-200 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {trendingSearches.length > 0 && (
                <div className="animate-in slide-in-from-top-2 duration-300 delay-75">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Trending
                    </span>
                  </div>
                  <div className="space-y-1">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all duration-200 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {query && results.length > 0 && (
            <div className="space-y-2">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all duration-200 border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.title || result.username || "Untitled"}
                      </h3>
                      {result.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                      {result.email && activeTab === "users" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {result.email}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && !isSearching && results.length === 0 && (
            <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-300">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import debounce from "lodash.debounce";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced API call
  const fetchResults = debounce(async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${searchTerm}`);
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
    setIsSearching(false);
  }, 400);

  useEffect(() => {
    fetchResults(query);
    return fetchResults.cancel;
  }, [query]);

  return (
    <div className="w-full  ">
      {/* Search input */}
      <div className="flex items-center min-w-0 border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
        <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
        <span className="text-gray-400 select-none">|</span>
        <input
          type="text"
          className="ml-2 flex-1 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
          placeholder="Search something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Search results */}
      {query && (
        <div className="mt-2 bg-white dark:bg-neutral-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-sm">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-sm">
              No results found.
            </div>
          ) : (
            results.map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer text-gray-900 dark:text-white"
              >
                {item}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

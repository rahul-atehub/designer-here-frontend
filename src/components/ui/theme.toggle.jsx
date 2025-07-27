"use client";
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; // ← Feather icons
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 💡 Prevent SSR mismatch

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isDark ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
      <span className="font-medium">Theme</span>
    </button>
  );
}

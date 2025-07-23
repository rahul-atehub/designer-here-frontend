"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const LayoutWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content Area using Grid Layout */}
      <div
        className={`grid min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "grid-cols-[16rem_1fr]" : "grid-cols-[3.25rem_1fr]"
        }`}
      >
        {/* Left column: Toggle button area */}
        <div className="bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-gray-700 flex justify-center">
          <div className="px-4 py-3 h-[61px] flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
        </div>

        {/* Right column: Main content area */}

        {/* the main content of the page, must be rendered inside this right column of the grid, it's for main content */}

        <div className="transition-all duration-300 ease-in-out">
          {/* Top Bar - starts after vertical border */}
          <div className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-semibold text-black dark:text-white">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-6">
            {children}
            {/* this is the main content area for the page, so wahtever i wanna render on the page, should be wrapped here */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;

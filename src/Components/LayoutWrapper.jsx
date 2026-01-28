"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const LayoutWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Sidebar - only visible on sm and up */}
      <div className="hidden sm:block">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div
        className={`
      min-h-screen transition-all duration-300 ease-in-out
      ${
        isSidebarOpen
          ? "sm:grid sm:grid-cols-[16rem_1fr]"
          : "sm:grid sm:grid-cols-[3.25rem_1fr]"
      }
    `}
      >
        {/* Toggle Button Area - only visible on sm and up */}
        <div className="hidden sm:flex bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-gray-700 justify-center">
          <div className="px-4 py-3 h-15.25 flex items-center sticky top-0 ">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 "
            >
              <Menu className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
        </div>

        {/* Right column: Main content area */}
        <div className="transition-all duration-300 ease-in-out w-full">
          {/* Header Section - Navbar used here */}
          <Navbar />

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;

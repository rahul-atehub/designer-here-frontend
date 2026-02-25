// src/components/LayoutWrapper.jsx

"use client";
import React from "react";
import Navbar from "./Navbar";

const LayoutWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Navbar - covers full width */}
      <Navbar />

      {/* Main Content Area - full width, no sidebar */}
      <main className="w-full">{children}</main>
    </div>
  );
};

export default LayoutWrapper;

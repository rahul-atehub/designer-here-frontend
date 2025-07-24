"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full bg-[#f9f9f9] dark:bg-[#101010] shadow-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Left Section - Logo and Main Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 p-1 rounded">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                </svg>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold text-lg">
                DESIGNER HERE
              </span>
            </div>

            {/* Main Navigation Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] cursor-pointer transition-colors duration-200">
                <span className="text-sm">Demo 1 </span>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] cursor-pointer transition-colors duration-200">
                <span className="text-sm">Demo 2</span>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6] cursor-pointer transition-colors duration-200">
                <span className="text-sm">Demo 3</span>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#3B82F6] dark:hover:text-[#3B82F6] cursor-pointer transition-colors duration-200">
                <span className="text-sm">Demo 4</span>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] cursor-pointer transition-colors duration-200">
                <span className="text-sm">Demo 5</span>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] cursor-pointer transition-colors duration-200">
                <span className="text-sm">Demo 6</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Right Section - License, Pricing, CTA, Profile */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="/license"
              className="text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] text-sm transition-colors duration-200"
            >
              DEMO 1
            </a>
            <a
              href="/pricing"
              className="text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] text-sm transition-colors duration-200"
            >
              DEMO 2
            </a>
            <button className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded text-sm transition-colors duration-200">
              SOMETHING SPECIAL
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6] rounded-full transition-colors duration-200">
              <User size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col justify-between h-full px-4 py-6 overflow-y-auto lg:hidden">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 p-1 rounded">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                    </svg>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-lg">
                    DESIGNER HERE
                  </span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {[
                  "Demo 1",
                  "Demo 2",
                  "Demo 3",
                  "Demo 4",
                  "Demo 5",
                  "Demo 6",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <a
                href="/license"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] text-sm transition-colors duration-200"
              >
                DEMO 1
              </a>
              <a
                href="/pricing"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] text-sm transition-colors duration-200"
              >
                DEMO 2
              </a>
              <button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded text-sm">
                SOMETHING SPECIAL
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

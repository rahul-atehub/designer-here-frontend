"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Heart } from "lucide-react";

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
          </div>

          {/* Right Section - License, Pricing, CTA, Profile */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Center Navigation Menu - visible only on large screens */}
            <div className="hidden lg:flex flex-1 justify-center items-center space-x-6">
              {[
                { label: "Home", href: "/Home ", color: "#EF4444" },
                { label: "porfolio", href: "/portfolio", color: "#EF4444" },
                { label: "about-us", href: "/aboutus", color: "#EF4444" },
                { label: "contact-us", href: "/contactus", color: "#EF4444" },
              ].map(({ label, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className={`text-sm text-gray-600 dark:text-gray-300 hover:text-[${color}] dark:hover:text-[${color}] transition-colors duration-200`}
                >
                  {label}
                </Link>
              ))}
            </div>
            {/* Spacer between demo links and icons */}
            <div className="w-6"></div>{" "}
            {/* ← You can adjust width here (w-6 = 1.5rem) */}
            {/* Heart and Profile Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/favorites" aria-label="Go to favorites">
                <button className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444]">
                  <Heart className="w-5 h-5" />
                </button>
              </Link>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] rounded-full transition-colors duration-200">
                <User size={20} />
              </button>
            </div>
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
                  {/* this is for the logo. so upload that logo later on the internet and can use that later from that space  */}

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

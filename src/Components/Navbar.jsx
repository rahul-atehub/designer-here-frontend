"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Heart } from "lucide-react";
import SearchBar from "../Components/SearchBar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className=" sticky top-0 z-50 w-full bg-[#f9f9f9] dark:bg-[#101010] shadow-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 items-center gap-4 py-2">
          {/* Left Section - Logo + Toggle */}
          <div className="flex items-center justify-between lg:justify-start space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Image
                src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                alt="My Logo"
                width={40} // adjust size as needed
                height={40}
              />
              <span className="text-gray-900 dark:text-white font-semibold text-lg">
                DESIGNER HERE
              </span>
            </div>

            {/* Toggle Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] dark:hover:text-[#F97316] transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Center Section - SearchBar */}
          <div className="w-full max-w-md mx-auto px-2">
            <SearchBar />
          </div>

          {/* Right Section - Nav Links + Icons */}
          <div className="hidden lg:flex items-center justify-end space-x-6">
            {/* Nav Links */}
            <div className="flex space-x-6">
              {[
                { label: "Home", href: "/Home", color: "#EF4444" },
                { label: "portfolio", href: "/portfolio", color: "#EF4444" },
                { label: "about-us", href: "/aboutus", color: "#EF4444" },
                { label: "contact-us", href: "/contactus", color: "#EF4444" },
              ].map(({ label, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className={` lg:text-sm md:text-xs text-gray-600 dark:text-gray-300 hover:text-[${color}] dark:hover:text-[${color}] transition-colors duration-200`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/favorites">
                <button className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444]">
                  <Heart className="w-5 h-5" />
                </button>
              </Link>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] rounded-full transition-colors duration-200">
                <User size={20} />
              </button>
            </div>
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
                  "Home ",
                  "Portfolio",
                  "About Us",
                  "Contact Us",
                  "Favorites",
                  "Profile",
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

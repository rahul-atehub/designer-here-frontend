"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import PrivacyPolicyContent from "@/components/ui/PrivacyPolicyContent";
import TermsOfServiceContent from "@/components/ui/TermsOfServiceContent";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Send,
} from "lucide-react";

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-neutral-950 dark:via-gray-900 dark:to-blue-950/20 border-t border-gray-200/60 dark:border-gray-800/60 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ef4444 0%, transparent 50%)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Left Section - Main Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 dark:from-white dark:via-gray-100 dark:to-blue-100 bg-clip-text text-transparent leading-tight">
                  Designer Here
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg">
                  Every project starts with a chat. Our team leads client
                  conversations and will be happy to discuss your project. We'll
                  also pull in the right people from the team when needed.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-#EF4444 to-red-500 hover:from-red-500 hover:to-#EF4444 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] transform-gpu"
                >
                  <Send className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Tell us about your project</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Right Section - Contact Info */}
            <div className="space-y-10">
              <div className="space-y-8">
                {/* Email */}
                <div className="group flex items-start space-x-5 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/20 dark:from-blue-400/10 dark:to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Email
                    </p>
                    <Link
                      href="mailto:john@example.com"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 text-lg font-medium group-hover:underline"
                    >
                      john@example.com
                    </Link>
                  </div>
                </div>

                {/* Phone */}
                <div className="group flex items-start space-x-5 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-600/20 dark:from-green-400/10 dark:to-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Phone
                    </p>
                    <Link
                      href="tel:+6589735984"
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 text-lg font-medium group-hover:underline"
                    >
                      (+65) 89735984
                    </Link>
                  </div>
                </div>

                {/* Address */}
                <div className="group flex items-start space-x-5 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-#EF4444/10 to-red-600/20 dark:from-red-400/10 dark:to-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-#EF4444 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Address
                    </p>
                    <address className="text-gray-700 dark:text-gray-300 not-italic text-lg leading-relaxed">
                      1 Paya Lebar Link
                      <br />
                      #04-01, Paya Lebar Quarter
                      <br />
                      Singapore, 408533
                    </address>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-2">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
                  Follow Us
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="#"
                    className="group w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 border border-gray-200 dark:border-gray-700 hover:border-transparent rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </Link>
                  <Link
                    href="#"
                    className="group w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 border border-gray-200 dark:border-gray-700 hover:border-transparent rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </Link>
                  <Link
                    href="#"
                    className="group w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-pink-500 hover:to-#EF4444 border border-gray-200 dark:border-gray-700 hover:border-transparent rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </Link>
                  <Link
                    href="#"
                    className="group w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-blue-700 hover:to-blue-800 border border-gray-200 dark:border-gray-700 hover:border-transparent rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/25 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with enhanced styling */}
      <div className="relative border-t border-gray-200/60 dark:border-gray-800/60 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2024 Designer Here. All rights reserved.
              </p>
              <div className="hidden sm:block w-1 h-4 bg-gradient-to-b from-blue-500 to-#EF4444 rounded-full"></div>
              <p className="hidden sm:block text-gray-500 dark:text-gray-500 text-xs">
                Crafted with ❣️
              </p>
            </div>

            <div className="flex items-center space-x-8 text-sm">
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-#EF4444 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => setShowTerms(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 relative group"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-#EF4444 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-#EF4444 opacity-60"></div>
      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </Modal>
    </footer>
  );
};

export default Footer;

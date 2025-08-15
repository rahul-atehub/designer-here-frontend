"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-gray-300 dark:border-gray-800 transition-colors duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Section - Main Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Designer Here
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-md">
                  Every project starts with a chat. Our team leads client
                  conversations and will be happy to discuss your project. We'll
                  also pull in the right people from the team when needed.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-[#EF4444] hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  Tell us about your project
                </Link>
              </div>
            </div>

            {/* Right Section - Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-5 h-5 mt-1">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <Link
                      href="mailto:hello@buuuk.com"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 text-lg"
                    >
                      john@example.com
                    </Link>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-5 h-5 mt-1">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <Link
                      href="tel:+6589735984"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 text-lg"
                    >
                      (+65) 89735984
                    </Link>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-5 h-5 mt-1">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
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
              <div className="pt-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Follow Us
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="#"
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className=" w-full px-4 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 Buuuk. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              href="#"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

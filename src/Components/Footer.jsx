"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";

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
  const socialLinks = [
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
  ];

  const footerLinks = [
    {
      title: "Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Posts", href: "/posts" },
        { name: "Messages", href: "/messages" },
        { name: "Email Support", href: "/contact?focus=mail" },
        { name: "Help Center", href: "/help" },
      ],
    },
    {
      title: "Explore",
      links: [
        { name: "Search Designs", href: "/portfolio?focus=search" },
        { name: "Trending Designs", href: "/portfolio" },
        { name: "Recent Searches", href: "/portfolio" },
      ],
    },
    {
      title: "Features",
      links: [
        { name: "View Portfolios", href: "/portfolio" },
        { name: "Browse Profiles", href: "/profile" },
        { name: "Message Artists", href: "/messages" },
        { name: "Discover Works", href: "/portfolio" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "My Profile", href: "/profile" },
        { name: "Settings", href: "/settings" },
        { name: "My Saved Items", href: "/saved" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-services" },
        { name: "Cookie Policy", href: "/cookie-policy" },
        { name: "Developer Docs", href: "/developer-docs" },
        { name: "Support", href: "/contact-support" },
      ],
    },
  ];

  return (
    <footer className="relative bg-neutral-950 dark:bg-black text-gray-300 overflow-hidden">
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

      {/* Minimal background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Designer Here
                </h2>
                <p className="text-gray-400 text-base leading-relaxed max-w-md">
                  Transforming ideas into exceptional digital experiences. Let's
                  build something amazing together.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="group inline-flex items-center space-x-3 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                >
                  <Send className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </div>

              {/* Contact Info - Compact */}
              <div className="pt-4 space-y-3 text-sm">
                <Link
                  href="mailto:designerheredev@gmail.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>designerheredev@gmail.com</span>
                </Link>
                <Link
                  href="mailto:designerherehq@gmail.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>designerherehq@gmail.com</span>
                </Link>{" "}
                <Link
                  href="mailto:designerhere.business@gmail.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>designerhere.business@gmail.com</span>
                </Link>
                <Link
                  href="tel:+6589735984"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>(+65) 89735984</span>
                </Link>
              </div>
            </div>

            {/* Links Section - Grid Layout */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
              {footerLinks.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        {link.onClick ? (
                          <button
                            onClick={link.onClick}
                            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                          >
                            {link.name}
                          </button>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                          >
                            {link.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - Clean and Minimal */}
        <div className="border-t border-gray-800/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © 2024 Designer Here. All rights reserved.
            </p>

            {/* Social Links - Minimal Style */}
            <div className="flex items-center gap-6">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={idx}
                    href={social.href}
                    className={`text-gray-500 ${social.color} transition-colors duration-200`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

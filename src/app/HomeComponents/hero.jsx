// src/app/HomeComponents/hero.jsx

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Palette,
  Code,
  Layers,
  Box,
  Cpu,
  Figma,
  Github,
  Globe,
} from "lucide-react";

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 18,
      },
    },
  };

  const features = [
    {
      icon: Palette,
      title: "Creative Design",
      description: "Stunning visuals that capture attention",
    },
    {
      icon: Code,
      title: "Clean Code",
      description: "Optimized for performance & scalability",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "From concept to launch in record time",
    },
  ];

  const techStack = [
    { icon: Figma, name: "Figma", color: "from-purple-500 to-pink-500" },
    { icon: Globe, name: "Web", color: "from-blue-500 to-cyan-500" },
    { icon: Github, name: "Github", color: "from-gray-600 to-gray-800" },
    { icon: Layers, name: "Design", color: "from-orange-500 to-red-500" },
    { icon: Box, name: "3D", color: "from-green-500 to-emerald-500" },
    { icon: Cpu, name: "AI", color: "from-violet-500 to-purple-500" },
  ];

  const trustedCompanies = [
    "Microsoft",
    "Google",
    "Apple",
    "Amazon",
    "Meta",
    "Tesla",
  ];

  // Cycle through tech stack
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % techStack.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white overflow-hidden flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main gradient orbs - slower, more stable */}
        <motion.div
          className="absolute top-[20%] left-[5%] w-500px h-500px bg-red-500/8 dark:bg-red-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-600px h-600px bg-blue-500/8 dark:bg-blue-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 py-20 relative z-10 w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Centered Hero Content */}
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4 mt-10">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight">
              Design That
              <br />
              <span className="font-normal bg-linear-to-r from-red-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Speaks Volumes
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto font-light"
          >
            From concept to full-stack implementation, crafting modern digital
            products for performance and scale.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 pt-6"
          >
            <Link href="/portfolio">
              <button className="group inline-flex items-center gap-2 px-10 py-5 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <span className="text-lg">View Our Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>

            <Link href="/contact">
              <button className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 font-medium rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <span className="text-lg">Get In Touch</span>
              </button>
            </Link>
          </motion.div>

          {/* Tech Stack Showcase - Stable Grid Animation */}
          <motion.div variants={itemVariants} className="pt-16 pb-8">
            <div className="mb-8">
              <h3 className="text-2xl font-light text-gray-600 dark:text-gray-400 mb-2">
                We Work With
              </h3>
              <div className="h-1 w-20 bg-linear-to-r from-red-500 to-blue-500 mx-auto rounded-full" />
            </div>

            {/* Tech Grid - Stable with highlight animation */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;
                const isActive = index === activeIndex;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="relative group"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        borderColor: isActive
                          ? "rgb(239, 68, 68)"
                          : "rgb(229, 231, 235)",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "shadow-xl shadow-red-500/20"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }`}
                    >
                      {/* Glow effect for active item */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: `linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(59, 130, 246, 0.1))`,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      <div className="relative flex flex-col items-center gap-2">
                        <div
                          className={`w-12 h-12 rounded-xl bg-linear-to-br ${tech.color} flex items-center justify-center transition-transform duration-300 ${
                            isActive ? "scale-110" : "group-hover:scale-105"
                          }`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`text-sm font-medium transition-colors duration-300 ${
                            isActive
                              ? "text-red-500"
                              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          }`}
                        >
                          {tech.name}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 pt-8 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative p-8 rounded-3xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-neutral-900/50 dark:to-neutral-800/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50"
                >
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-red-500/0 to-blue-500/0 group-hover:from-red-500/5 group-hover:to-blue-500/5 transition-all duration-300" />

                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Trust Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-24 pt-12 border-t border-gray-200 dark:border-gray-800"
        >
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {trustedCompanies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-gray-400 dark:text-gray-600 font-semibold text-base hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300 cursor-pointer"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

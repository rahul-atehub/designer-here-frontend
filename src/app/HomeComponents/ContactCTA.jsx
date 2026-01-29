"use client";
import {
  Mail,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  CheckCircle,
  Heart,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

export default function ContactCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const benefits = [
    {
      icon: CheckCircle,
      text: "Free consultation call",
    },
    {
      icon: Award,
      text: "Expert team at your service",
    },
    {
      icon: Users,
      text: "Collaborative approach",
    },
    {
      icon: Heart,
      text: "Passion-driven results",
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden py-20 px-6"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Animated Background - matching hero style */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-[20%] left-[10%] w-500px h-500px bg-red-500/8 dark:bg-red-500/12 rounded-full blur-3xl"
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
          className="absolute bottom-[10%] right-[10%] w-600px h-600px bg-blue-500/8 dark:bg-blue-500/12 rounded-full blur-3xl"
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
      </div>

      {/* Main Content - No Card Container */}
      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        {/* Heading */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight text-gray-900 dark:text-white">
            Let's Create Something
            <br />
            <span className="font-normal bg-linear-to-r from-red-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto font-light"
        >
          Whether you're starting fresh or improving an existing project, we're
          here to bring your ideas to life with creativity, skill, and attention
          to detail.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 pt-6"
        >
          <Link href="/contact">
            <motion.button
              className="group relative inline-flex items-center gap-2 px-10 py-5 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "200%" : "-100%" }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="text-lg">Contact Us Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.button>
          </Link>

          <Link href="/portfolio">
            <motion.button
              className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 font-medium rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">View Our Work</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {benefit.text}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Quick Response Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Professional Service</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span>Quality Guaranteed</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import Footer from "@/Components/Footer";
import {
  Palette,
  Users,
  Award,
  Lightbulb,
  ArrowRight,
  Star,
  Zap,
  Target,
} from "lucide-react";

const AboutPage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const stats = [
    { number: "500+", label: "Projects Completed", icon: Target },
    { number: "150+", label: "Happy Clients", icon: Users },
    { number: "5+", label: "Years Experience", icon: Award },
    { number: "24/7", label: "Support Available", icon: Zap },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We push creative boundaries to deliver unique and impactful designs that stand out in the digital landscape.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We believe in working closely with our clients, turning their vision into stunning visual reality through partnership.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Every project is crafted with meticulous attention to detail, ensuring the highest quality in every deliverable.",
    },
  ];

  const teamMembers = [
    {
      name: "Alex Rivera",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Leading creative vision with 8+ years in brand design",
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      description:
        "Specializing in user-centered design and digital experiences",
    },
    {
      name: "Marcus Johnson",
      role: "Brand Strategist",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description:
        "Expert in brand identity and strategic visual communication",
    },
  ];

  return (
    <LayoutWrapper>
      <div className="min-h-screen transition-all duration-500 bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-white">
        {/* Hero Section */}
        <motion.section
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Animated Background */}
          <motion.div style={{ y }} className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-[#EF4444]/20 to-blue-500/20 dark:from-[#EF4444]/30 dark:to-purple-500/30"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 dark:from-blue-500/30 dark:to-emerald-500/30"></div>
          </motion.div>

          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border bg-white/50 border-gray-200 text-gray-600 dark:bg-neutral-900/50 dark:border-neutral-700 dark:text-gray-300">
              <Star className="w-4 h-4 text-[#EF4444]" />
              <span className="text-sm font-medium">
                Award-Winning Design Studio
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-[#EF4444] to-blue-500 bg-clip-text text-transparent">
                Designer
              </span>
              <br />
              <span>Here</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300"
            >
              We transform ideas into stunning visual experiences that captivate
              audiences and elevate brands to new heights of success.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#EF4444] text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#DC2626] transition-colors"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all border-gray-300 text-gray-900 hover:border-blue-500 hover:text-blue-500 dark:border-neutral-700 dark:text-white dark:hover:border-blue-500 dark:hover:text-blue-500"
              >
                View Our Work
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-6 rounded-2xl backdrop-blur-sm border transition-all hover:scale-105 bg-white/50 border-gray-200 hover:border-[#EF4444]/50 dark:bg-neutral-900/50 dark:border-neutral-800 dark:hover:border-[#EF4444]/50"
                >
                  <stat.icon className="w-8 h-8 text-[#EF4444] mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-[#EF4444] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* About Story Section */}
        <motion.section
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={itemVariants}>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  Our Story of
                  <span className="block bg-gradient-to-r from-[#EF4444] to-blue-500 bg-clip-text text-transparent">
                    Creative Excellence
                  </span>
                </h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-lg leading-relaxed mb-6 text-gray-600 dark:text-gray-300">
                    Founded in 2019, our studio emerged from a simple belief:
                    great design has the power to transform businesses and touch
                    lives. What started as a small team of passionate creatives
                    has evolved into a full-service design powerhouse.
                  </p>
                  <p className="text-lg leading-relaxed mb-8 text-gray-600 dark:text-gray-300">
                    We specialize in creating visual identities that don't just
                    look beautiful—they communicate, inspire, and drive results.
                    From startups to Fortune 500 companies, our work spans
                    industries and continents, united by our commitment to
                    excellence.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-30 bg-gradient-to-r from-[#EF4444]/30 to-blue-500/30 dark:from-[#EF4444]/50 dark:to-blue-500/50"></div>
                <div className="relative p-8 rounded-3xl backdrop-blur-sm border bg-white/50 border-gray-200 dark:bg-neutral-900/50 dark:border-neutral-800">
                  <Palette className="w-16 h-16 text-[#EF4444] mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Design Philosophy</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    "Design is not just what it looks like and feels like.
                    Design is how it works." We believe in creating purposeful
                    designs that solve real problems while delivering emotional
                    impact.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-6">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Drives Us
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                Our core values shape every project, relationship, and decision
                we make.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-3xl backdrop-blur-sm border transition-all bg-white/50 border-gray-200 hover:border-[#EF4444]/50 dark:bg-neutral-900/50 dark:border-neutral-800 dark:hover:border-[#EF4444]/50"
                >
                  <value.icon className="w-12 h-12 text-[#EF4444] mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-6">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Our
                <span className="block bg-gradient-to-r from-[#EF4444] to-blue-500 bg-clip-text text-transparent">
                  Creative Team
                </span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                Talented individuals united by passion for exceptional design.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="text-center p-8 rounded-3xl backdrop-blur-sm border transition-all bg-white/50 border-gray-200 hover:border-[#EF4444]/50 dark:bg-neutral-900/50 dark:border-neutral-800 dark:hover:border-[#EF4444]/50"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#EF4444]"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <div className="text-[#EF4444] font-semibold mb-4">
                    {member.role}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-6">
            <motion.div
              variants={itemVariants}
              className="relative p-12 rounded-3xl text-center overflow-hidden bg-gradient-to-r from-gray-100 to-white dark:from-neutral-900 dark:to-neutral-800"
            >
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#EF4444]/20 via-purple-500/20 to-blue-500/20 dark:from-[#EF4444]/30 dark:via-purple-500/30 dark:to-blue-500/30"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Create Something
                  <span className="block bg-gradient-to-r from-[#EF4444] to-blue-500 bg-clip-text text-transparent">
                    Extraordinary?
                  </span>
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                  Let's collaborate to bring your vision to life with design
                  that makes an impact.
                </p>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#EF4444] text-white px-12 py-4 rounded-full font-bold text-lg flex items-center gap-3 mx-auto hover:bg-[#DC2626] transition-colors"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </LayoutWrapper>
  );
};

export default AboutPage;

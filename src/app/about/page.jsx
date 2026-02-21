"use client";
import React from "react";
import { motion } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import Footer from "@/Components/Footer";
import { Palette, Lightbulb, Award, Target } from "lucide-react";

const AboutPage = () => {
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

  const values = [
    {
      icon: Palette,
      title: "Creative Excellence",
      description:
        "We push boundaries to create designs that are both beautiful and functional, ensuring every project stands out in a crowded digital landscape.",
      linear:
        "from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
    },
    {
      icon: Lightbulb,
      title: "Strategic Innovation",
      description:
        "Every design decision is backed by research and strategy. We don't just make things look good—we solve problems through thoughtful visual solutions.",
      linear:
        "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    },
    {
      icon: Award,
      title: "Quality Craftsmanship",
      description:
        "Attention to detail isn't just a phrase—it's our standard. From typography to color theory, every pixel is considered and intentional.",
      linear:
        "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    },
  ];

  const stats = [
    { number: "500+", label: "Projects Delivered" },
    { number: "150+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
    { number: "12", label: "Design Awards" },
  ];

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white relative">
        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <motion.section
            className="min-h-[70vh] flex items-center justify-center px-6 py-20"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 tracking-wide uppercase">
                  About Our Studio
                </p>
                <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                  Crafting Visual
                  <br />
                  <span className="font-normal bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Experiences
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  We believe great design is the intersection of creativity and
                  strategy—where aesthetics meet purpose.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section
            className="px-6 py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="max-w-7xl mx-auto">
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light mb-4">
                  What Drives Us
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Our core values shape every project and relationship
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="group"
                    >
                      <div
                        className={`h-full rounded-3xl p-8 bg-linear-to-br ${value.linear} border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                      >
                        <div className="mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                            <Icon className="w-7 h-7 text-gray-900 dark:text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">
                          {value.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            className="px-6 py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center p-8 rounded-3xl bg-white/50 dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="text-4xl md:text-5xl font-light bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Philosophy Section */}
          <motion.section
            className="px-6 py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="max-w-5xl mx-auto">
              <motion.div
                variants={itemVariants}
                className="rounded-3xl p-12 md:p-16 bg-linear-to-br from-gray-50 to-gray-100 dark:from-neutral-900/50 dark:to-neutral-800/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  {" "}
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center shrink-0">
                    <Target className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-light mb-4">
                      Our Philosophy
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      Design is more than aesthetics—it's communication,
                      problem-solving, and storytelling combined. We approach
                      every project with curiosity and rigor, ensuring that form
                      and function work in harmony.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">
                      Research-Driven
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Every design begins with understanding—understanding the
                      audience, the context, and the challenge.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">
                      Iteratively Refined
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Great design emerges through iteration, feedback, and the
                      relentless pursuit of better solutions.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
};

export default AboutPage;

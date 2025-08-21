"use client";
import { Mail, ArrowRight, Sparkles, Users, Award, Clock } from "lucide-react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function ContactCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(generated);
  }, []);

  // Stats counter animation
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    years: 0,
  });

  useEffect(() => {
    if (isInView) {
      const animateStats = () => {
        const duration = 2000;
        const steps = 50;
        const stepTime = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;

          setStats({
            projects: Math.floor(500 * progress),
            clients: Math.floor(150 * progress),
            years: Math.floor(5 * progress),
          });

          if (step >= steps) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
      };

      const cleanup = animateStats();
      return cleanup;
    }
  }, [isInView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="flex justify-center relative overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-red-400 rounded-full opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 justify-center gap-8 my-20 p-8 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl relative z-10">
        {/* Text Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            variants={floatingVariants}
            animate="animate"
          >
            <Sparkles size={16} className="animate-pulse" />
            Ready to Start Your Project?
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Let's Create Something{" "}
            <motion.span
              className="text-[#EF4444] relative inline-block"
              animate={{
                textShadow: isHovered
                  ? "0 0 20px rgba(239, 68, 68, 0.5)"
                  : "0 0 0px rgba(239, 68, 68, 0)",
              }}
              transition={{ duration: 0.3 }}
            >
              Amazing
              <motion.svg
                className="absolute -bottom-1 left-0 w-full h-2"
                viewBox="0 0 100 8"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isInView ? 1 : 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              >
                <motion.path
                  d="M0,4 Q25,0 50,4 T100,4"
                  stroke="#EF4444"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </motion.svg>
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
            variants={itemVariants}
          >
            Whether you're starting fresh or improving an existing project,
            we're here to bring your ideas to life with creativity, skill, and
            attention to detail. From first concept to final delivery, our focus
            is on crafting work that reflects your vision and makes an impact.
            <br />
            <motion.span
              className="inline-block mt-2 font-semibold text-gray-800 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Great collaborations start with a simple conversation — and we'd
              love to hear from you.
            </motion.span>
          </motion.p>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <div className="text-center">
              <motion.div
                className="text-2xl font-bold text-[#EF4444]"
                animate={{ scale: isInView ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {stats.projects}+
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Projects
              </div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-2xl font-bold text-blue-500"
                animate={{ scale: isInView ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {stats.clients}+
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Happy Clients
              </div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-2xl font-bold text-green-500"
                animate={{ scale: isInView ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {stats.years}+
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Years
              </div>
            </div>
          </motion.div>

          {/* Enhanced Button */}
          <motion.div variants={itemVariants}>
            <motion.a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#EF4444] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg group relative overflow-hidden"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Button Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "0%" : "-100%" }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="relative z-10 flex items-center gap-3"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail size={20} />
                <span>Contact Us</span>
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.div>

              {/* Ripple Effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0,
                  opacity: isHovered ? [0, 0.3, 0] : 0,
                }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex items-center gap-6 pt-4"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users size={16} className="text-green-500" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Award size={16} className="text-blue-500" />
              <span>Quality Guaranteed</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Image Section */}
        <motion.div
          className="flex justify-end relative"
          variants={imageVariants}
        >
          {/* Floating decorative elements */}
          <motion.div
            className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl opacity-20 z-0"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${
                mousePosition.y * 0.02
              }px)`,
            }}
          />

          <motion.div
            className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-15 z-0"
            animate={{
              rotate: [360, 0],
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transform: `translate(${mousePosition.x * -0.03}px, ${
                mousePosition.y * -0.03
              }px)`,
            }}
          />

          {/* Main Image Container */}
          <motion.div
            className="relative group overflow-hidden rounded-2xl shadow-2xl z-10"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Image Overlay Effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 z-20"
              transition={{ duration: 0.4 }}
            />

            <motion.img
              src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755348139/pngtree-empty-plot-concrete-monochrome-with-shadows-and-graphic-structures-featuring-red-contrasts-photo-photo-image_65596080_zgkhvn.webp"
              alt="Professional team collaboration and creative design process"
              className="rounded-2xl shadow-lg max-h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />

            {/* Interactive Overlay */}
            <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
              <div className="text-white">
                <motion.p
                  className="text-sm font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Join 500+ satisfied clients
                </motion.p>
                <motion.p
                  className="text-xs opacity-80 mt-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Ready to transform your vision into reality
                </motion.p>
              </div>
            </motion.div>

            {/* Floating Action Button */}
            <motion.div
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-black/80 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 z-30"
              whileHover={{ scale: 1.1, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight size={20} className="text-red-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

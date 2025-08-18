"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import Footer from "@/Components/Footer";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for interactive background
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form data ready to send:", formData);
    setSuccess(true);
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
    setIsSubmitting(false);

    setTimeout(() => setSuccess(false), 5000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <LayoutWrapper>
      <>
        <Head>
          <title>Publius - Let's Create Something Amazing Together</title>
          <meta
            name="description"
            content="Contact Publius - Ready to bring your vision to life with cutting-edge design and development"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 relative overflow-hidden">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient orbs */}
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Interactive mouse follower */}
            <motion.div
              className="absolute w-96 h-96 bg-gradient-radial from-red-500/10 to-transparent rounded-full blur-xl pointer-events-none"
              animate={{
                x: mousePosition.x - 192,
                y: mousePosition.y - 192,
              }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 200,
              }}
            />

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Enhanced decorative lines */}
            <svg
              className="absolute top-0 right-0 w-full h-full opacity-30"
              viewBox="0 0 1200 800"
              fill="none"
            >
              <motion.path
                d="M1200 0 Q1100 500 800 400"
                stroke="url(#gradient1)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M1000 0 Q700 300 600 200"
                stroke="url(#gradient2)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M1200 200 Q1000 600 900 500"
                stroke="url(#gradient3)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
                <linearGradient
                  id="gradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient
                  id="gradient3"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            className="relative z-10 min-h-screen flex items-center justify-center p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 rounded-3xl shadow-2xl shadow-red-500/10 max-w-7xl w-full overflow-hidden"
              whileHover={{ scale: 1.005 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Left side - Form */}
                <motion.div
                  className="lg:w-1/2 p-8 lg:p-12"
                  variants={formVariants}
                >
                  {/* Header */}
                  <motion.div className="mb-8" variants={itemVariants}>
                    {/* Logo and Brand */}
                    <motion.div
                      className="flex items-center gap-3 mb-8"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Image
                          src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                          alt="Designer Here Logo"
                          width={48}
                          height={48}
                          className="rounded-full shadow-lg"
                        />
                      </motion.div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        Designer Here
                      </span>
                    </motion.div>

                    {/* Enhanced Navigation */}
                    <motion.div
                      className="flex items-center gap-8 mb-12"
                      variants={itemVariants}
                    >
                      <motion.a
                        href="/"
                        className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium relative group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Home</span>
                        <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
                      </motion.a>

                      <motion.button
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </motion.button>
                    </motion.div>

                    {/* Enhanced Title and Subtitle */}
                    <motion.div variants={itemVariants}>
                      <motion.h1
                        className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        Let's create{" "}
                        <motion.span
                          className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
                          animate={{
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          magic
                        </motion.span>{" "}
                        together.
                      </motion.h1>

                      <motion.p
                        className="text-lg text-gray-600 dark:text-gray-300 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        Ready to bring your vision to life? Let's start the
                        conversation.
                      </motion.p>

                      <motion.p
                        className="text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        Or reach us directly at:{" "}
                        <motion.a
                          href="mailto:Publius@mail.com"
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium relative group"
                          whileHover={{ scale: 1.05 }}
                        >
                          Publius@mail.com
                          <motion.div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                        </motion.a>
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Form */}
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    variants={itemVariants}
                  >
                    {/* Name fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      >
                        <motion.input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("firstName")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="First name"
                          className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 backdrop-blur-sm ${
                            focusedField === "firstName"
                              ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                              : errors.firstName
                              ? "border-red-400"
                              : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                          }`}
                          whileFocus={{ scale: 1.02 }}
                        />
                        <AnimatePresence>
                          {errors.firstName && (
                            <motion.p
                              className="text-red-500 text-sm mt-1 flex items-center gap-1"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {errors.firstName}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      >
                        <motion.input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("lastName")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Last name"
                          className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 backdrop-blur-sm ${
                            focusedField === "lastName"
                              ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                              : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                          }`}
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>
                    </div>

                    {/* Email field */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <motion.input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Email address"
                        className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 backdrop-blur-sm ${
                          focusedField === "email"
                            ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                            : errors.email
                            ? "border-red-400"
                            : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                        }`}
                        whileFocus={{ scale: 1.02 }}
                      />
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Message field */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <motion.textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tell us about your project..."
                        rows="5"
                        className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none backdrop-blur-sm ${
                          focusedField === "message"
                            ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                            : errors.message
                            ? "border-red-400"
                            : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                        }`}
                        whileFocus={{ scale: 1.02 }}
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Bottom section */}
                    <div className="flex items-center justify-between pt-6">
                      <motion.button
                        type="button"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        <span>Add attachment</span>
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative px-8 py-3 rounded-xl font-medium text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <motion.div
                          className="relative flex items-center gap-2"
                          animate={
                            isSubmitting ? { x: [0, -5, 5, 0] } : { x: 0 }
                          }
                          transition={{
                            duration: 0.5,
                            repeat: isSubmitting ? Infinity : 0,
                            repeatType: "reverse",
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send message</span>
                              <motion.svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                whileHover={{ x: 3 }}
                                transition={{ duration: 0.2 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </motion.svg>
                            </>
                          )}
                        </motion.div>
                      </motion.button>
                    </div>

                    {/* Enhanced Success message */}
                    <AnimatePresence>
                      {success && (
                        <motion.div
                          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-800"
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 500,
                                damping: 25,
                              }}
                            >
                              <motion.svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </motion.svg>
                            </motion.div>
                            <div>
                              <p className="font-medium">
                                Message sent successfully! 🎉
                              </p>
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                We'll get back to you within 24 hours.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                </motion.div>

                {/* Right side - Enhanced Image with overlays */}
                <motion.div
                  className="lg:w-1/2 relative"
                  variants={imageVariants}
                >
                  <div className="h-64 lg:h-full relative overflow-hidden rounded-r-3xl lg:rounded-l-none lg:rounded-r-3xl">
                    {/* Image with parallax effect */}
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Serene mountain landscape with crystal clear lake reflection"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    {/* Floating Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white/30 rounded-full"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>

                    {/* Content Overlay */}
                    <motion.div
                      className="absolute bottom-8 left-8 right-8 text-white"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      <motion.div
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                        whileHover={{ scale: 1.05, bg: "white/15" }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.h3
                          className="text-xl font-bold mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2, duration: 0.6 }}
                        >
                          Let's Build Something Incredible
                        </motion.h3>
                        <motion.p
                          className="text-white/80 text-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4, duration: 0.6 }}
                        >
                          Every great project starts with a conversation. Share
                          your vision and watch it come to life.
                        </motion.p>

                        {/* Animated stats */}
                        <motion.div
                          className="flex gap-4 mt-4 text-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.6 }}
                        >
                          <div className="text-center">
                            <motion.div
                              className="font-bold text-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              500+
                            </motion.div>
                            <div className="text-white/60">Projects</div>
                          </div>
                          <div className="text-center">
                            <motion.div
                              className="font-bold text-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.5,
                              }}
                            >
                              98%
                            </motion.div>
                            <div className="text-white/60">Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <motion.div
                              className="font-bold text-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 1,
                              }}
                            >
                              24h
                            </motion.div>
                            <div className="text-white/60">Response</div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Global Styles */}
          <style jsx global>{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }

            @keyframes pulse-glow {
              0%,
              100% {
                box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
              }
              50% {
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.8),
                  0 0 30px rgba(239, 68, 68, 0.6);
              }
            }

            .animate-float {
              animation: float 3s ease-in-out infinite;
            }

            .animate-pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
            }

            // /* Custom scrollbar */
            // ::-webkit-scrollbar {
            //   width: 6px;
            // }

            // ::-webkit-scrollbar-track {
            //   background: transparent;
            // }

            // ::-webkit-scrollbar-thumb {
            //   background: linear-gradient(to bottom, #ef4444, #f97316);
            //   border-radius: 3px;
            // }

            // ::-webkit-scrollbar-thumb:hover {
            //   background: linear-gradient(to bottom, #dc2626, #ea580c);
            // }

            /* Enhanced focus styles */
            .focus-visible:focus-visible {
              outline: 2px solid #ef4444;
              outline-offset: 2px;
            }
          `}</style>
        </div>
      </>
      <Footer />
    </LayoutWrapper>
  );
}

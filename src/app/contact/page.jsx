"use client";
import Head from "next/head";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import Footer from "@/Components/Footer";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { API } from "@/config";

// Separate component that uses useSearchParams
function ContactContent() {
  const searchParams = useSearchParams();
  // Existing contact form state
  const [formData, setFormData] = useState({ message: "" });
  const [errors, setErrors] = useState({});
  const { user, loading: userLoading } = useUser();
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const authTimeoutRef = useRef(null);

  // Email service form state
  const [emailFormData, setEmailFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [emailErrors, setEmailErrors] = useState({});
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [emailFocusedField, setEmailFocusedField] = useState(null);
  const emailInputRef = useRef(null);

  // Mouse tracking for interactive background
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Focus email input if coming from footer "Email Support" link
  useEffect(() => {
    if (searchParams.get("focus") === "mail" && emailInputRef.current) {
      setTimeout(() => emailInputRef.current?.focus(), 500);
    }
  }, [searchParams]);

  // Existing contact form handlers
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

  // Email service form handlers
  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (emailErrors[name]) {
      setEmailErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      // Show a brief notification that only images are allowed
      console.warn("Only image files are allowed");
    }

    const newAttachments = imageFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const attachment = prev.find((att) => att.id === id);
      if (attachment && attachment.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((att) => att.id !== id);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validation functions
  const validate = () => {
    const newErrors = {};
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    return newErrors;
  };

  const validateEmailForm = () => {
    const newErrors = {};
    if (!emailFormData.name.trim()) newErrors.name = "Name is required";
    if (!emailFormData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(emailFormData.email))
      newErrors.email = "Invalid email format";
    if (!emailFormData.message.trim())
      newErrors.message = "Message is required";
    return newErrors;
  };

  // Existing contact form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (userLoading) {
      setIsSubmitting(false);
      return;
    }

    // 1️⃣ Not logged in
    if (!user && !userLoading) {
      setAuthMessage("Please log in to send a message.");
      setShowAuthModal(true);
      setIsSubmitting(false);

      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }

      authTimeoutRef.current = setTimeout(() => {
        setShowAuthModal(false);
      }, 3000);

      return;
    }

    // 2️⃣ Logged in but NOT a normal user
    if (user && user.role !== "user") {
      setAuthMessage("Admins cannot send messages from this form.");
      setShowAuthModal(true);
      setIsSubmitting(false);

      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }

      authTimeoutRef.current = setTimeout(() => {
        setShowAuthModal(false);
      }, 3000);

      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    // API call for contact form
    try {
      const formPayload = new FormData();

      formPayload.append("senderId", user._id);
      formPayload.append("message", formData.message);

      attachments.forEach((att) => {
        formPayload.append("image", attachments[0].file);
      });

      const response = await axios.post(API.CHAT.MESSAGES_SEND, formPayload, {
        withCredentials: true,
      });

      console.log("Response from backend:", response.data);

      setSuccess(true);
      setFormData({ message: "" });
      setAttachments([]);
    } catch (error) {
      console.error("Error sending form:", error);
      setErrors({ api: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  // Email service form submit handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsEmailSubmitting(true);

    const validationErrors = validateEmailForm();
    if (Object.keys(validationErrors).length > 0) {
      setEmailErrors(validationErrors);
      setIsEmailSubmitting(false);
      return;
    }

    setEmailErrors({});

    // API call for email service
    try {
      const response = await axios.post(
        API.EMAIL,
        {
          name: emailFormData.name,
          email: emailFormData.email,
          message: emailFormData.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Email service response:", response.data);

      setEmailSuccess(true);
      setEmailFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);

      // Handle backend error response
      if (error.response?.data?.message) {
        setEmailErrors({ api: error.response.data.message });
      } else {
        setEmailErrors({ api: "Failed to send email. Please try again." });
      }
    } finally {
      setIsEmailSubmitting(false);
      setTimeout(() => setEmailSuccess(false), 5000);
    }
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

      <div className="min-h-screen bg-linear-to-br slate-50  dark:neutral-950  relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Existing Contact Form Section */}
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
                  <motion.div className="flex items-center gap-3 mb-8">
                    <div>
                      <Image
                        src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                        alt="Designer Here Logo"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="text-2xl font-bold bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                      Designer Here
                    </span>
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
                        className="bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
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
                  </motion.div>
                </motion.div>

                {/* Enhanced Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={itemVariants}
                >
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
                      rows={8}
                      className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none  ${
                        focusedField === "message"
                          ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                          : errors.message
                            ? "border-red-400"
                            : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                      }`}
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

                  {/* File Attachments Preview */}
                  <AnimatePresence>
                    {attachments.length > 0 && (
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.h4
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          Attached Images ({attachments.length})
                        </motion.h4>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                          {attachments.map((attachment, index) => (
                            <motion.div
                              key={attachment.id}
                              className="relative group  bg-gray-50 dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="aspect-square relative">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full h-full object-cover"
                                />

                                {/* Always visible overlay for mobile */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/20 md:opacity-0 md:hover:opacity-100 transition-opacity duration-200" />

                                {/* Remove button - always visible on mobile, hover on desktop */}
                                <motion.button
                                  type="button"
                                  onClick={() =>
                                    removeAttachment(attachment.id)
                                  }
                                  className="absolute top-2 right-2 w-7 h-7 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg md:shadow-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.1 + 0.3 }}
                                >
                                  <svg
                                    className="w-4 h-4 md:w-3 md:h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </motion.button>

                                {/* File size badge - visible on mobile */}
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                  {formatFileSize(attachment.size)}
                                </div>
                              </div>

                              {/* File info */}
                              <div className="p-3">
                                <p
                                  className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mb-1"
                                  title={attachment.name}
                                >
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 md:block hidden">
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom section */}
                  <div className="flex items-center justify-between pt-6">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Add attachment button */}
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </motion.svg>
                      <span>Add attachment</span>
                      {attachments.length > 0 && (
                        <motion.span
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          {attachments.length}
                        </motion.span>
                      )}
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative px-8 py-3 rounded-xl font-medium text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-red-500 to-orange-500 group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300" />
                      <div className="absolute inset-0 bg-linear-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div
                        className="relative flex items-center gap-2"
                        animate={isSubmitting ? { x: [0, -5, 5, 0] } : { x: 0 }}
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

                  <AnimatePresence>
                    {showAuthModal && (
                      <motion.div
                        className="mt-4 p-3 rounded-lg text-sm
               bg-yellow-50 text-yellow-800
               dark:bg-yellow-900/20 dark:text-yellow-300
               border border-yellow-200 dark:border-yellow-800"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {authMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Success message */}
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        className="mt-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-800"
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
                              Message sent successfully!
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              We'll get back to you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* API Error message */}
                  <AnimatePresence>
                    {errors.api && (
                      <motion.div
                        className="mt-6 p-4 bg-linear-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-800 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-6 h-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="font-medium">{errors.api}</p>
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

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

          {/* NEW EMAIL SERVICE SECTION */}
          <motion.div
            className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl my-14 border border-white/20 dark:border-neutral-700/30 rounded-3xl shadow-2xl shadow-blue-500/10 max-w-4xl w-full overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.005 }}
          >
            <div className="p-8 lg:p-12">
              {/* Email Service Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <motion.div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-linear-to-r from-[#EF4444] to-orange-500 rounded-xl flex items-center justify-center"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <span className="text-2xl font-bold bg-linear-to-r from-[#EF4444] to-orange-500 bg-clip-text text-transparent">
                    Email Service
                  </span>
                </motion.div>

                <motion.h2
                  className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  Send us a quick{" "}
                  <motion.span
                    className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    message
                  </motion.span>
                </motion.h2>

                <motion.p
                  className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  Have a quick question or need immediate assistance? Drop us a
                  line using our streamlined email service.
                </motion.p>
              </motion.div>

              {/* Email Service Form */}
              <motion.form
                onSubmit={handleEmailSubmit}
                className="space-y-6 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              >
                {/* Name field */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <motion.input
                    type="text"
                    name="name"
                    value={emailFormData.name}
                    onChange={handleEmailInputChange}
                    onFocus={() => setEmailFocusedField("name")}
                    onBlur={() => setEmailFocusedField(null)}
                    placeholder="Your name"
                    className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500  ${
                      emailFocusedField === "name"
                        ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                        : emailErrors.name
                          ? "border-red-400"
                          : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                    }`}
                  />
                  <AnimatePresence>
                    {emailErrors.name && (
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
                        {emailErrors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email field */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <motion.input
                    ref={emailInputRef}
                    type="email"
                    name="email"
                    value={emailFormData.email}
                    onChange={handleEmailInputChange}
                    onFocus={() => setEmailFocusedField("email")}
                    onBlur={() => setEmailFocusedField(null)}
                    placeholder="Your email address"
                    className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                      emailFocusedField === "email"
                        ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                        : emailErrors.email
                          ? "border-red-400"
                          : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                    }`}
                  />
                  <AnimatePresence>
                    {emailErrors.email && (
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
                        {emailErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Message field */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <motion.textarea
                    name="message"
                    value={emailFormData.message}
                    onChange={handleEmailInputChange}
                    onFocus={() => setEmailFocusedField("message")}
                    onBlur={() => setEmailFocusedField(null)}
                    placeholder="Your message..."
                    rows="4"
                    className={`w-full px-4 py-4 bg-gray-50/50 dark:bg-neutral-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none  ${
                      emailFocusedField === "message"
                        ? "border-red-500 shadow-lg shadow-red-500/20 bg-white dark:bg-neutral-800"
                        : emailErrors.message
                          ? "border-red-400"
                          : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                    }`}
                  />
                  <AnimatePresence>
                    {emailErrors.message && (
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
                        {emailErrors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div className="flex justify-center pt-4">
                  <motion.button
                    type="submit"
                    disabled={isEmailSubmitting}
                    className="relative px-8 py-3 rounded-xl font-medium text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isEmailSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isEmailSubmitting ? 1 : 0.95 }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-red-500 to-orange-500 group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300" />
                    <div className="absolute inset-0 bg-linear-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      className="relative flex items-center gap-2"
                      animate={
                        isEmailSubmitting ? { x: [0, -5, 5, 0] } : { x: 0 }
                      }
                      transition={{
                        duration: 0.5,
                        repeat: isEmailSubmitting ? Infinity : 0,
                        repeatType: "reverse",
                      }}
                    >
                      {isEmailSubmitting ? (
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
                          <span>Send Email</span>
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
                              strokeWidth="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </motion.svg>
                        </>
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// Main component with Suspense wrapper
export default function Home() {
  return (
    <LayoutWrapper>
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <ContactContent />
        </Suspense>
      </>
      <Footer />
    </LayoutWrapper>
  );
}

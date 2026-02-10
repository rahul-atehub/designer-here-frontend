// src/app/contact/page.jsx

"use client";
import Head from "next/head";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";
import Footer from "@/Components/Footer";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { API } from "@/config";
import { Mail, MessageSquare, Paperclip, Send, X } from "lucide-react";

// Separate component that uses useSearchParams
function ContactContent() {
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const authTimeoutRef = useRef(null);

  // Email service form state
  const [emailFormData, setEmailFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    issueType: "design",
  });
  const [emailErrors, setEmailErrors] = useState({});
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const emailInputRef = useRef(null);

  // Platform message form state
  const [formData, setFormData] = useState({ message: "" });
  const [errors, setErrors] = useState({});

  // Toast states
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Toast helper functions
  const showSuccess = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showError = (message) => {
    setToastMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 3000);
  };

  // Focus email input if coming from footer "Email Support" link
  useEffect(() => {
    if (searchParams.get("focus") === "mail" && emailInputRef.current) {
      setTimeout(() => emailInputRef.current?.focus(), 500);
    }
  }, [searchParams]);

  // Email service form handlers
  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (emailErrors[name]) {
      setEmailErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};
    if (!emailFormData.name.trim()) newErrors.name = "Name is required";
    if (!emailFormData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(emailFormData.email))
      newErrors.email = "Invalid email format";
    if (!emailFormData.subject.trim())
      newErrors.subject = "Subject is required";
    if (!emailFormData.message.trim())
      newErrors.message = "Message is required";
    return newErrors;
  };

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

    try {
      const response = await axios.post(
        API.EMAIL,
        {
          name: emailFormData.name,
          email: emailFormData.email,
          issueType: emailFormData.issueType,
          subject: emailFormData.subject,
          message: emailFormData.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Email service response:", response.data);

      showSuccess("Email sent successfully!");
      setEmailFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        issueType: "design",
      });
    } catch (error) {
      console.error("Error sending email:", error);

      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Failed to send email. Please try again.");
      }
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  // Platform message form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
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

  const validate = () => {
    const newErrors = {};
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (userLoading) {
      setIsSubmitting(false);
      return;
    }

    // Not logged in
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

    // Logged in but NOT a normal user
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

      showSuccess("Message sent successfully!");
      setFormData({ message: "" });
      setAttachments([]);
    } catch (error) {
      console.error("Error sending form:", error);
      showError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - Get in Touch</title>
        <meta
          name="description"
          content="Get in touch with our team. We'd love to hear from you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Page Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-light text-black dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Have a question or want to work together? We'd love to hear from
              you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* EMAIL SECTION - Side by Side */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Left Side - Info Section with Background (NO CARD) */}
              <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-black dark:text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-2xl font-light text-black dark:text-white mb-2">
                      Email Us
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Send us an email and we'll get back to you within 24
                      hours.
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Response time: Within 24h
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Available for everyone
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form Card (SEPARATE CARD) */}
              <div className="lg:col-span-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 lg:p-12 bg-white dark:bg-neutral-950">
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Your Name
                    </label>
                    <input
                      ref={emailInputRef}
                      type="text"
                      name="name"
                      value={emailFormData.name}
                      onChange={handleEmailInputChange}
                      placeholder="John Doe"
                      className={`w-full text-sm border rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                        emailErrors.name
                          ? "border-red-400 focus:ring-red-400"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-400"
                      }`}
                    />
                    {emailErrors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {emailErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={emailFormData.email}
                      onChange={handleEmailInputChange}
                      placeholder="john@example.com"
                      className={`w-full text-sm border rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                        emailErrors.email
                          ? "border-red-400 focus:ring-red-400"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-400"
                      }`}
                    />
                    {emailErrors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {emailErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Issue Type Field - NEW */}
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Issue Type
                    </label>
                    <select
                      name="issueType"
                      value={emailFormData.issueType}
                      onChange={handleEmailInputChange}
                      className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                    >
                      <option value="design">Design Inquiry</option>
                      <option value="feature">Feature Request</option>
                      <option value="collaboration">Collaboration</option>
                    </select>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={emailFormData.subject}
                      onChange={handleEmailInputChange}
                      placeholder="What is this regarding?"
                      className={`w-full text-sm border rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                        emailErrors.subject
                          ? "border-red-400 focus:ring-red-400"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-400"
                      }`}
                    />
                    {emailErrors.subject && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {emailErrors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={emailFormData.message}
                      onChange={handleEmailInputChange}
                      placeholder="Tell us about your project or inquiry..."
                      rows="5"
                      className={`w-full text-sm border rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                        emailErrors.message
                          ? "border-red-400 focus:ring-red-400"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-400"
                      }`}
                    />
                    {emailErrors.message && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {emailErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isEmailSubmitting}
                    className="w-full px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isEmailSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Email</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* MESSAGE SECTION */}
          <div>
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Left Side - Image Preview Area with Background (NO CARD) */}
              <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-black dark:text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-2xl font-light text-black dark:text-white mb-2">
                      Already a member?
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Send us a platform message with image attachments.
                      Requires login.
                    </p>
                  </div>

                  {/* Image Attachments Preview */}
                  <AnimatePresence>
                    {attachments.length > 0 && (
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wide font-medium">
                          Attached Images ({attachments.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {attachments.map((attachment, index) => (
                            <motion.div
                              key={attachment.id}
                              className="relative group bg-white dark:bg-black rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.2,
                              }}
                            >
                              <div className="aspect-square relative">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full h-full object-cover"
                                />

                                {/* Remove button */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAttachment(attachment.id)
                                  }
                                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all"
                                >
                                  <X className="w-3 h-3" />
                                </button>

                                {/* File size badge */}
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                  {formatFileSize(attachment.size)}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Show placeholder when no images */}
                  {attachments.length === 0 && (
                    <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center">
                      <Paperclip className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        No images attached yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Message Form Card (SEPARATE CARD) */}
              <div className="lg:col-span-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 lg:p-12 bg-white dark:bg-neutral-950">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Message Field */}
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Type your message here..."
                      rows="6"
                      className={`w-full text-sm border rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                        errors.message
                          ? "border-red-400 focus:ring-red-400"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-400"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Attach button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>Attach Images</span>
                      {attachments.length > 0 && (
                        <span className="bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs px-2 py-0.5 rounded-full">
                          {attachments.length}
                        </span>
                      )}
                    </button>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Auth Modal Message */}
                  <AnimatePresence>
                    {showAuthModal && (
                      <motion.div
                        className="p-4 rounded-lg text-sm bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {authMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </div>

          {/* SUPPORT CENTER LINK - ADD THIS */}
          <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Need help with the platform or have technical questions?
              </p>
              <a
                href="/contact-support"
                className="inline-flex items-center gap-2 text-sm font-medium text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors group"
              >
                <span>Visit our Support Center</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Success Toast - Settings Style */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Toast - Settings Style */}
        <AnimatePresence>
          {showErrorToast && (
            <motion.div
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// Main component with Suspense wrapper
export default function Home() {
  return (
    <LayoutWrapper>
      <>
        <SearchParamsWrapper>
          <ContactContent />
        </SearchParamsWrapper>
      </>
      <Footer />
    </LayoutWrapper>
  );
}

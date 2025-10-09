"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Palette, Sparkles } from "lucide-react";
import ModeHandler from "./ModeHandler";
import LayoutWrapper from "@/Components/LayoutWrapper";
import { API } from "@/config";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(isLogin ? API.AUTH.LOGIN : API.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const [floatingShapes, setFloatingShapes] = useState([]);

  useEffect(() => {
    const shapes = Array.from({ length: 6 }, (_, i) => ({
      style: {
        background: `linear-gradient(45deg, ${
          i % 2 === 0 ? "#3B82F6" : "#8B5CF6"
        }, ${i % 3 === 0 ? "#EF4444" : "#06B6D4"})`,
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      },
      animate: {
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50],
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      },
      transition: {
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    }));

    setFloatingShapes(shapes);
  }, []);

  return (
    <LayoutWrapper>
      <Suspense fallback={null}>
        <ModeHandler setIsLogin={setIsLogin} />
      </Suspense>
      <div className="in-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-all duration-500 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingShapes.map((shape, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              style={shape.style}
              animate={shape.animate}
              transition={shape.transition}
            />
          ))}

          {/* Gradient Orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-violet-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="flex items-center justify-center in-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-80px)] p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md relative z-10"
          >
            {/* Auth Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/70 dark:bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 relative overflow-hidden"
            >
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none"></div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name Field (Sign Up Only) */}
                  {!isLogin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="relative"
                    >
                      <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#EF4444] focus:border-transparent outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#EF4444] focus:border-transparent outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#EF4444] focus:border-transparent outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password (Sign Up Only) */}
                  {!isLogin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="relative"
                    >
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#EF4444] focus:border-transparent outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#EF4444] to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLogin ? "Sign In" : "Create Account"}
                      <Sparkles className="ml-2 w-4 h-4" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </motion.button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white/70 dark:bg-black/30 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="flex  justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="flex items-center justify-center py-3 px-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </motion.button>
                  </div>
                </motion.form>
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8"
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#EF4444] hover:text-red-600 font-semibold transition-colors"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default AuthPage;

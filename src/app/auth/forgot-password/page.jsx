"use client";
import LayoutWrapper from "@/Components/LayoutWrapper";
import ForgotPassword from "@/app/settings/ForgotPassword";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <LayoutWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-neutral-950 px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-2xl"
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/auth/login"
              className="flex items-center gap-2  text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition font-medium"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </motion.div>

          {/* Forgot Password Component */}
          <ForgotPassword />
        </motion.div>
      </motion.div>
    </LayoutWrapper>
  );
}

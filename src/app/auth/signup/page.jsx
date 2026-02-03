"use client";

import LayoutWrapper from "@/Components/LayoutWrapper";
import SignupForm from "@/app/accounts/SignupForm";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <LayoutWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-neutral-950 px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <SignupForm mode="signup" />
        </motion.div>
      </motion.div>
    </LayoutWrapper>
  );
}

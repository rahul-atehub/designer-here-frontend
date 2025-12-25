// src/app/messages/page.jsx
"use client";

import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import MessagePage from "@/app/messages/messagepage";
import AuthRequired from "@/components/ui/AuthRequired";

export default function MessagesRouter() {
  const { user, loading, error } = useUser();

  // 🔄 Loading state (similar vibe to ProfileRouter)
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-124px)] sm:min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-80px)] bg-white dark:bg-neutral-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-400 font-medium"
          >
            Loading your messages...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // 🔐 Not authenticated or error → same behavior as profile router
  if (error || !user) {
    return <AuthRequired />;
  }

  return <MessagePage />;
}

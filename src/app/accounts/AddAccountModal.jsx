"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Link as LinkIcon } from "lucide-react";
import SignupForm from "@/app/accounts/SignupForm";
import LinkForm from "@/app/accounts/LinkForm";

export default function AddAccountModal({ onClose, onSuccess }) {
  const [step, setStep] = useState("choice"); // "choice", "create", "link"

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <AnimatePresence mode="wait">
          {step === "choice" ? (
            /* Choice Modal - Instagram Style */
            <motion.div
              key="choice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 text-center border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-medium text-black dark:text-white">
                  Add Account
                </h2>
              </div>

              {/* Options */}
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {/* Create New Account */}
                <button
                  onClick={() => setStep("create")}
                  className="w-full px-6 py-4 flex items-center justify-center gap-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  Create New Account
                </button>

                {/* Link Existing Account */}
                <button
                  onClick={() => setStep("link")}
                  className="w-full px-6 py-4 flex items-center justify-center gap-3 text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <LinkIcon className="w-5 h-5" />
                  Link Existing Account
                </button>

                {/* Cancel */}
                <button
                  onClick={onClose}
                  className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            /* Form Modal - Signup or Link */
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Back Button */}
              <button
                onClick={() => setStep("choice")}
                className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
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
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Content */}
              <div className="p-8 pt-16">
                {step === "create" ? (
                  <SignupForm mode="add-account" onSuccess={onSuccess} />
                ) : (
                  <LinkForm onSuccess={onSuccess} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

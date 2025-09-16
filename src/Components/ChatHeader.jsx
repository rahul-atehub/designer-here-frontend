// src/app/components/ChatHeader.jsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChatHeader({
  chatId,
  viewerType,
  onParticipantUpdate,
}) {
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        setLoading(true);
        const endpoint = API.CHAT.MESSAGES_VIEWER.replace(
          "{chatId}",
          chatId
        ).replace("{viewerType}", viewerType);
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.participant) {
          setParticipant(data.participant);
          if (onParticipantUpdate) {
            onParticipantUpdate(data.participant);
          }
        }
      } catch (error) {
        console.error("Failed to fetch participant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId && viewerType) {
      fetchParticipant();
    }
  }, [chatId, viewerType, onParticipantUpdate]);

  const getStatusText = () => {
    if (!participant) return "";

    if (participant.status === "online") {
      return "Online";
    } else if (participant.lastSeen) {
      const lastSeen = new Date(participant.lastSeen);
      const now = new Date();
      const diffMs = now - lastSeen;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      return `${diffDays}d ago`;
    }
    return "Offline";
  };

  const getStatusColor = () => {
    if (!participant) return "bg-gray-400";
    return participant.status === "online" ? "bg-green-500" : "bg-gray-400";
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-neutral-700 animate-pulse"></div>
        </div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-300 dark:bg-neutral-700 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 flex items-center">
        <div className="text-gray-500 dark:text-neutral-400">
          Failed to load participant
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 flex items-center space-x-3 sticky top-0 z-10"
      >
        <div className="relative">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            src={participant.avatar}
            alt={participant.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor()} rounded-full border-2 border-white dark:border-neutral-900`}
          ></motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg font-semibold text-gray-900 dark:text-white truncate"
          >
            {participant.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-sm ${
              participant.status === "online"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-neutral-400"
            }`}
          >
            {getStatusText()}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-2"
        >
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600 dark:text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600 dark:text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </>
  );
}

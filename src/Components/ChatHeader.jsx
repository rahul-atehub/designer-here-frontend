// src/components/ChatHeader.jsx
"use client";
import { motion } from "framer-motion";

export default function ChatHeader({ participant }) {
  if (!participant) {
    return (
      <div className="bg-neutral-900/50 border-b border-neutral-800 px-6 py-4">
        <div className="text-neutral-400">Loading chat...</div>
      </div>
    );
  }

  const getStatusText = () => {
    if (participant.status === "online") return "Online";
    if (participant.lastSeen) {
      const mins = Math.floor(
        (Date.now() - new Date(participant.lastSeen)) / 60000
      );
      return mins < 60 ? `${mins}m ago` : "Offline";
    }
    return "Offline";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center space-x-3"
    >
      <img
        src={participant.avatar || "/avatar-placeholder.png"}
        alt={participant.name || "User"}
        onError={(e) => {
          e.currentTarget.src = "/avatar-placeholder.png";
        }}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-white truncate">
          {participant.name}
        </h2>
        <p className="text-sm text-neutral-400">{getStatusText()}</p>
      </div>
    </motion.div>
  );
}

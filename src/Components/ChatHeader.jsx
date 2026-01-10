// src/components/ChatHeader.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Ban, Trash2, Archive } from "lucide-react";
import axios from "axios";
import { API } from "@/config";

export default function ChatHeader({
  participant,
  chatId,
  onChatDeleted,
  onChatBlocked,
  onChatArchived,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    participant?.avatar || "/avatar-placeholder.png"
  );
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef(null);

  // Fetch avatar from API
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!participant?.id) return;

      try {
        const response = await axios.get(API.USER.PROFILE, {
          params: { userId: participant.id },
          withCredentials: true,
        });

        if (response.data?.avatar) {
          setAvatarUrl(response.data.avatar);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
        // Keep using the placeholder or participant.avatar
      }
    };

    fetchAvatar();
  }, [participant?.id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (!participant) {
    return (
      <div className="bg-gray-100/50 dark:bg-neutral-900/50 border-b border-gray-300 dark:border-neutral-800 px-6 py-4">
        <div className="text-gray-400 dark:text-neutral-400">
          Loading chat...
        </div>
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

  const handleBlockUser = async () => {
    setShowMenu(false);
    if (!chatId) {
      console.error("Chat ID is required to block user");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        API.CHAT.MESSAGES_BLOCK(chatId),
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("User blocked successfully");
        if (onChatBlocked) {
          onChatBlocked(participant);
        }
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    setShowMenu(false);
    if (!chatId) {
      console.error("Chat ID is required to delete chat");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(API.CHAT.MESSAGES(chatId), {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Chat deleted successfully");
        if (onChatDeleted) {
          onChatDeleted(participant);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveChat = async () => {
    setShowMenu(false);
    if (!chatId) {
      console.error("Chat ID is required to archive chat");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        API.CHAT.MESSAGES_ARCHIVE(chatId),
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Chat archived successfully");
        if (onChatArchived) {
          onChatArchived(participant);
        }
      }
    } catch (error) {
      console.error("Error archiving chat:", error);
      alert("Failed to archive chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-100/50 dark:bg-neutral-900/50 backdrop-blur-md border-b border-gray-300 dark:border-neutral-800 px-6 py-4 flex items-center space-x-3 relative"
    >
      <img
        src={avatarUrl}
        alt={participant.name || "User"}
        onError={(e) => {
          e.currentTarget.src = "/avatar-placeholder.png";
        }}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-black dark:text-white truncate">
          {participant.name}
        </h2>
        <p className="text-sm text-gray-400 dark:text-neutral-400">
          {getStatusText()}
        </p>
      </div>

      {/* Three-dot menu button */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="More options"
        >
          <EllipsisVertical className="w-5 h-5 text-gray-700 dark:text-neutral-300" />
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden z-50"
            >
              <button
                onClick={handleArchiveChat}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50  dark:hover:bg-neutral-700 transition-colors duration-150 text-gray-700 dark:text-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Archive className="w-5 h-5" />
                <span className="text-sm font-medium">Archive Chat</span>
              </button>

              <button
                onClick={handleBlockUser}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150 text-red-600 dark:text-red-400  border-t border-gray-200 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-5 h-5" />
                <span className="text-sm  font-medium">Block</span>
              </button>

              <button
                onClick={handleDeleteChat}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150 text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-medium">Delete Chat</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center backdrop-blur-sm z-40">
          <div className="w-6 h-6 border-2 border-gray-300 dark:border-neutral-600 border-t-gray-700 dark:border-t-neutral-300 rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}

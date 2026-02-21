// src/components/ChatHeader.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  EllipsisVertical,
  Ban,
  Trash2,
  Archive,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { API } from "@/config";

export default function ChatHeader({
  participant,
  chatId,
  onChatDeleted,
  onChatBlocked,
  onChatArchived,
  onBack,
  isMobile = false,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    participant?.avatar || "/avatar-placeholder.png",
  );
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef(null);

  // Toast states
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal states
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

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

  const handleBlockUser = async () => {
    setShowBlockModal(false);
    if (!participant?._id) {
      showError("User ID is required to block user");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        API.ADMIN.BLOCK_USER,
        { userId: participant._id },
        { withCredentials: true },
      );

      if (response.status === 200) {
        showSuccess("User blocked successfully");
        if (onChatBlocked) {
          onChatBlocked(participant);
        }
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      showError("Failed to block user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!participant?._id) return;
    setIsLoading(true);
    try {
      await axios.post(
        API.ADMIN.UNBLOCK_USER,
        { userId: participant._id },
        { withCredentials: true },
      );
      showSuccess("User unblocked successfully");
      if (onChatBlocked) {
        onChatBlocked(participant);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      showError("Failed to unblock user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    setShowDeleteModal(false);
    if (!chatId) {
      showError("Chat ID is required to delete chat");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(API.CHAT.MESSAGES(chatId), {
        withCredentials: true,
      });

      if (response.status === 200) {
        showSuccess("Chat deleted successfully");
        if (onChatDeleted) {
          onChatDeleted(participant);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      showError("Failed to delete chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveChat = async () => {
    setShowArchiveModal(false);
    if (!chatId) {
      showError("Chat ID is required to archive chat");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        API.CHAT.MESSAGES_ARCHIVE(chatId),
        {},
        { withCredentials: true },
      );

      if (response.status === 200) {
        showSuccess("Chat archived successfully");
        if (onChatArchived) {
          onChatArchived(participant);
        }
      }
    } catch (error) {
      console.error("Error archiving chat:", error);
      showError("Failed to archive chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-100/50 dark:bg-neutral-900/50 border-b border-gray-300 dark:border-neutral-800 px-6 py-4 flex items-center space-x-3 relative"
      >
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <img
          src={
            !participant.isActive ||
            participant.isDeleted ||
            participant.isBlockedByMe ||
            participant.isBlockedByAdmin
              ? "/avatar-placeholder.png"
              : avatarUrl
          }
          alt={
            participant.isDeleted
              ? "Deleted User"
              : !participant.isActive
                ? "Deactivated"
                : participant.isBlockedByMe || participant.isBlockedByAdmin
                  ? "User"
                  : participant.name || "User"
          }
          onError={(e) => {
            e.currentTarget.src = "/avatar-placeholder.png";
          }}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h2
            className={`text-lg font-semibold truncate ${
              !participant.isActive ||
              participant.isDeleted ||
              participant.isBlockedByMe ||
              participant.isBlockedByAdmin
                ? "text-zinc-400 dark:text-zinc-600"
                : "text-black dark:text-white"
            }`}
          >
            {participant.isDeleted
              ? "Deleted User"
              : !participant.isActive
                ? "Deactivated"
                : participant.isBlockedByMe || participant.isBlockedByAdmin
                  ? "User"
                  : participant.name}
          </h2>
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
                  onClick={() => {
                    setShowMenu(false);
                    setShowArchiveModal(true);
                  }}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50  dark:hover:bg-neutral-700 transition-colors duration-150 text-gray-700 dark:text-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Archive className="w-5 h-5" />
                  <span className="text-sm font-medium">Archive Chat</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    participant.isBlockedByMe
                      ? handleUnblockUser()
                      : setShowBlockModal(true);
                  }}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150 text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ban className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {participant.isBlockedByMe ? "Unblock" : "Block"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
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

      {/* Block Modal - Instagram Style */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-black dark:text-white text-center">
                Block {participant.name || "this user"}?
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center leading-relaxed">
                They won't be able to view your portfolio or send commercial
                messages. They can still send you messages, but you won't see
                them until you unblock them.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col">
              <button
                onClick={handleBlockUser}
                className="w-full px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-b border-zinc-200 dark:border-zinc-700"
              >
                Block
              </button>
              <button
                onClick={() => setShowBlockModal(false)}
                className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - Instagram Style */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 max-w-md w-full mx-4 bg-white dark:bg-black">
            <h2 className="text-xl font-light text-black dark:text-white mb-3">
              Delete Chat?
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              This action cannot be undone. All messages in this chat will be
              permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChat}
                className="flex-1 px-4 py-3 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal - Instagram Style */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 max-w-md w-full mx-4 bg-white dark:bg-black">
            <h2 className="text-xl font-light text-black dark:text-white mb-3">
              Archive Chat?
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              This chat will be moved to your archived chats. You can unarchive
              it anytime.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveChat}
                className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast - Settings Style */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
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
    </>
  );
}

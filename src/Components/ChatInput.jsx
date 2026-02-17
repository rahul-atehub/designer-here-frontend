"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "@/config";
import axios from "axios";
import EmojiPicker from "@/components/ui/EmojiPicker";
import socketClient from "@/lib/socket-client";
import { useUser } from "@/context/UserContext";

export default function ChatInput({ chatId, participant, onUserUnblocked }) {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [sending, setSending] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const { user } = useUser();
  const isAdmin = user?.role === "admin";
  const isUserBlocked = participant?.isBlockedByMe === true;

  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
  const handleSend = async () => {
    if (!message.trim() && selectedImages.length === 0) return;
    if (sending || !chatId) return;

    try {
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      window.dispatchEvent(
        new CustomEvent("optimistic-message", {
          detail: {
            tempId,
            chatId,
            text: message.trim(),
            imageUrl: null,
            status: "sending",
          },
        }),
      );

      setMessage("");
      setSelectedImages([]);

      const formData = new FormData();
      formData.append("text", message);
      selectedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      axios
        .post(API.CHAT.MESSAGES(chatId), formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          socketClient.stopTyping(chatId);

          if (response.data?.messageId) {
            window.dispatchEvent(
              new CustomEvent("message-confirmed", {
                detail: {
                  tempId,
                  messageId: response.data.messageId,
                  status: "sent",
                },
              }),
            );
          }
        })
        .catch((error) => {
          console.error("Message send failed:", error);

          window.dispatchEvent(
            new CustomEvent("message-failed", {
              detail: { tempId },
            }),
          );
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      window.dispatchEvent(
        new CustomEvent("message-failed", {
          detail: { tempId: `temp-${Date.now()}-${Math.random()}` },
        }),
      );
    }
  };

  const handleUnblockUser = async () => {
    if (!participant?._id) return;

    setShowUnblockModal(false); // Close modal first
    setIsUnblocking(true);
    try {
      await axios.post(
        API.ADMIN.UNBLOCK_USER,
        { userId: participant._id },
        { withCredentials: true },
      );

      showSuccess("User unblocked successfully");
      if (onUserUnblocked) {
        onUserUnblocked();
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      showError("Failed to unblock user");
    } finally {
      setIsUnblocking(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatId) return;

    setShowDeleteModal(false); // Close modal first
    setIsDeletingChat(true);
    try {
      await axios.delete(API.CHAT.MESSAGES(chatId), {
        withCredentials: true,
      });

      window.location.href = "/messages";
    } catch (error) {
      console.error("Error deleting chat:", error);
      showError("Failed to delete chat");
    } finally {
      setIsDeletingChat(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  const typingTimeout = useRef(null);

  const handleTyping = () => {
    socketClient.startTyping(chatId);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socketClient.stopTyping(chatId);
    }, 1200);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleImageFiles([file]);
          }
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("paste", handlePaste);
      return () => textarea.removeEventListener("paste", handlePaste);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageFiles = (files) => {
    const validImages = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select only image files");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Please select images under 10MB.`);
        return false;
      }
      return true;
    });

    if (validImages.length === 0) return;

    if (selectedImages.length + validImages.length > 5) {
      alert("You can only upload up to 5 images at once");
      return;
    }

    const newImages = validImages.map((file) => {
      const id = Date.now() + Math.random();
      const reader = new FileReader();

      const imageData = {
        id,
        file,
        preview: null,
        name: file.name,
        size: file.size,
      };

      reader.onload = (e) => {
        setSelectedImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, preview: e.target.result } : img,
          ),
        );
      };
      reader.readAsDataURL(file);

      return imageData;
    });

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageFiles(files);
    }
    e.target.value = "";
  };

  const removeImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageFiles(files);
    }
  };

  const hasContent = message.trim() || selectedImages.length > 0;

  // If admin viewing blocked user, show centered card
  if (isAdmin && isUserBlocked) {
    return (
      <>
        <div className="bg-white dark:bg-neutral-950 border-t border-gray-300 dark:border-neutral-800 py-16">
          <div className="max-w-md mx-auto text-center px-6">
            <h3 className="text-base font-semibold text-black dark:text-white mb-2">
              You've blocked this account
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
              You can't message blocked user
            </p>

            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setShowUnblockModal(true)}
                disabled={isUnblocking}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 disabled:opacity-50 transition-colors"
              >
                Unblock
              </button>

              <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700" />

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeletingChat}
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 disabled:opacity-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Unblock Confirmation Modal */}
        {showUnblockModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-black dark:text-white text-center">
                  Unblock {participant?.username || "this user"}?
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center leading-relaxed">
                  They will be able to message you and see your portfolio again.
                </p>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={handleUnblockUser}
                  disabled={isUnblocking}
                  className="w-full px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
                >
                  {isUnblocking ? "Unblocking..." : "Unblock"}
                </button>
                <button
                  onClick={() => setShowUnblockModal(false)}
                  className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Chat Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-black dark:text-white text-center">
                  Delete chat?
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center leading-relaxed">
                  This action cannot be undone. All messages will be permanently
                  deleted.
                </p>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={handleDeleteChat}
                  disabled={isDeletingChat}
                  className="w-full px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
                >
                  {isDeletingChat ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
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

        {/* Error Toast */}
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

  // ✅ Normal input for non-admin or non-blocked users
  return (
    <div className="bg-white dark:bg-neutral-950 border-t border-gray-300 dark:border-neutral-800">
      {/* Image Previews */}
      <AnimatePresence>
        {selectedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pt-4 pb-2"
          >
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((imageData) => (
                <motion.div
                  key={imageData.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  {imageData.preview ? (
                    <img
                      src={imageData.preview}
                      alt={imageData.name}
                      className="h-16 w-16 object-cover rounded-lg border border-gray-300 dark:border-neutral-700"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-neutral-700">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeImage(imageData.id)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Area */}
      <div
        className={`p-6 transition-colors ${dragOver ? "bg-blue-500/10" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-end gap-3">
          {/* 3-DOT MENU */}
          <div ref={menuRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu((v) => !v)}
              disabled={sending}
              className="p-2 text-gray-400 dark:text-neutral-400 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-all disabled:opacity-50 shrink-0"
              title="More options"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-300 dark:border-neutral-700 overflow-hidden w-64 z-50"
                >
                  {/* Attachment Option */}
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowMenu(false);
                    }}
                    disabled={sending}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
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
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <span className="font-medium">Photo or video</span>
                  </motion.button>

                  <div className="h-px bg-gray-200 dark:bg-neutral-800" />

                  {/* Emoji Option */}
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowMenu(false);
                    }}
                    disabled={sending}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    <span className="text-lg">😊</span>
                    <span className="font-medium">Emoji</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emoji Picker */}
            <div className="relative">
              <AnimatePresence>
                {showEmojiPicker && (
                  <EmojiPicker
                    onEmojiSelect={(emoji) => {
                      setMessage((prev) => prev + emoji);
                    }}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <div className="relative flex items-end bg-gray-200 dark:bg-neutral-800 rounded-2xl border border-gray-300 dark:border-neutral-700 focus-within:border-gray-400 dark:focus-within:border-neutral-600 transition-colors">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                disabled={sending}
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 border-none outline-none resize-none overflow-y-auto disabled:opacity-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full"
                style={{
                  minHeight: "40px",
                  maxHeight: "150px",
                  lineHeight: "1.5",
                }}
              />

              {/* Send Button */}
              <AnimatePresence>
                {hasContent && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={sending}
                    className="px-3 py-1 pb-3.5 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shrink-0"
                    title="Send message"
                  >
                    {sending ? "Sending..." : "Send"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Drag and Drop Overlay */}
        <AnimatePresence>
          {dragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center"
            >
              <div className="text-blue-400 font-medium">
                Drop images here to upload
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
}

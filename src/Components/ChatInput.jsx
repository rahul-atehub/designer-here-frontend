// src/components/ChatInput.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "@/config";
import axios from "axios";
import EmojiPicker from "@/components/ui/EmojiPicker";
import socketClient from "@/lib/socket-client";

export default function ChatInput({ chatId }) {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [sending, setSending] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

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
        })
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
              })
            );
          }
        })
        .catch((error) => {
          console.error("Message send failed:", error);

          window.dispatchEvent(
            new CustomEvent("message-failed", {
              detail: { tempId },
            })
          );
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      window.dispatchEvent(
        new CustomEvent("message-failed", {
          detail: { tempId: `temp-${Date.now()}-${Math.random()}` },
        })
      );
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
            img.id === id ? { ...img, preview: e.target.result } : img
          )
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
          {/* 3-DOT MENU (Attachment + Emoji) */}
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

            {/* ✅ EMOJI PICKER POPUP - PLACED HERE */}
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

          {/* Text Input Area - FULL WIDTH */}
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

              {/* Send Button - ONLY SHOW ON CONTENT */}
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
                    className="px-3 py-1 pb-3.5  text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shrink-0"
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

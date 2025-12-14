// src/components/ChatInput.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "@/config";

const EMOJI_LIST = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤐",
  "❤️",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🎉",
  "🎊",
  "🎈",
  "🔥",
  "💯",
  "✨",
  "⭐",
  "🌟",
  "👏",
  "👍",
  "👎",
  "🙏",
  "💪",
];

export default function ChatInput({ chatId, viewerType, onSendMessage }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sending, setSending] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle paste events for images
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

  const handleSend = async () => {
    if ((!message.trim() && selectedImages.length === 0) || sending) return;

    setSending(true);

    try {
      const senderId = viewerType === "admin" ? "admin_456" : "user_123";

      const imageUrls = [];
      for (const imageData of selectedImages) {
        if (imageData.preview) {
          imageUrls.push({
            url: imageData.preview,
            name: imageData.name,
            size: imageData.size,
          });
        }
      }

      const endpoint = API.CHAT.MESSAGES.replace("{chatId}", chatId);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send",
          sender: senderId,
          text: message.trim(),
          images: imageUrls.length > 0 ? imageUrls : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (onSendMessage) {
          onSendMessage(data.message);
        }

        setMessage("");
        setSelectedImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);

      setTimeout(() => {
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        textarea.focus();
      }, 0);
    } else {
      setMessage((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const hasContent = message.trim() || selectedImages.length > 0;

  return (
    <div className="bg-neutral-950 border-t border-neutral-800">
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
                      className="h-16 w-16 object-cover rounded-lg border border-neutral-700"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
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
          {/* Attachment Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            title="Attach images"
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
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </motion.button>

          {/* Text Input Area */}
          <div className="flex-1 relative">
            <div className="relative bg-neutral-800 rounded-2xl border border-neutral-700 focus-within:border-neutral-600 transition-colors">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                disabled={sending}
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-white placeholder-neutral-500 border-none outline-none resize-none overflow-y-auto disabled:opacity-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full"
                style={{
                  minHeight: "40px",
                  maxHeight: "150px",
                  lineHeight: "1.5",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Emoji Button */}
            <div className="relative" ref={emojiPickerRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={sending}
                className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-all disabled:opacity-50"
                title="Add emoji"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </motion.button>

              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-2 bg-neutral-800 rounded-2xl shadow-xl border border-neutral-700 p-4 w-80 max-h-72 overflow-hidden"
                  >
                    <div className="h-full max-h-72 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pr-1 pb-4">
                      <div className="grid grid-cols-8 gap-2">
                        {EMOJI_LIST.map((emoji, index) => (
                          <motion.button
                            key={`${emoji}-${index}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-xl p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: hasContent ? 1.05 : 1 }}
              whileTap={{ scale: hasContent ? 0.95 : 1 }}
              onClick={handleSend}
              disabled={!hasContent || sending}
              className={`p-2 rounded-lg transition-all ${
                hasContent && !sending
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "text-neutral-600 cursor-not-allowed"
              }`}
              title="Send message"
            >
              {sending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </motion.button>
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

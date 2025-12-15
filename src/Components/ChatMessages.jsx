// src/components/ChatMessages.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "@/config";

export default function ChatMessages({
  chatId,
  viewerType,
  newMessage,
  onMessageUpdate,
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [userScrolled, setUserScrolled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserScrolled(!isNearBottom);
    }
  };

  useEffect(() => {
    if (!chatId || !viewerType) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const endpoint = `${API.CHAT.MESSAGES}/${chatId}?viewerType=${viewerType}`;
        const response = await fetch(endpoint, { method: "GET" });
        const data = await response.json();

        if (data.messages) {
          setMessages(data.messages);
          setCurrentUserId(viewerType === "admin" ? "admin_456" : "user_123");
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, viewerType]);

  // Handle new messages
  useEffect(() => {
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
      if (!userScrolled) {
        setTimeout(scrollToBottom, 100);
      }
      if (onMessageUpdate) {
        onMessageUpdate();
      }
    }
  }, [newMessage, userScrolled, onMessageUpdate]);

  // Auto-scroll for new messages
  useEffect(() => {
    if (!loading && !userScrolled) {
      scrollToBottom();
    }
  }, [messages, loading, userScrolled]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;

    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();

    return currentDate !== prevDate;
  };

  const handleUnsendMessage = async (messageId) => {
    try {
      const response = await fetch(`${API.CHAT.MESSAGES}/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unsend", messageId }),
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        if (onMessageUpdate) onMessageUpdate();
      }
    } catch (error) {
      console.error("Failed to unsend message:", error);
    }
  };

  const MessageBubble = ({ message, isOwn, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isOwn ? "order-2" : "order-1"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative px-4 py-2 rounded-2xl wrap-break-word ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-neutral-800 text-white rounded-bl-none"
          }`}
        >
          {/* Message content */}
          {message.text && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-break-word">
              {message.text}
            </p>
          )}

          {/* Images */}
          {message.images && message.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${
                message.text ? "mt-2" : ""
              } rounded-lg overflow-hidden`}
            >
              <div className="grid grid-cols-2 gap-2">
                {message.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url || img}
                    alt="Shared image"
                    className="w-full h-auto max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(img.url || img, "_blank")}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {message.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${
                message.text ? "mt-2" : ""
              } rounded-lg overflow-hidden`}
            >
              <img
                src={message.image}
                alt="Shared image"
                className="w-full h-auto max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.image, "_blank")}
              />
            </motion.div>
          )}

          {message.emoji && <div className="text-3xl">{message.emoji}</div>}

          {/* Timestamp */}
          <div
            className={`text-xs mt-1 ${
              isOwn ? "text-blue-100" : "text-neutral-400"
            }`}
          >
            {formatTime(message.timestamp)}
          </div>

          {/* Unsend button for own messages */}
          {isOwn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleUnsendMessage(message.id)}
              className="absolute -top-2 -left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );

  const DateSeparator = ({ date }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center my-6"
    >
      <div className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs font-medium">
        {formatDate(date)}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
        <p className="mt-4 text-neutral-400">Loading messages...</p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 py-6 bg-neutral-950 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <AnimatePresence mode="popLayout">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No messages yet
            </h3>
            <p className="text-neutral-400 max-w-sm">
              Start the conversation by sending your first message!
            </p>
          </motion.div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.sender === currentUserId;
              const showDateSeparator = shouldShowDateSeparator(
                message,
                messages[index - 1]
              );

              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <DateSeparator date={message.timestamp} />
                  )}
                  <MessageBubble
                    message={message}
                    isOwn={isOwn}
                    index={index}
                  />
                </div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Scroll to bottom indicator */}
      <AnimatePresence>
        {userScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-20 transition-colors"
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  );
}

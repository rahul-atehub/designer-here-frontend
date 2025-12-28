// src/components/ChatMessages.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socketClient from "@/lib/socket-client";
import { API } from "@/config";
import axios from "axios";

export default function ChatMessages({ chatId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [hoverMenuId, setHoverMenuId] = useState(null);
  const hoverTimerRef = useRef(null);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserScrolled(!isNearBottom);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.detail.chatId !== chatId) return;
      addOptimisticMessage(e.detail);
    };

    window.addEventListener("optimistic-message", handler);
    return () => window.removeEventListener("optimistic-message", handler);
  }, [chatId]);

  const addOptimisticMessage = ({ tempId, text, imageUrl, chatId }) => {
    setMessages((prev) => [
      {
        id: tempId, // temporary key
        tempId, // keep it
        chatId, // keep it
        senderId: currentUserId,
        text,
        image: imageUrl,
        timestamp: new Date().toISOString(),
        optimistic: true,
      },
      ...prev,
    ]);
  };

  const prevChatIdRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    // Leave previous chat ONLY if chat actually changed
    if (prevChatIdRef.current && prevChatIdRef.current !== chatId) {
      socketClient.leaveChat(prevChatIdRef.current);
    }

    socketClient.joinChat(chatId);
    prevChatIdRef.current = chatId;

    const onNewMessage = (msg) => {
      if (msg.chatId !== chatId) return;
      setMessages((prev) => {
        //  Replace optimistic message
        const hasTemp = prev.some((m) => m.tempId === msg.tempId);

        if (hasTemp) {
          return prev.map((m) => {
            if (m.tempId !== msg.tempId) return m;

            // 🔥 strip tempId permanently
            const { tempId, ...cleanMsg } = msg;

            return {
              id: cleanMsg._id,
              senderId: cleanMsg.senderId._id ?? cleanMsg.senderId,
              text: cleanMsg.text,
              image: cleanMsg.imageUrl,
              timestamp: cleanMsg.createdAt,
              optimistic: false,
            };
          });
        }

        // Fallback (normal incoming message)
        return [
          {
            id: msg._id,
            senderId: msg.senderId._id ?? msg.senderId,
            text: msg.text,
            image: msg.imageUrl,
            timestamp: msg.createdAt,
          },
          ...prev,
        ];
      });
    };

    socketClient.on("new_message", onNewMessage);

    return () => {
      socketClient.off("new_message", onNewMessage);
    };
  }, [chatId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-message-menu]")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!chatId) return;
    setMessages([]);
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const endpoint = API.CHAT.MESSAGES(chatId);
        const { data } = await axios.get(endpoint, {
          withCredentials: true,
        });

        const messagesPayload = data?.messages ?? data?.data?.messages ?? [];

        console.log("RAW MESSAGE RESPONSE:", messagesPayload);

        const rawMessages = Array.isArray(messagesPayload)
          ? messagesPayload
          : [];

        if (rawMessages.length > 0) {
          const normalizedMessages = rawMessages.map((msg) => ({
            id: msg._id,
            senderId:
              typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId,
            sender: msg.senderId,
            text: msg.text || "",
            image: msg.imageUrl || null,
            timestamp: msg.createdAt,
          }));

          setMessages(
            normalizedMessages.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            )
          );
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;

    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();

    return currentDate !== prevDate;
  };

  const handleUnsendMessage = (messageId) => {
    socketClient.deleteMessage(messageId, chatId);
  };

  useEffect(() => {
    const onDeleted = ({ messageId, chatId: deletedChatId }) => {
      if (deletedChatId !== chatId) return;
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    };

    socketClient.on("message_deleted", onDeleted);
    return () => socketClient.off("message_deleted", onDeleted);
  }, [chatId]);

  const MessageBubble = ({ message, isOwn, index }) => (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      } mb-4 group relative`}
      onContextMenu={(e) => {
        if (!isOwn) return;
        e.preventDefault();
        setOpenMenuId(message.id);
      }}
    >
      {/* ACTION BUTTONS — only for own messages, hover only */}
      {isOwn && (
        <div
          className={`relative mr-2 self-start transition-opacity duration-200 flex items-center gap-2
                         ${
                           openMenuId === message.id
                             ? "opacity-100"
                             : "opacity-0 group-hover:opacity-100"
                         }
                    `}
        >
          {/* 3 DOTS BUTTON */}
          <div data-message-menu className="relative">
            {" "}
            <button
              onMouseEnter={() => {
                setHoverMenuId(message.id);
              }}
              onMouseLeave={() => {
                setHoverMenuId(null);
              }}
              onClick={() =>
                setOpenMenuId(openMenuId === message.id ? null : message.id)
              }
              className="w-8 h-8 flex items-center justify-center rounded-full
    text-gray-400 dark:text-neutral-400
    hover:text-black dark:hover:text-white
    hover:bg-black/10 dark:hover:bg-white/10
    transition-colors duration-150"
            >
              ⋮
            </button>
            {hoverMenuId === message.id && openMenuId !== message.id && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    bg-gray-200 dark:bg-neutral-900
    text-gray-700 dark:text-neutral-200
    text-xs px-2 py-1 rounded-md
    shadow-lg whitespace-nowrap pointer-events-none"
              >
                More
              </div>
            )}
            {/* MENU */}
            {openMenuId === message.id && (
              <div className=" absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-[#262626] rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.65)] text-sm z-50 min-w-[180px] overflow-hidden ">
                {/* Timestamp */}
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-neutral-400 text-center">
                  {" "}
                  {formatTime(message.timestamp)}
                </div>

                <div className="h-px bg-black/10 dark:bg-white/10" />
                {/* Copy */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(message.text || "");
                    setOpenMenuId(null);
                  }}
                  className="w-full px-4 py-3 text-left text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  Copy
                </button>

                {/* Unsend */}
                <button
                  onClick={() => {
                    handleUnsendMessage(message.id);
                    setOpenMenuId(null);
                  }}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  Unsend
                </button>
              </div>
            )}
          </div>

          {/* REPLY BUTTON */}
          <div className="relative group/reply">
            <button
              className=" w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-150 "
              aria-label="Reply"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17l-5-5 5-5M4 12h11a4 4 0 014 4v1"
                />
              </svg>
            </button>

            {/* TOOLTIP */}

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover/reply:opacity-100 transition-opacity duration-150  whitespace-nowrap pointer-events-none">
              Reply
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE */}
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
              : "bg-gray-200 dark:bg-neutral-800 text-black dark:text-white rounded-bl-none"
          }`}
        >
          {/* 🔽 MESSAGE CONTENT — UNCHANGED */}
          {message.text && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-break-word">
              {message.text}
            </p>
          )}

          {message.image && (
            <img
              src={message.image}
              alt="Shared"
              className="mt-2 rounded-lg cursor-pointer"
            />
          )}

          {message.emoji && <div className="text-3xl">{message.emoji}</div>}
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
      <div className="bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 px-3 py-1 rounded-full text-xs font-medium">
        {formatDate(date)}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
        <p className="mt-4 text-gray-400 dark:text-neutral-400">
          Loading messages...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 py-6 bg-white dark:bg-neutral-950 flex flex-col-reverse space-y-reverse space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-800 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
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
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            No messages yet
          </h3>
          <p className="text-gray-400 dark:text-neutral-400 max-w-sm">
            Start the conversation by sending your first message!
          </p>
        </motion.div>
      ) : (
        <>
          {messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId;
            const showDateSeparator = shouldShowDateSeparator(
              message,
              messages[index - 1]
            );

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <DateSeparator date={message.timestamp} />
                )}
                <MessageBubble message={message} isOwn={isOwn} index={index} />
              </div>
            );
          })}
        </>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

// src/components/ChatMessages.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socketClient from "@/lib/socket-client";
import { API } from "@/config";
import { createPortal } from "react-dom";
import axios from "axios";

export default function ChatMessages({ chatId, currentUserId, onReply }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [hoverMenuId, setHoverMenuId] = useState(null);
  const hoverTimerRef = useRef(null);
  const [bottomSheetMessage, setBottomSheetMessage] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const isFetchingMoreRef = useRef(false);

  // ✅ Helper function to calculate message status
  const getMessageStatus = (message) => {
    // If message has optimistic flag, use its status
    if (message.optimistic) {
      return message.status || "sending";
    }

    // Check if message is from current user
    const isOwnMessage = message.senderId === currentUserId;
    if (!isOwnMessage) return null; // Other user's messages don't show status

    // Check readBy array
    if (message.readBy && message.readBy.length > 0) {
      return "read";
    }

    // Check deliveredTo array
    if (message.deliveredTo && message.deliveredTo.length > 0) {
      return "delivered";
    }

    // Check status field as fallback
    return message.status || "sent";
  };

  const fetchOlderMessages = async () => {
    if (!nextCursor || !hasMore || isFetchingMoreRef.current) return;

    isFetchingMoreRef.current = true;
    setIsFetchingMore(true);

    const container = messagesContainerRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;

    try {
      const { data } = await axios.get(
        `${API.CHAT.MESSAGES(chatId)}?cursor=${nextCursor}&limit=20`,
        { withCredentials: true },
      );

      const messagesPayload = data?.messages ?? data?.data?.messages ?? [];
      const rawMessages = Array.isArray(messagesPayload) ? messagesPayload : [];

      if (rawMessages.length > 0) {
        const olderMessages = rawMessages.map((msg) => ({
          id: msg._id,
          senderId:
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId,
          sender: msg.senderId,
          text: msg.text || "",
          images:
            msg.images?.length > 0
              ? msg.images
              : msg.imageUrl
                ? [{ url: msg.imageUrl }]
                : [],
          timestamp: msg.createdAt,
          readBy: msg.readBy || [],
          deliveredTo: msg.deliveredTo || [],
          status: msg.status,
          replyTo: msg.replyTo || null,
        }));

        setMessages((prev) => [...prev, ...olderMessages]);

        // Restore scroll position so viewport doesn't jump
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop += container.scrollHeight - prevScrollHeight;
          }
        });
      }

      setNextCursor(data?.nextCursor ?? null);
      setHasMore(data?.hasMore ?? false);
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
    } finally {
      isFetchingMoreRef.current = false;
      setIsFetchingMore(false);
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserScrolled(!isNearBottom);

      // Top detection — fetch older messages
      if (scrollTop < 100 && hasMore && !isFetchingMoreRef.current) {
        fetchOlderMessages();
      }
    }
  };

  const handleRetryMessage = async (tempId) => {
    const message = messages.find((m) => m.tempId === tempId);
    if (!message) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.tempId === tempId ? { ...msg, status: "sending" } : msg,
      ),
    );

    try {
      const formData = new FormData();
      formData.append("text", message.text);

      await axios.post(API.CHAT.MESSAGES(chatId), formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Retry failed:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, status: "failed" } : msg,
        ),
      );
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.detail.chatId !== chatId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.tempId === e.detail.tempId)) return prev;
        return [
          {
            id: e.detail.tempId,
            tempId: e.detail.tempId,
            chatId: e.detail.chatId,
            senderId: currentUserId,
            text: e.detail.text,
            images: e.detail.images || [],
            timestamp: new Date().toISOString(),
            optimistic: true,
            status: e.detail.status || "sending",
            readBy: [],
            deliveredTo: [],
          },
          ...prev,
        ];
      });
    };

    window.addEventListener("optimistic-message", handler);
    return () => window.removeEventListener("optimistic-message", handler);
  }, [chatId, currentUserId]);

  useEffect(() => {
    const handler = (e) => {
      const { tempId, messageId, status } = e.detail;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.tempId === tempId) {
            return {
              ...msg,
              id: messageId,
              status: status || "sent",
              optimistic: false,
            };
          }
          return msg;
        }),
      );
    };

    window.addEventListener("message-confirmed", handler);
    return () => window.removeEventListener("message-confirmed", handler);
  }, [chatId]);

  // ✅ FIXED: Listen to delivery confirmations
  useEffect(() => {
    const onMessagesDelivered = (payload) => {
      if (payload.chatId !== chatId) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (payload.messageIds.includes(msg.id)) {
            return {
              ...msg,
              deliveredTo: [
                ...(msg.deliveredTo || []),
                {
                  userId: payload.userId,
                  deliveredAt: payload.deliveredAt || new Date(),
                },
              ],
              status: "delivered",
            };
          }
          return msg;
        }),
      );
    };

    socketClient.on("messages_delivered", onMessagesDelivered);
    return () => socketClient.off("messages_delivered", onMessagesDelivered);
  }, [chatId]);

  // Listen to read confirmations (but only for OTHER users' read receipts)
  useEffect(() => {
    const onMessagesRead = (payload) => {
      if (payload.chatId !== chatId) return;

      // ✅ KEY: Only update if the read is from the OTHER user, not from current user
      if (payload.userId === currentUserId) {
        return; // Don't update UI for our own read receipts
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (payload.messageIds.includes(msg.id)) {
            return {
              ...msg,
              readBy: [
                ...(msg.readBy || []),
                {
                  userId: payload.userId,
                  readAt: payload.readAt || new Date(),
                },
              ],
              status: "read",
            };
          }
          return msg;
        }),
      );
    };

    socketClient.on("messages_read", onMessagesRead);
    return () => socketClient.off("messages_read", onMessagesRead);
  }, [chatId, currentUserId]);

  const prevChatIdRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    if (prevChatIdRef.current && prevChatIdRef.current !== chatId) {
      socketClient.leaveChat(prevChatIdRef.current);
    }

    socketClient.joinChat(chatId);
    prevChatIdRef.current = chatId;

    const onNewMessage = (payload) => {
      if (payload.chatId !== chatId) return;

      const incomingMessages = Array.isArray(payload.messages)
        ? payload.messages
        : [];

      if (incomingMessages.length === 0) return;

      setMessages((prev) => {
        let next = [...prev];

        incomingMessages.forEach((msg) => {
          // Check if message already exists (dedup)
          if (next.some((m) => m.id === msg._id)) {
            return; // Skip if already in list
          }

          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

          // Remove optimistic message from current user
          if (senderId === currentUserId) {
            next = next.filter((m) => {
              if (m.optimistic && m.senderId === currentUserId) {
                return false;
              }
              return true;
            });
          }

          next.unshift({
            id: msg._id,
            senderId: senderId,
            sender: msg.senderId,
            text: msg.text || "",
            images:
              msg.images?.length > 0
                ? msg.images
                : msg.imageUrl
                  ? [{ url: msg.imageUrl }]
                  : [],
            timestamp: msg.createdAt,
            optimistic: false,
            status: msg.status || "sent",
            readBy: msg.readBy || [],
            deliveredTo: msg.deliveredTo || [],
            replyTo: msg.replyTo || null,
          });
        });

        return next;
      });

      // Auto-mark received messages as delivered
      const otherUserMessages = incomingMessages.filter((msg) => {
        const senderId =
          typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
        return senderId !== currentUserId;
      });

      if (otherUserMessages.length > 0) {
        const messageIds = otherUserMessages.map((m) => m._id);
        socketClient.emit("mark_delivered", { messageIds, chatId });
      }
    };

    socketClient.on("new_message", onNewMessage);

    return () => {
      socketClient.off("new_message", onNewMessage);
    };
  }, [chatId, currentUserId]);

  useEffect(() => {
    const handler = (e) => {
      const { tempId } = e.detail;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId
            ? { ...msg, status: "failed", optimistic: true }
            : msg,
        ),
      );
    };

    window.addEventListener("message-failed", handler);
    return () => window.removeEventListener("message-failed", handler);
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
    const handleQueuedMessages = (e) => {
      const msgData = e.detail;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msgData.messages?.[0]?._id)) {
          return prev;
        }

        const newMessages =
          msgData.messages?.map((msg) => ({
            id: msg._id,
            senderId:
              typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId,
            sender: msg.senderId,
            text: msg.text || "",
            images:
              msg.images?.length > 0
                ? msg.images
                : msg.imageUrl
                  ? [{ url: msg.imageUrl }]
                  : [],
            timestamp: msg.createdAt,
            optimistic: false,
            readBy: msg.readBy || [],
            deliveredTo: msg.deliveredTo || [],
          })) || [];

        return [...prev, ...newMessages].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        );
      });
    };

    window.addEventListener("queued-message-received", handleQueuedMessages);
    return () =>
      window.removeEventListener(
        "queued-message-received",
        handleQueuedMessages,
      );
  }, [chatId]);

  // FIXED: Fetch messages with proper status tracking
  useEffect(() => {
    if (!chatId) return;
    setMessages([]);
    setNextCursor(null);
    setHasMore(false);
    setIsFetchingMore(false);
    isFetchingMoreRef.current = false;
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const endpoint = API.CHAT.MESSAGES(chatId);
        const { data } = await axios.get(endpoint, {
          withCredentials: true,
        });

        const messagesPayload = data?.messages ?? data?.data?.messages ?? [];
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
            images:
              msg.images?.length > 0
                ? msg.images
                : msg.imageUrl
                  ? [{ url: msg.imageUrl }]
                  : [],
            timestamp: msg.createdAt,
            readBy: msg.readBy || [],
            deliveredTo: msg.deliveredTo || [],
            status: msg.status,
            replyTo: msg.replyTo || null,
          }));

          setMessages(
            normalizedMessages.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
            ),
          );
          setNextCursor(data?.nextCursor ?? null);
          setHasMore(data?.hasMore ?? false);

          // ✅ Mark unread messages as delivered
          const unreadMessageIds = rawMessages
            .filter(
              (msg) =>
                msg.senderId !== currentUserId &&
                !msg.deliveredTo?.some((d) => d.userId === currentUserId),
            )
            .map((msg) => msg._id);

          if (unreadMessageIds.length > 0) {
            socketClient.emit("mark_delivered", {
              messageIds: unreadMessageIds,
              chatId,
            });
          }

          // ✅ NEW: Mark all other user's messages as read when opening chat
          const allOtherUserMessages = rawMessages
            .filter((msg) => msg.senderId !== currentUserId)
            .map((msg) => msg._id);

          if (allOtherUserMessages.length > 0) {
            socketClient.emit("mark_as_read", {
              messageIds: allOtherUserMessages,
              chatId,
            });
          }
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
  }, [chatId, currentUserId]);

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

  const shouldShowDateSeparator = (currentMsg, nextMsg) => {
    if (!nextMsg) return true;

    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const nextDate = new Date(nextMsg.timestamp).toDateString();

    return currentDate !== nextDate;
  };

  const handleUnsendMessage = async (messageId) => {
    try {
      await axios.delete(
        `${API.CHAT.MESSAGES(chatId)}?messageId=${messageId}`,
        {
          withCredentials: true,
        },
      );

      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onDeleted = ({ messageId, chatId: deletedChatId }) => {
      if (deletedChatId !== chatId) return;
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    };

    socketClient.on("message_deleted", onDeleted);
    return () => socketClient.off("message_deleted", onDeleted);
  }, [chatId]);

  const Lightbox = ({ images, startIndex, onClose }) => {
    const [current, setCurrent] = useState(startIndex);

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowRight")
          setCurrent((p) => Math.min(p + 1, images.length - 1));
        if (e.key === "ArrowLeft") setCurrent((p) => Math.max(p - 1, 0));
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [images.length, onClose]);

    return createPortal(
      <div
        className="fixed inset-0 z-9999 bg-black bg-opacity-95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10">
          {current + 1} / {images.length}
        </div>

        {/* Left arrow */}
        {current > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((p) => p - 1);
            }}
            className="absolute left-4 text-white/70 hover:text-white z-10 p-2"
          >
            <svg
              className="w-8 h-8"
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
        )}

        {/* Image */}
        <img
          src={images[current].url}
          alt={`Image ${current + 1}`}
          className="max-h-screen max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Right arrow */}
        {current < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((p) => p + 1);
            }}
            className="absolute right-4 text-white/70 hover:text-white z-10 p-2"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Bottom thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`w-10 h-10 rounded overflow-hidden border-2 transition-all ${
                  i === current ? "border-white" : "border-white/30"
                }`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>,
      document.body,
    );
  };

  const ImageGrid = ({ images, isOwn }) => {
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const total = images.length;
    const visibleImages = images.slice(0, 4);
    const remaining = total - 4;

    const gap = "gap-0.5";

    const imgClass = "w-full h-full object-cover cursor-pointer";

    const renderCell = (img, index, heightClass) => {
      const isLastVisible = index === 3 && remaining > 0;
      return (
        <div
          key={index}
          className={`relative overflow-hidden ${heightClass} ${lightboxIndex !== null ? "pointer-events-none" : ""}`}
          onClick={() => setLightboxIndex(index)}
        >
          <img src={img.url} alt={`Image ${index + 1}`} className={imgClass} />
          {isLastVisible && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
              <span className="text-white text-xl font-semibold">
                +{remaining + 1}
              </span>
            </div>
          )}
        </div>
      );
    };

    let gridContent;

    if (total === 1) {
      gridContent = (
        <div className="w-full max-h-72 overflow-hidden rounded-md">
          {renderCell(images[0], 0, "h-72")}
        </div>
      );
    } else if (total === 2) {
      gridContent = (
        <div className={`grid grid-cols-2 ${gap} rounded-md overflow-hidden`}>
          {visibleImages.map((img, i) => renderCell(img, i, "h-40"))}
        </div>
      );
    } else if (total === 3) {
      gridContent = (
        <div className={`grid grid-cols-2 ${gap} rounded-md overflow-hidden`}>
          <div className="row-span-2">
            {renderCell(images[0], 0, "h-full min-h-[160px]")}
          </div>
          {renderCell(images[1], 1, "h-20")}
          {renderCell(images[2], 2, "h-20")}
        </div>
      );
    } else {
      // 4 or more — 2x2 grid, 4th slot gets +N overlay
      gridContent = (
        <div className={`grid grid-cols-2 ${gap} rounded-md overflow-hidden`}>
          {visibleImages.map((img, i) => renderCell(img, i, "h-32"))}
        </div>
      );
    }

    return (
      <>
        <div className="w-full" data-lightbox-open={lightboxIndex !== null}>
          {gridContent}
        </div>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </>
    );
  };
  //  MessageBubble with proper status
  const MessageBubble = ({ message, isOwn, index }) => {
    const messageStatus = getMessageStatus(message);

    // Only show status for own messages, and only on the latest one
    const isLatestOwnMessage =
      isOwn &&
      !messages.some(
        (m) =>
          m.senderId === currentUserId &&
          new Date(m.timestamp) > new Date(message.timestamp),
      );

    // Check if this is the latest message from OTHER user
    const isLatestOtherMessage =
      !isOwn &&
      !messages.some(
        (m) =>
          m.senderId !== currentUserId &&
          new Date(m.timestamp) > new Date(message.timestamp),
      );

    // Check if current user has read this message
    const isReadByCurrentUser = message.readBy?.some(
      (r) => r.userId === currentUserId,
    );

    const getTimeSinceMessage = () => {
      const now = new Date();
      const messageTime = new Date(message.timestamp);
      const diffMinutes = Math.floor((now - messageTime) / (1000 * 60));

      if (diffMinutes < 1) return "now";
      if (diffMinutes < 60) return `${diffMinutes}m`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
      return `${Math.floor(diffMinutes / 1440)}d`;
    };

    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, height: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group relative`}
        onContextMenu={(e) => {
          e.preventDefault();
          setBottomSheetMessage(message);
        }}
      >
        {isOwn && (
          <div
            className={`relative mr-2 self-center transition-opacity duration-200 hidden lg:flex items-center gap-2                         ${
              openMenuId === message.id
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }
                    `}
          >
            <div data-message-menu className="relative">
              <button
                onMouseEnter={() => setHoverMenuId(message.id)}
                onMouseLeave={() => setHoverMenuId(null)}
                onClick={() =>
                  setOpenMenuId(openMenuId === message.id ? null : message.id)
                }
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10transition-colors duration-150"
              >
                ⋮
              </button>
              {hoverMenuId === message.id && openMenuId !== message.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap pointer-events-none">
                  More
                </div>
              )}
              {openMenuId === message.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-[#262626] rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.65)] text-sm z-50 min-w-45 overflow-hidden">
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-neutral-400 text-center">
                    {formatTime(message.timestamp)}
                  </div>

                  <div className="h-px bg-black/10 dark:bg-white/10" />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(message.text || "");
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-3 text-left text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    Copy
                  </button>

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

            <div className="relative group/reply">
              <button
                onClick={() => onReply(message)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-150"
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

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover/reply:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
                Reply
              </div>
            </div>
          </div>
        )}
        {!isOwn && (
          <div className="relative ml-2 self-center transition-opacity duration-200 hidden lg:flex items-center gap-2 order-2 opacity-0 group-hover:opacity-100">
            <div className="relative group/reply">
              <button
                onClick={() => onReply(message)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-150"
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
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover/reply:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
                Reply
              </div>
            </div>

            <div className="relative group/copy">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(message.text || "")
                }
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-150"
                aria-label="Copy"
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover/copy:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
                Copy
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex flex-col ${
            isOwn ? "order-2 items-end" : "order-1 items-start"
          }`}
        >
          <div
            className={`${message.images?.length > 0 ? "max-w-xs lg:max-w-md xl:max-w-lg" : "max-w-xs lg:max-w-md xl:max-w-lg"}`}
          >
            <motion.div
              whileHover={false}
              className={`relative rounded-2xl wrap-break-word overflow-hidden border ${
                isOwn
                  ? "bg-[#3797F0] text-white border-blue-500"
                  : "bg-gray-200 dark:bg-[#1F1F1F] text-black dark:text-white border-gray-300 dark:border-neutral-600"
              }`}
            >
              {message.replyTo && (
                <div
                  className={`mx-2 mt-2 mb-1 px-3 py-2 rounded-xl border-l-4 ${
                    isOwn
                      ? "bg-blue-600/40 border-white/50"
                      : "bg-gray-300/60 dark:bg-neutral-700/60 border-gray-500 dark:border-neutral-500"
                  }`}
                >
                  {message.replyTo.images?.length > 0 && (
                    <img
                      src={message.replyTo.images[0].url}
                      className="w-10 h-10 rounded object-cover mb-1"
                      alt="replied image"
                    />
                  )}
                  <p
                    className={`text-xs truncate ${isOwn ? "text-white/80" : "text-gray-600 dark:text-neutral-400"}`}
                  >
                    {message.replyTo.text || "Image"}
                  </p>
                </div>
              )}

              {message.images?.length > 0 && (
                <div className={`-m-2 ${message.text ? "pb-2" : ""}`}>
                  <ImageGrid images={message.images} isOwn={isOwn} />
                </div>
              )}

              {message.text && (
                <p
                  className={`whitespace-pre-wrap text-sm leading-relaxed wrap-break-words px-4 py-2`}
                >
                  {message.text}
                </p>
              )}
            </motion.div>
          </div>

          {/* READ RECEIPT */}
          {isLatestOwnMessage && messageStatus && (
            <div className="mt-1 ml-2 text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-1.5">
              {messageStatus === "sending" && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-2.5 h-2.5 border border-gray-400 dark:border-neutral-500 border-t-transparent rounded-full"
                  />
                  <span>Sending</span>
                </>
              )}
              {messageStatus === "sent" && (
                <>
                  <span>Sent</span>
                  <span className="text-gray-400 dark:text-neutral-500">
                    · {getTimeSinceMessage()}
                  </span>
                </>
              )}
              {messageStatus === "delivered" && (
                <>
                  <span>Sent</span>
                  <span className="text-gray-400 dark:text-neutral-500">
                    · {getTimeSinceMessage()}
                  </span>
                </>
              )}
              {messageStatus === "read" && (
                <>
                  <span className="text-blue-500 font-medium">Seen</span>
                  <span className="text-gray-400 dark:text-neutral-500">
                    · {getTimeSinceMessage()}
                  </span>
                </>
              )}
              {messageStatus === "failed" && (
                <span className="text-red-500 flex items-center gap-1">
                  <span>✗ Failed to send</span>
                  <button
                    onClick={() => handleRetryMessage(message.tempId)}
                    className="text-blue-500 hover:underline ml-1"
                  >
                    Retry
                  </button>
                </span>
              )}
            </div>
          )}

          {/* ✅ Show timestamp on OTHER user's latest message (1-to-1 chat style) */}
          {isLatestOtherMessage && (
            <div className="mt-1 mr-2 text-[11px] text-gray-400 dark:text-neutral-500">
              {getTimeSinceMessage()}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

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
      className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-6 bg-white dark:bg-neutral-950 flex flex-col-reverse space-y-reverse space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-800 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full"
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
              messages[index + 1],
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

      {isFetchingMore && (
        <div className="flex justify-center py-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      )}

      <div ref={messagesEndRef} />
      {bottomSheetMessage && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 lg:hidden"
          onClick={() => setBottomSheetMessage(null)}
        >
          <div
            className="w-full bg-white dark:bg-neutral-900 rounded-t-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 dark:bg-neutral-700 rounded-full mx-auto mt-3 mb-4" />

            <button
              onClick={() => {
                onReply(bottomSheetMessage);
                setBottomSheetMessage(null);
              }}
              className="w-full px-6 py-4 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-b border-gray-200 dark:border-neutral-800 text-sm font-medium"
            >
              Reply
            </button>

            {bottomSheetMessage.text && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(bottomSheetMessage.text);
                  setBottomSheetMessage(null);
                }}
                className="w-full px-6 py-4 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-b border-gray-200 dark:border-neutral-800 text-sm font-medium"
              >
                Copy
              </button>
            )}

            {bottomSheetMessage.senderId === currentUserId && (
              <button
                onClick={() => {
                  handleUnsendMessage(bottomSheetMessage.id);
                  setBottomSheetMessage(null);
                }}
                className="w-full px-6 py-4 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                Unsend
              </button>
            )}

            <button
              onClick={() => setBottomSheetMessage(null)}
              className="w-full px-6 py-4 text-left text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium border-t border-gray-200 dark:border-neutral-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

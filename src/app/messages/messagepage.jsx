"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import ChatHeader from "@/Components/ChatHeader";
import ChatMessages from "@/Components/ChatMessages";
import ChatInput from "@/Components/ChatInput";
import { useUser } from "@/context/UserContext";
import socketClient from "@/lib/socket-client";
import TypingIndicator from "@/Components/TypingIndicator";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { API } from "@/config";

export default function MessagePage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // NOTE: This holds the active conversation summary (not just a user)
  const [activeChatParticipant, setActiveChatParticipant] = useState(null);
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [archiveSearchQuery, setArchiveSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const viewerType = user?.role;

  // Account switcher states
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [switchingUserId, setSwitchingUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("messages");
  const dropdownRef = useRef(null);

  const [convMenuId, setConvMenuId] = useState(null);
  const [convBottomSheet, setConvBottomSheet] = useState(null);
  const [showConvDeleteModal, setShowConvDeleteModal] = useState(false);
  const [showConvArchiveModal, setShowConvArchiveModal] = useState(false);
  const [showConvUnarchiveModal, setShowConvUnarchiveModal] = useState(false);
  const [showConvBlockModal, setShowConvBlockModal] = useState(false);
  const [selectedConv, setSelectedConv] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const convMenuRef = useRef(null);
  const [archivedConversations, setArchivedConversations] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!viewerType) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 dark:text-neutral-400">
        Loading messages...
      </div>
    );
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    socketClient.connect();
  }, []);

  // Fetch linked accounts
  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };

    if (showAccountDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountDropdown]);

  const fetchLinkedAccounts = async () => {
    try {
      const response = await axios.get(API.ACCOUNTS.LINKED, {
        withCredentials: true,
      });
      const accounts = response.data.accounts || [];

      // Filter only active accounts (no deactivated/deleted)
      const activeAccounts = accounts.filter(
        (acc) => acc.isActive && !acc.isDeleted,
      );

      // Sort: current account first, then others
      const sortedAccounts = activeAccounts.sort((a, b) => {
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;
        return 0;
      });

      setLinkedAccounts(sortedAccounts);
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
    }
  };

  const handleSwitchAccount = async (userId) => {
    if (switchingUserId) return; // Prevent multiple clicks

    try {
      setSwitchingUserId(userId);

      await axios.post(
        API.ACCOUNTS.SWITCH,
        { userId },
        { withCredentials: true },
      );

      // Close dropdown
      setShowAccountDropdown(false);

      // Redirect to messages page (will reload with new account)
      window.location.href = "/messages";
    } catch (error) {
      console.error("Error switching account:", error);
      setSwitchingUserId(null);
    }
  };

  const getOtherParticipant = (chat) => {
    if (!chat || !user?._id) return null;

    return chat.participants
      ?.map((p) => p.userId)
      ?.find((u) => u._id !== user._id);
  };

  useEffect(() => {
    const onTyping = ({ chatId: incomingChatId, isTyping }) => {
      if (incomingChatId === selectedChatId) {
        setTyping(isTyping);
      }
    };

    socketClient.on("typing_status", onTyping);
    return () => socketClient.off("typing_status", onTyping);
  }, [selectedChatId]);

  useEffect(() => {
    setTyping(false);
  }, [selectedChatId]);

  // Define fetchConversations outside useEffect so it can be reused
  const fetchConversations = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        viewerType === "admin"
          ? API.CHAT.MESSAGES_CHATS
          : API.CHAT.MESSAGES_USERS_CHATS(user._id),
        { withCredentials: true },
      );

      const chats = data?.data?.chats || [];

      setConversations(chats);

      // sync activeChatParticipant if a chat is open
      if (selectedChatId) {
        const activeChat = chats.find((c) => c._id === selectedChatId);
        if (activeChat) {
          const otherParticipant = getOtherParticipant(activeChat);
          if (otherParticipant) {
            setActiveChatParticipant({
              ...otherParticipant,
              isBlockedByMe: activeChat.isBlockedByMe || false,
              isBlockedByAdmin: activeChat.isBlockedByAdmin || false,
            });
          }
        }
      }
      // END OF ADDED BLOCK
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Call it on mount
  useEffect(() => {
    if (!user?._id) return;
    fetchConversations();
  }, [viewerType, user?._id]);

  const fetchArchivedConversations = async () => {
    if (!user?._id) return;
    try {
      setArchivedLoading(true);
      const { data } = await axios.get(
        `${API.CHAT.MESSAGES_CHATS}?archived=true`,
        { withCredentials: true },
      );
      const chats = data?.data?.chats || [];
      setArchivedConversations(chats);
    } catch (error) {
      console.error("Failed to fetch archived conversations:", error);
    } finally {
      setArchivedLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (convMenuRef.current && !convMenuRef.current.contains(event.target)) {
        setConvMenuId(null);
      }
    };

    if (convMenuId) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [convMenuId]);

  // Auto-open chat from notification
  useEffect(() => {
    const userId = searchParams.get("userId");

    if (userId && conversations.length > 0 && !loading) {
      // Find the conversation with this specific user
      const targetChat = conversations.find((conv) => {
        const other = getOtherParticipant(conv);
        return other?._id === userId;
      });

      if (targetChat) {
        handleSelectConversation(targetChat);
      }
    }
  }, [searchParams, conversations, loading]);

  const handleSelectConversation = (conversation) => {
    if (
      showConvArchiveModal ||
      showConvDeleteModal ||
      showConvBlockModal ||
      showConvUnarchiveModal
    )
      return;
    setSelectedChatId(conversation._id);
    const otherParticipant = getOtherParticipant(conversation);
    setActiveChatParticipant({
      ...otherParticipant,
      isBlockedByMe: conversation.isBlockedByMe || false,
      isBlockedByAdmin: conversation.isBlockedByAdmin || false,
    });
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    setActiveChatParticipant(null);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!conv) return false;
    const other = getOtherParticipant(conv);
    const query = searchQuery.toLowerCase();
    return (
      (other?.name || "").toLowerCase().includes(query) ||
      (other?.username || "").toLowerCase().includes(query)
    );
  });

  const filteredArchivedConversations = archivedConversations.filter((conv) => {
    if (!conv) return false;
    const other = getOtherParticipant(conv);
    const query = archiveSearchQuery.toLowerCase();
    return (
      (other?.name || "").toLowerCase().includes(query) ||
      (other?.username || "").toLowerCase().includes(query)
    );
  });

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return `${Math.floor(diffMinutes / 1440)}d`;
  };

  const handleConvDelete = async () => {
    if (!selectedConv) return;
    try {
      setIsSubmitting(true);
      await axios.delete(API.CHAT.MESSAGES_DELETE(selectedConv._id), {
        withCredentials: true,
      });
      setShowConvDeleteModal(false);
      setSelectedConv(null);
      if (selectedChatId === selectedConv._id) {
        setSelectedChatId(null);
        setActiveChatParticipant(null);
      }
      showSuccess("Chat deleted");
      fetchConversations();
    } catch (error) {
      console.error("Failed to delete chat:", error);
      showError("Failed to delete chat");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvArchive = async () => {
    if (!selectedConv) return;
    try {
      setIsSubmitting(true);
      await axios.patch(
        API.CHAT.MESSAGES_ARCHIVE(selectedConv._id),
        {},
        { withCredentials: true },
      );
      setShowConvArchiveModal(false);
      setSelectedConv(null);
      if (selectedChatId === selectedConv._id) {
        setSelectedChatId(null);
        setActiveChatParticipant(null);
      }
      showSuccess("Chat archived");
      fetchConversations();
    } catch (error) {
      console.error("Failed to archive chat:", error);
      showError("Failed to archive chat");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvUnarchive = async () => {
    if (!selectedConv) return;
    try {
      setIsSubmitting(true);
      await axios.delete(API.CHAT.MESSAGES_ARCHIVE(selectedConv._id), {
        withCredentials: true,
      });
      setShowConvUnarchiveModal(false);
      setSelectedConv(null);
      if (selectedChatId === selectedConv._id) {
        setSelectedChatId(null);
        setActiveChatParticipant(null);
      }
      showSuccess("Chat unarchived");
      fetchArchivedConversations();
      fetchConversations();
    } catch (error) {
      console.error("Failed to unarchive chat:", error);
      showError("Failed to unarchive chat");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvBlock = async () => {
    if (!selectedConv) return;
    const other = getOtherParticipant(selectedConv);
    try {
      setIsSubmitting(true);
      await axios.post(
        API.ADMIN.BLOCK_USER,
        { userId: other?._id },
        { withCredentials: true },
      );
      setShowConvBlockModal(false);
      setSelectedConv(null);
      showSuccess("User blocked");
      fetchConversations();
    } catch (error) {
      console.error("Failed to block user:", error);
      showError("Failed to block user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLongPressStart = (conv) => {
    const timer = setTimeout(() => {
      setSelectedConv(conv);
      setConvBottomSheet(conv);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

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
  return (
    <>
      <div className="h-screen flex bg-white dark:bg-neutral-950 text-black dark:text-white overflow-hidden relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
          />
        </div>

        {/* Sidebar - Conversations List */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`${
            isMobile && selectedChatId ? "hidden" : "flex"
          } ${isMobile ? "w-full" : "w-80"} bg-gray-100/50 dark:bg-neutral-900/50 backdrop-blur-md border-r border-gray-300 dark:border-neutral-800 flex-col z-20 relative`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-300 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Account Switcher Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg px-3 py-2 transition-colors group"
                  >
                    <h1 className="text-xl font-bold">
                      {user?.username || "User"}
                    </h1>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showAccountDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showAccountDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        {linkedAccounts.map((account) => {
                          const isCurrent = account.isCurrent;
                          const isSwitching = switchingUserId === account.id;

                          return (
                            <button
                              key={account.id}
                              onClick={() => {
                                if (!isCurrent) {
                                  handleSwitchAccount(account.id);
                                }
                              }}
                              disabled={isCurrent || isSwitching}
                              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                                isCurrent
                                  ? "bg-gray-100 dark:bg-neutral-800 cursor-default"
                                  : "hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
                              } ${isSwitching ? "opacity-50" : ""}`}
                            >
                              {/* Avatar */}
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                                {isSwitching ? (
                                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                                ) : account.profilePic ? (
                                  <img
                                    src={account.profilePic}
                                    alt={account.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-medium text-black dark:text-white">
                                    {account.username?.[0]?.toUpperCase()}
                                  </span>
                                )}
                              </div>

                              {/* Username */}
                              <span className="text-sm font-medium text-black dark:text-white truncate">
                                {account.username}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex items-center justify-between gap-6 mb-3">
              <button
                onClick={() => setActiveTab("messages")}
                className={`text-sm font-semibold ml-3 transition-colors ${
                  activeTab === "messages"
                    ? "text-black dark:text-white"
                    : "text-gray-400 dark:text-neutral-500"
                }`}
              >
                Messages
              </button>
              {viewerType === "admin" && (
                <button
                  onClick={() => {
                    setActiveTab("archives");
                    fetchArchivedConversations();
                  }}
                  className={`text-sm font-semibold mr-3 transition-colors ${
                    activeTab === "archives"
                      ? "text-black dark:text-white"
                      : "text-gray-400 dark:text-neutral-500"
                  }`}
                >
                  Archives
                </button>
              )}
            </div>
            {/* Search */}{" "}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search conversations"
                value={
                  activeTab === "archives" ? archiveSearchQuery : searchQuery
                }
                onChange={(e) =>
                  activeTab === "archives"
                    ? setArchiveSearchQuery(e.target.value)
                    : setSearchQuery(e.target.value)
                }
                className="w-full bg-gray-200 dark:bg-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder-gray-500 dark:placeholder-neutral-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-gray-400 dark:text-neutral-400 text-center">
                Loading...
              </div>
            ) : activeTab === "archives" ? (
              archivedLoading ? (
                <div className="p-4 text-gray-400 dark:text-neutral-400 text-center">
                  Loading...
                </div>
              ) : filteredArchivedConversations.length > 0 ? (
                filteredArchivedConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  return (
                    <motion.div
                      key={conv._id}
                      onClick={() => handleSelectConversation(conv)}
                      onTouchStart={() => handleLongPressStart(conv)}
                      onTouchEnd={handleLongPressEnd}
                      onTouchMove={handleLongPressEnd}
                      whileHover={{ backgroundColor: "rgba(64, 64, 64, 0.5)" }}
                      className={`w-full p-4 border-b border-gray-300 dark:border-neutral-800 text-left transition-colors group relative ${
                        selectedChatId === conv._id
                          ? "bg-gray-200 dark:bg-neutral-800"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={other?.avatar || "/avatar-placeholder.png"}
                          alt={other?.name || "User"}
                          onError={(e) => {
                            e.currentTarget.src = "/avatar-placeholder.png";
                          }}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {other?.name || "Unknown"}
                          </p>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className="text-xs text-gray-400 dark:text-neutral-400 truncate flex-1">
                              {conv.lastMessage?.text || "No messages yet"}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                              {/* 3-dot menu - desktop only */}
                              <div
                                className="relative hidden lg:block"
                                ref={convMenuRef}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConvMenuId(
                                      convMenuId === conv._id ? null : conv._id,
                                    );
                                    setSelectedConv(conv);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all"
                                >
                                  <svg
                                    className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                  </svg>
                                </button>

                                <AnimatePresence>
                                  {convMenuId === conv._id && (
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        scale: 0.95,
                                        y: -5,
                                      }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute right-0 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden z-50"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedConv(conv);
                                          setConvMenuId(null);
                                          setShowConvUnarchiveModal(true);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                      >
                                        Unarchive Chat
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedConv(conv);
                                          setConvMenuId(null);
                                          setShowConvDeleteModal(true);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-t border-gray-200 dark:border-neutral-700"
                                      >
                                        Delete Chat
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <span className="text-xs text-gray-500 dark:text-neutral-500 shrink-0">
                                {getRelativeTime(conv.lastMessage?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-4 text-gray-400 dark:text-neutral-400 text-center">
                  No archived chats
                </div>
              )
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                return (
                  <motion.div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    onTouchStart={() => handleLongPressStart(conv)}
                    onTouchEnd={handleLongPressEnd}
                    onTouchMove={handleLongPressEnd}
                    whileHover={{ backgroundColor: "rgba(64, 64, 64, 0.5)" }}
                    className={`w-full p-4 border-b border-gray-300 dark:border-neutral-800 text-left transition-colors group relative ${
                      selectedChatId === conv._id
                        ? "bg-gray-200 dark:bg-neutral-800"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={
                            !other?.isActive || conv.isBlockedByMe
                              ? "/avatar-placeholder.png"
                              : other?.avatar || "/avatar-placeholder.png"
                          }
                          alt={other?.name || "User"}
                          onError={(e) => {
                            e.currentTarget.src = "/avatar-placeholder.png";
                          }}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm truncate ${
                            !other?.isActive ||
                            other?.isDeleted ||
                            other?.isBlocked
                              ? "text-zinc-400 dark:text-zinc-600"
                              : ""
                          }`}
                        >
                          {other?.isDeleted
                            ? "Deleted User"
                            : !other?.isActive
                              ? "Deactivated"
                              : conv.isBlockedByMe || conv.isBlockedByAdmin
                                ? "User"
                                : other?.name || "Unknown"}
                        </p>
                        {(!other?.isActive || other?.isDeleted) && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-600">
                            @{other?.username || other?.email?.split("@")[0]}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-xs text-gray-400 dark:text-neutral-400 truncate flex-1">
                            {conv.lastMessage?.text || "No messages yet"}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            {/* 3-dot menu - desktop only */}
                            <div
                              className="relative hidden lg:block"
                              ref={convMenuRef}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConvMenuId(
                                    convMenuId === conv._id ? null : conv._id,
                                  );
                                  setSelectedConv(conv);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all"
                              >
                                <svg
                                  className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />{" "}
                                </svg>
                              </button>

                              {/* Dropdown */}
                              <AnimatePresence>
                                {convMenuId === conv._id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden z-50"
                                    style={{
                                      top: (() => {
                                        // Check if there's space below, otherwise open above
                                        const el = convMenuRef.current;
                                        if (!el) return "100%";
                                        const rect = el.getBoundingClientRect();
                                        const spaceBelow =
                                          window.innerHeight - rect.bottom;
                                        return spaceBelow < 150
                                          ? "auto"
                                          : "100%";
                                      })(),
                                      bottom: (() => {
                                        const el = convMenuRef.current;
                                        if (!el) return "auto";
                                        const rect = el.getBoundingClientRect();
                                        const spaceBelow =
                                          window.innerHeight - rect.bottom;
                                        return spaceBelow < 150
                                          ? "100%"
                                          : "auto";
                                      })(),
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Archive button */}
                                    {viewerType === "admin" && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedConv(conv);
                                          setConvMenuId(null);
                                          setShowConvArchiveModal(true);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                      >
                                        Archive Chat
                                      </button>
                                    )}

                                    {/* Block button */}
                                    {viewerType === "admin" && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedConv(conv);
                                          setConvMenuId(null);
                                          setShowConvBlockModal(true);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-t border-gray-200 dark:border-neutral-700"
                                      >
                                        Block
                                      </button>
                                    )}

                                    {/* delete button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedConv(conv);
                                        setConvMenuId(null);
                                        setShowConvDeleteModal(true);
                                      }}
                                      className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-t border-gray-200 dark:border-neutral-700"
                                    >
                                      Delete Chat
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <span className="text-xs text-gray-500 dark:text-neutral-500">
                              {getRelativeTime(conv.lastMessage?.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-4 text-gray-400 dark:text-neutral-400 text-center">
                No conversations found
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${
            isMobile && !selectedChatId ? "hidden" : "flex"
          } flex-1 flex-col relative z-10`}
        >
          {activeChatParticipant ? (
            <>
              <ChatHeader
                participant={activeChatParticipant}
                chatId={selectedChatId}
                viewerType={viewerType}
                isArchived={
                  [...conversations, ...archivedConversations].find(
                    (c) => c._id === selectedChatId,
                  )?.isArchived || false
                }
                onBack={handleBackToList}
                isMobile={isMobile}
                onChatDeleted={() => {
                  setSelectedChatId(null);
                  setActiveChatParticipant(null);
                  fetchConversations();
                }}
                onChatBlocked={() => {
                  fetchConversations();
                }}
                onChatArchived={() => {
                  fetchConversations();
                }}
              />
              <TypingIndicator
                show={typing}
                participant={activeChatParticipant}
              />
              <ChatMessages chatId={selectedChatId} currentUserId={user._id} />
              <ChatInput
                chatId={selectedChatId}
                participant={activeChatParticipant}
                onUserUnblocked={() => {
                  // Refresh conversations to update blocked status
                  fetchConversations();
                }}
              />{" "}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
                  Your Messages
                </h2>
                <p className="text-sm text-gray-400 dark:text-neutral-400">
                  Send a message to start a chat.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {/* Mobile Bottom Sheet */}
      {convBottomSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 lg:hidden"
          onClick={() => setConvBottomSheet(null)}
        >
          <div
            className="w-full bg-white dark:bg-neutral-900 rounded-t-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 dark:bg-neutral-700 rounded-full mx-auto mt-3 mb-4" />
            {viewerType === "admin" && (
              <button
                onClick={() => {
                  setConvBottomSheet(null);
                  setShowConvArchiveModal(true);
                }}
                className="w-full px-6 py-4 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-b border-gray-200 dark:border-neutral-800 text-sm font-medium"
              >
                Archive Chat
              </button>
            )}
            {viewerType === "admin" && (
              <button
                onClick={() => {
                  setConvBottomSheet(null);
                  setShowConvBlockModal(true);
                }}
                className="w-full px-6 py-4 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-b border-gray-200 dark:border-neutral-800 text-sm font-medium"
              >
                Block
              </button>
            )}
            <button
              onClick={() => {
                setConvBottomSheet(null);
                setShowConvDeleteModal(true);
              }}
              className="w-full px-6 py-4 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-b border-gray-200 dark:border-neutral-800 text-sm font-medium"
            >
              Delete Chat
            </button>
            <button
              onClick={() => setConvBottomSheet(null)}
              className="w-full px-6 py-4 text-left text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConvDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-black dark:text-white text-center">
                Delete Chat?
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center leading-relaxed">
                This action cannot be undone. All messages will be permanently
                deleted.
              </p>
            </div>
            <div className="flex flex-col">
              <button
                onClick={handleConvDelete}
                disabled={isSubmitting}
                className="w-full px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-b border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => {
                  setShowConvDeleteModal(false);
                  setSelectedConv(null);
                }}
                className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showConvArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-black dark:text-white text-center">
                Archive Chat?
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center leading-relaxed">
                This chat will be moved to your archived chats.
              </p>
            </div>
            <div className="flex flex-col">
              <button
                onClick={handleConvArchive}
                disabled={isSubmitting}
                className="w-full px-6 py-4 text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-b border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
              >
                {isSubmitting ? "Archiving..." : "Archive"}
              </button>
              <button
                onClick={() => {
                  setShowConvArchiveModal(false);
                  setSelectedConv(null);
                }}
                className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UnArchive Confirmation Modal */}
      {showConvUnarchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-black dark:text-white text-center">
                Unarchive Chat?
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center leading-relaxed">
                This chat will be moved back to your messages.
              </p>
            </div>
            <div className="flex flex-col">
              <button
                onClick={handleConvUnarchive}
                disabled={isSubmitting}
                className="w-full px-6 py-4 text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-b border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
              >
                {isSubmitting ? "Unarchiving..." : "Unarchive"}
              </button>
              <button
                onClick={() => {
                  setShowConvUnarchiveModal(false);
                  setSelectedConv(null);
                }}
                className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showConvBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-black dark:text-white text-center">
                Block {getOtherParticipant(selectedConv)?.name || "this user"}?
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center leading-relaxed">
                They won't be able to view your portfolio or send commercial
                messages.
              </p>
            </div>
            <div className="flex flex-col">
              <button
                onClick={handleConvBlock}
                disabled={isSubmitting}
                className="w-full px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-b border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
              >
                {isSubmitting ? "Blocking..." : "Block"}
              </button>
              <button
                onClick={() => {
                  setShowConvBlockModal(false);
                  setSelectedConv(null);
                }}
                className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
        </div>
      )}
    </>
  );
}

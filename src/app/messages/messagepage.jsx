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
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const viewerType = user?.role;

  // Account switcher states
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [switchingUserId, setSwitchingUserId] = useState(null);
  const dropdownRef = useRef(null);

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

      console.log("🔍 FETCHED CONVERSATIONS:", JSON.stringify(chats, null, 2));
      setConversations(chats);

      // ✅ ADD THIS BLOCK — sync activeChatParticipant if a chat is open
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
      // ✅ END OF ADDED BLOCK
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

  const filteredConversations = conversations.filter(
    (conv) =>
      conv &&
      (conv.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
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
        } w-80 bg-gray-100/50 dark:bg-neutral-900/50 backdrop-blur-md border-r border-gray-300 dark:border-neutral-800 flex-col z-20 relative`}
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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              console.log("OTHER:", other); // temperoary log
              return (
                <motion.button
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  whileHover={{ backgroundColor: "rgba(64, 64, 64, 0.5)" }}
                  className={`w-full p-4 border-b border-gray-300 dark:border-neutral-800 text-left transition-colors ${
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
                        alt={
                          other?.isDeleted
                            ? "Deleted User"
                            : !other?.isActive
                              ? "Deactivated"
                              : other?.isBlocked
                                ? "User"
                                : other?.name || "User"
                        }
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
                      <p className="text-xs text-gray-400 dark:text-neutral-400 truncate">
                        {conv.lastMessage?.text || "No messages yet"}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                        {conv.lastMessage?.createdAt
                          ? new Date(
                              conv.lastMessage.createdAt,
                            ).toLocaleTimeString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </motion.button>
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
  );
}

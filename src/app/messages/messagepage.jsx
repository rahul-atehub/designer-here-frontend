"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ChatHeader from "@/Components/ChatHeader";
import ChatMessages from "@/Components/ChatMessages";
import ChatInput from "@/Components/ChatInput";
import { useUser } from "@/context/UserContext";
import socketClient from "@/lib/socket-client";
import TypingIndicator from "@/Components/TypingIndicator";
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

  if (!viewerType) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 dark:text-neutral-400">
        Loading messages...
      </div>
    );
  }

  useEffect(() => {
    socketClient.connect();
  }, []);

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

  useEffect(() => {
    if (!user?._id) return;
    const fetchConversations = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          viewerType === "admin"
            ? API.CHAT.MESSAGES_CHATS // ADMIN backend file
            : API.CHAT.MESSAGES_USERS_CHATS(user._id), // USER backend file
          { withCredentials: true }
        );

        const chats = data?.data?.chats || [];

        setConversations(chats);

        if (chats.length > 0) {
          setSelectedChatId(chats[0]._id);
          setActiveChatParticipant(getOtherParticipant(chats[0]));
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [viewerType, user?._id]);

  const handleSelectConversation = (conversation) => {
    setSelectedChatId(conversation._id);
    setActiveChatParticipant(getOtherParticipant(conversation));
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv &&
      (conv.name || "").toLowerCase().includes(searchQuery.toLowerCase())
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
        className="w-80 bg-gray-100/50 dark:bg-neutral-900/50 backdrop-blur-md border-r border-gray-300 dark:border-neutral-800 flex flex-col z-20 relative"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-300 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
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
                        src={other?.avatar || "/avatar-placeholder.png"}
                        alt={other?.name || "User"}
                        onError={(e) => {
                          e.currentTarget.src = "/avatar-placeholder.png";
                        }}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {other?.name || "Unknown"}
                      </p>

                      <p className="text-xs text-gray-400 dark:text-neutral-400 truncate">
                        {conv.lastMessage?.text || "No messages yet"}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                        {conv.lastMessage?.createdAt
                          ? new Date(
                              conv.lastMessage.createdAt
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
        className="flex-1 flex flex-col relative z-10"
      >
        {activeChatParticipant ? (
          <>
            <ChatHeader participant={activeChatParticipant} />

            <TypingIndicator
              show={typing}
              participant={activeChatParticipant}
            />

            <ChatMessages chatId={selectedChatId} currentUserId={user._id} />

            <ChatInput chatId={selectedChatId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-400 dark:text-neutral-400 text-center">
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

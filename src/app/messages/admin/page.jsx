// src/app/messages/admin/page.jsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ChatHeader from "@/Components/ChatHeader";
import ChatMessages from "@/Components/ChatMessages";
import ChatInput from "@/Components/ChatInput";

export default function AdminChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch("/api/message/admin");
        const data = await response.json();

        if (data.conversations) {
          setConversations(data.conversations);
          if (data.conversations.length > 0) {
            setSelectedChatId(data.conversations[0].id);
            setSelectedConversation(data.conversations[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleParticipantUpdate = (participantData) => {
    if (selectedConversation) {
      setSelectedConversation((prev) => ({
        ...prev,
        ...participantData,
      }));
    }
  };

  const handleSendMessage = (message) => {
    setNewMessage(message);
    setTimeout(() => setNewMessage(null), 100);
  };

  const handleMessageUpdate = () => {
    // Trigger any necessary updates when messages change
  };

  const handleSelectConversation = (conversation) => {
    setSelectedChatId(conversation.id);
    setSelectedConversation(conversation);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-neutral-950 text-white overflow-hidden relative">
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
        className="w-80 bg-neutral-900/50 backdrop-blur-md border-r border-neutral-800 flex flex-col z-20 relative"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-neutral-400 text-center">Loading...</div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <motion.button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                whileHover={{ backgroundColor: "rgba(64, 64, 64, 0.5)" }}
                className={`w-full p-4 border-b border-neutral-800 text-left transition-colors ${
                  selectedChatId === conv.id ? "bg-neutral-800" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {conv.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{conv.name}</p>
                    <p className="text-xs text-neutral-400 truncate">
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {conv.timestamp}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="p-4 text-neutral-400 text-center">
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
        {selectedConversation ? (
          <>
            <ChatHeader
              chatId={selectedChatId}
              viewerType="admin"
              onParticipantUpdate={handleParticipantUpdate}
              conversation={selectedConversation}
            />
            <ChatMessages
              chatId={selectedChatId}
              viewerType="admin"
              newMessage={newMessage}
              onMessageUpdate={handleMessageUpdate}
            />
            <ChatInput
              chatId={selectedChatId}
              viewerType="admin"
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-neutral-400 text-center">
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

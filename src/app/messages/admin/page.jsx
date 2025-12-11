// src/app/messages/admin/page.jsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ChatHeader from "@/Components/ChatHeader";
import ChatMessages from "@/Components/ChatMessages";
import ChatInput from "@/Components/ChatInput";
import TypingIndicator from "@/Components/TypingIndicator";

export default function AdminChatPage() {
  const [newMessage, setNewMessage] = useState(null);
  const [participant, setParticipant] = useState(null);
  const chatId = "chat_001"; // In a real app, this would come from URL params or props

  const handleSendMessage = (message) => {
    setNewMessage(message);
    // Reset after a short delay to allow the message to be processed
    setTimeout(() => setNewMessage(null), 100);
  };

  const handleParticipantUpdate = (participantData) => {
    setParticipant(participantData);
  };

  const handleMessageUpdate = () => {
    // Trigger any necessary updates when messages change
    // This could be used to update read status, etc.
  };

  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setTyping(true);
        setTimeout(() => setTyping(false), 3000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Chat Container */}
      <div className="relative z-10 h-full flex flex-col max-w-4xl mx-auto w-full shadow-2xl">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ChatHeader
            chatId={chatId}
            viewerType="admin"
            onParticipantUpdate={handleParticipantUpdate}
          />
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <ChatMessages
            chatId={chatId}
            viewerType="admin"
            newMessage={newMessage}
            onMessageUpdate={handleMessageUpdate}
          />

          {/* Typing Indicator */}
          <TypingIndicator show={typing} participant={participant} />
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ChatInput
            chatId={chatId}
            viewerType="admin"
            onSendMessage={handleSendMessage}
          />
        </motion.div>
      </div>

      {/* Admin Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="bg-linear-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          Admin Panel
        </div>
      </motion.div>

      {/* Status Indicator */}
      {participant && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute top-16 right-4 z-20"
        >
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-3 text-sm max-w-xs">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  participant.status === "online"
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span className="text-gray-900 dark:text-white font-medium">
                {participant.name}
              </span>
            </div>
            <p className="text-gray-500 dark:text-neutral-400 mt-1">
              {participant.status === "online" ? "Online now" : "Offline"}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

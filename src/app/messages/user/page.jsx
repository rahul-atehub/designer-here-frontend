// src/app/messages/user/page.jsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ChatHeader from "@/Components/ChatHeader";
import ChatMessages from "@/Components/ChatMessages";
import ChatInput from "@/Components/ChatInput";
import TypingIndicator from "@/Components/TypingIndicator";

export default function UserChatPage() {
  const [newMessage, setNewMessage] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [typing, setTyping] = useState(false);
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

  // Simulate typing indicator (in real app, this would come from WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance every second
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
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/3 right-1/4 w-48 h-48 bg-violet-500/8 rounded-full blur-2xl"
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
            viewerType="user"
            onParticipantUpdate={handleParticipantUpdate}
          />
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0 relative"
        >
          <ChatMessages
            chatId={chatId}
            viewerType="user"
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
            viewerType="user"
            onSendMessage={handleSendMessage}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

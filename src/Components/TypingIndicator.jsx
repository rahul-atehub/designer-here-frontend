"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypingIndicator = ({
  socketConnection,
  roomId,
  currentUserId,
  className = "",
}) => {
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef({});

  useEffect(() => {
    if (!socketConnection) return;

    const handleUserTyping = (data) => {
      const { userId, userName } = data;
      if (userId === currentUserId) return;

      setTypingUsers((prev) => {
        const exists = prev.find((user) => user.id === userId);
        if (exists) return prev;
        return [...prev, { id: userId, name: userName }];
      });

      // Auto remove after 3 seconds
      if (typingTimeoutRef.current[userId]) {
        clearTimeout(typingTimeoutRef.current[userId]);
      }

      typingTimeoutRef.current[userId] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((user) => user.id !== userId));
        delete typingTimeoutRef.current[userId];
      }, 3000);
    };

    const handleUserStopTyping = (data) => {
      const { userId } = data;
      setTypingUsers((prev) => prev.filter((user) => user.id !== userId));

      if (typingTimeoutRef.current[userId]) {
        clearTimeout(typingTimeoutRef.current[userId]);
        delete typingTimeoutRef.current[userId];
      }
    };

    socketConnection.on("user_typing", handleUserTyping);
    socketConnection.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socketConnection.off("user_typing", handleUserTyping);
      socketConnection.off("user_stop_typing", handleUserStopTyping);
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, [socketConnection, currentUserId]);

  const startTyping = useCallback(() => {
    if (!socketConnection) return;
    socketConnection.emit("typing", { roomId, userId: currentUserId });
  }, [socketConnection, roomId, currentUserId]);

  const stopTyping = useCallback(() => {
    if (!socketConnection) return;
    socketConnection.emit("stop_typing", { roomId, userId: currentUserId });
  }, [socketConnection, roomId, currentUserId]);

  // Expose methods to parent
  React.useImperativeHandle(
    React.forwardRef(() => null),
    () => ({
      startTyping,
      stopTyping,
    })
  );

  const getTypingText = () => {
    const count = typingUsers.length;
    if (count === 0) return "";
    if (count === 1) return `${typingUsers[0].name} is typing`;
    if (count === 2)
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing`;
    return `${typingUsers[0].name} and ${count - 1} others are typing`;
  };

  if (typingUsers.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`flex items-center space-x-2 px-4 py-2 ${className}`}
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">{getTypingText()}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default TypingIndicator;

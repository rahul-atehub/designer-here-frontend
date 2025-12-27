// src/lib/socket-client.js (Frontend helper)

import { io } from "socket.io-client";

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3003",
      {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ["websocket"],
      }
    );

    this.setupDefaultListeners();
    return this.socket;
  }

  setupDefaultListeners() {
    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });
  }

  // Chat methods
  joinChat(chatId) {
    if (!this.socket?.connected) return;
    this.socket.emit("join_chat", chatId);
  }

  leaveChat(chatId) {
    if (!this.socket?.connected) return;
    this.socket.emit("leave_chat", chatId);
  }

  sendMessage(messageData) {
    if (!this.socket?.connected) return;

    // EMIT
    this.socket.emit("send_message", messageData);

    // LET UI RENDER IMMEDIATELY
    window.dispatchEvent(
      new CustomEvent("optimistic-message", {
        detail: messageData,
      })
    );
  }

  deleteMessage(messageId, chatId) {
    if (!this.socket?.connected) return;
    this.socket.emit("delete_message", { messageId, chatId });
  }

  startTyping(chatId) {
    if (!this.socket?.connected) return;
    this.socket.emit("typing", { chatId, isTyping: true });
  }

  stopTyping(chatId) {
    if (!this.socket?.connected) return;
    this.socket.emit("typing", { chatId, isTyping: false });
  }

  markAsRead(chatId, messageIds) {
    if (!this.socket?.connected) return;
    this.socket.emit("read_receipt", { chatId, messageIds });
  }

  updateLastSeen() {
    if (!this.socket?.connected) return;
    this.socket.emit("last_seen", { timestamp: new Date() });
  }

  // Event listeners
  on(event, callback) {
    if (!this.socket) return;

    // Store listener reference for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Clean up stored reference
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  removeAllListeners(event) {
    if (!this.socket) return;

    if (event) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    } else {
      this.socket.removeAllListeners();
      this.listeners.clear();
    }
  }

  disconnect() {
    if (this.socket) {
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  get connected() {
    return this.socket?.connected || false;
  }

  get id() {
    return this.socket?.id || null;
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient;

// src/lib/socket-client.js (Frontend helper)
import { io } from "socket.io-client";

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.currentChatId = null;
  }

  // Helper to get auth token from cookies
  getAuthToken() {
    if (typeof document === "undefined") return null;

    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, decodeURIComponent(v.join("="))];
      }),
    );

    return cookies.auth_token || null;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = this.getAuthToken();

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["polling", "websocket"], // Pass token in auth if available
      ...(token && {
        auth: {
          token,
        },
      }),
    });

    this.setupDefaultListeners();
    return this.socket;
  }

  // Add this to setupDefaultListeners() in socket-client.js

  setupDefaultListeners() {
    this.socket.on("connect", () => {});

    // ✅ NEW: Listen for new_message event from Socket.IO server
    this.socket.on("new_message", (payload) => {
      // Dispatch custom event so ChatMessages component can update
      window.dispatchEvent(
        new CustomEvent("socket-new-message", { detail: payload }),
      );
    });

    this.socket.on("disconnect", (reason) => {});

    // GLOBAL LISTENERS
    this.socket.on("messages_delivered", (payload) => {
      window.dispatchEvent(
        new CustomEvent("messages-delivered", {
          detail: payload,
        }),
      );
    });

    this.socket.on("messages_read", (payload) => {
      window.dispatchEvent(
        new CustomEvent("messages-read", {
          detail: payload,
        }),
      );
    });

    this.socket.on("socket_error", (error) => {
      console.error("🔴 Socket error:", error.message);
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error.message);
    });
  }

  // Chat methods
  joinChat(chatId) {
    if (!this.socket?.connected) return;
    if (this.currentChatId === chatId) return;

    this.currentChatId = chatId;
    this.socket.emit("join_chat", chatId);
  }

  leaveChat(chatId) {
    if (!this.socket?.connected) return;
    if (this.currentChatId !== chatId) return;

    this.socket.emit("leave_chat", chatId);
    this.currentChatId = null;
  }

  sendMessage(messageData) {
    if (!this.socket?.connected) {
      console.warn("Socket not connected, message will be sent via API only");
      // Message will still send via API route - socket is secondary
      return;
    }

    // Emit for acknowledgment (optional backup)
    this.socket.emit("send_message", messageData);

    // Optimistic update - message appears immediately
    window.dispatchEvent(
      new CustomEvent("optimistic-message", {
        detail: {
          ...messageData,
          tempId: `temp-${Date.now()}-${Math.random()}`,
        },
      }),
    );
  }

  // Handle queued messages from offline period
  setupOfflineHandlers() {
    if (!this.socket) return;

    this.socket.on("queued_messages", (payload) => {
      const { messages } = payload;

      messages.forEach((msgData) => {
        window.dispatchEvent(
          new CustomEvent("queued-message-received", {
            detail: msgData,
          }),
        );
      });
    });

    this.socket.on("message_queued", (payload) => {});

    // ✅ ADD THIS - Read receipts from other users
    this.socket.on("messages_read", (payload) => {
      window.dispatchEvent(
        new CustomEvent("messages-read", {
          detail: payload,
        }),
      );
    });

    // ✅ ADD THIS - Delivery confirmations
    this.socket.on("messages_delivered", (payload) => {
      window.dispatchEvent(
        new CustomEvent("messages-delivered", {
          detail: payload,
        }),
      );
    });
  }

  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn(`Socket not connected, cannot emit ${event}`);
      return;
    }
    this.socket.emit(event, data);
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

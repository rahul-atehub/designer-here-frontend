// src/context/NotificationContext.jsx
"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useUser } from "@/context/UserContext";
import {
  fetchUnreadCount,
  markAllNotificationsAsRead,
  removeNotification,
  markNotificationAsRead,
} from "@/lib/notification-service";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // ─── Fetch unread count from backend ───────────────────────────────────────
  const refreshUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Silently fail for 401 errors (not logged in)
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setUnreadCount(0);
      } else {
        console.error("Failed to refresh unread count:", err.message);
      }
    }
  }, [user]);

  // ─── Fetch unread count on mount and when user changes ─────────────────────
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }
    refreshUnreadCount();
  }, [user, refreshUnreadCount]);

  // ─── Mark all as read for a tab ─────────────────────────────────────────────
  const markTabAsRead = useCallback(
    async (type) => {
      if (!user) return;
      try {
        await markAllNotificationsAsRead(type);
        setNotifications((prev) =>
          prev.map((n) =>
            n.type === type || !type ? { ...n, read: true } : n,
          ),
        );
        await refreshUnreadCount();
      } catch (err) {
        console.error("Failed to mark tab as read:", err.message);
      }
    },
    [user, refreshUnreadCount],
  );

  // ─── Mark single notification as read ───────────────────────────────────────
  const markOneAsRead = useCallback(
    async (id) => {
      if (!user) return;
      try {
        await markNotificationAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
        );
        await refreshUnreadCount();
      } catch (err) {
        console.error("Failed to mark notification as read:", err.message);
      }
    },
    [user, refreshUnreadCount],
  );

  // ─── Delete a notification ───────────────────────────────────────────────────
  const deleteOne = useCallback(
    async (id) => {
      if (!user) return;
      try {
        await removeNotification(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        await refreshUnreadCount();
      } catch (err) {
        console.error("Failed to delete notification:", err.message);
      }
    },
    [user, refreshUnreadCount],
  );

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        setNotifications,
        refreshUnreadCount,
        markTabAsRead,
        markOneAsRead,
        deleteOne,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

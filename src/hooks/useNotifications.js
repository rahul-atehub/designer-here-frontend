// src/hooks/useNotifications.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "@/lib/notification-service";
import { useNotifications as useNotificationContext } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";

export function useNotifications(activeTab) {
  const { user } = useUser();
  const { markTabAsRead, markOneAsRead, deleteOne, refreshUnreadCount } =
    useNotificationContext();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Fetch notifications for the active tab ────────────────────────────────
  const loadNotifications = useCallback(async () => {
    if (!activeTab || !user) {
      setNotifications([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchNotifications(activeTab);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
      setNotifications([]);

      // Check if it's an authentication error
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setError("authentication");
      } else {
        setError("fetch");
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, user]);

  // ─── Load + mark as read when tab becomes active ───────────────────────────
  useEffect(() => {
    // Only run if user is logged in
    if (user && loadNotifications && markTabAsRead && activeTab) {
      loadNotifications();
      markTabAsRead(activeTab);
    }
  }, [activeTab, user, loadNotifications, markTabAsRead]);

  // ─── Handle single delete with local state update ──────────────────────────
  const handleDelete = useCallback(
    async (id) => {
      if (!user) return;
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      await deleteOne(id);
    },
    [deleteOne, user],
  );

  // ─── Handle single mark as read with local state update ───────────────────
  const handleMarkAsRead = useCallback(
    async (id) => {
      if (!user) return;
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      await markOneAsRead(id);
    },
    [markOneAsRead, user],
  );

  // ─── Handle mark all as read for current tab ──────────────────────────────
  const handleMarkAllAsRead = useCallback(async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markTabAsRead(activeTab);
  }, [markTabAsRead, activeTab, user]);

  return {
    notifications,
    isLoading,
    error,
    handleDelete,
    handleMarkAsRead,
    handleMarkAllAsRead,
    reload: loadNotifications,
  };
}

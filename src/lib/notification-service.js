// src/lib/notification-service.js
import { API } from "@/config";

/**
 * Fetch notifications for a specific tab type.
 * type: "messages" | "likes" | "saves" | "posts" | "featured"
 */
export async function fetchNotifications(type) {
  const res = await fetch(`${API.NOTIFICATIONS.GET_ALL}?type=${type}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  const data = await res.json();
  return data.notifications ?? [];
}

/**
 * Fetch total unread count for navbar badge.
 */
export async function fetchUnreadCount() {
  const res = await fetch(API.NOTIFICATIONS.GET_UNREAD_COUNT, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch unread count");
  const data = await res.json();
  return data.count ?? 0;
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(id) {
  const res = await fetch(API.NOTIFICATIONS.MARK_AS_READ(id), {
    method: "PUT",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
}

/**
 * Mark all notifications as read for a tab type.
 * type is optional — if omitted, marks ALL notifications as read.
 */
export async function markAllNotificationsAsRead(type = null) {
  const url = type
    ? `${API.NOTIFICATIONS.MARK_ALL_AS_READ}?type=${type}`
    : API.NOTIFICATIONS.MARK_ALL_AS_READ;
  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
}

/**
 * Delete a single notification.
 */
export async function removeNotification(id) {
  const res = await fetch(API.NOTIFICATIONS.DELETE(id), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
}

/**
 * Fetch notification preferences for the settings page.
 */
export async function fetchPreferences() {
  const res = await fetch(API.NOTIFICATIONS.PREFERENCES, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch preferences");
  const data = await res.json();
  return data.preferences ?? {};
}

/**
 * Update a single preference key instantly on toggle.
 * updates: partial object e.g. { messageAlerts: false }
 */
export async function updatePreference(updates) {
  const res = await fetch(API.NOTIFICATIONS.PREFERENCES, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update preference");
  return res.json();
}

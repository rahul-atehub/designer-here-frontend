"use client";
import { useState, useEffect, useRef } from "react";
import {
  X,
  Bell,
  Check,
  Trash2,
  Settings,
  User,
  Heart,
  MessageSquare,
  Image as ImageIcon,
  AlertCircle,
  Info,
  Star,
  Bookmark,
} from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function NotificationPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("messages");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});
  const { user } = useUser();
  const isAdmin = user?.role === "admin";
  const router = useRouter();

  useEffect(() => {
    // Fetch notifications based on activeTab
    setIsLoading(true);
    // TODO: Replace with actual API call
    // Example: axios.get(`/api/notifications/${activeTab}`)
    //   .then(response => setNotifications(response.data))
    //   .catch(error => console.error(error))
    //   .finally(() => setIsLoading(false));

    setTimeout(() => {
      setNotifications([]);
      setIsLoading(false);
    }, 300);
  }, [activeTab]);

  useEffect(() => {
    // Update underline position when active tab changes
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab]);

  const tabs = isAdmin
    ? [
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "likes", label: "Likes", icon: Heart },
        { id: "saves", label: "Saves", icon: Bookmark },
      ]
    : [
        { id: "messages", label: "New Messages", icon: MessageSquare },
        { id: "posts", label: "New Posts", icon: ImageIcon },
        { id: "featured", label: "Featured Posts", icon: Star },
      ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500" fill="currentColor" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case "post":
        return <ImageIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const markAsRead = (id) => {
    // TODO: API call to mark notification as read
    // axios.put(`/api/notifications/${id}/read`)
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    // TODO: API call to mark all notifications as read
    // axios.put(`/api/notifications/read-all`)
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    // TODO: API call to delete notification
    // axios.delete(`/api/notifications/${id}`)
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleNotificationSettings = () => {
    router.push("/settings?tab=notifications");
    if (onClose) {
      onClose();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-900 dark:text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                {unreadCount}
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="p-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-all duration-200"
            >
              Mark all read
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-around relative w-full">
          {tabs.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              ref={(el) => (tabRefs.current[id] = el)}
              onClick={() => setActiveTab(id)}
              title={label}
              className={`
                flex items-center justify-center py-3 text-sm font-medium transition-colors duration-200 relative flex-1
                ${
                  activeTab === id
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }
              `}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}

          {/* Animated underline */}
          <div
            className="absolute bottom-0 h-0.5 bg-red-500 transition-all duration-300 ease-out"
            style={{
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width}px`,
            }}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              When you get notifications, they'll show up here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`
                  relative group p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer
                  ${!notification.read ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}
                  animate-in fade-in slide-in-from-top-2
                `}
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  {/* Avatar with notification icon */}
                  <div className="relative shrink-0">
                    <img
                      src={notification.avatar}
                      alt={notification.user}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-semibold">
                          {notification.user}
                        </span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </span>
                        {notification.postTitle && (
                          <span className="text-gray-900 dark:text-white font-medium">
                            {" "}
                            "{notification.postTitle}"
                          </span>
                        )}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5 animate-in zoom-in duration-200" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </p>
                  </div>

                  {/* Actions - Show on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950/20 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-neutral-800">
        <button
          onClick={handleNotificationSettings}
          className="w-full py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
          <span>Notification Settings</span>
        </button>
      </div>
    </div>
  );
}

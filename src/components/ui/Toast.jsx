"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-100 animate-slide-down">
      <div className="px-4 py-3 rounded-full shadow-lg bg-gray-900/90 backdrop-blur-xl text-white transition-all duration-300">
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>,
    document.body,
  );
}

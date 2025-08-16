"use client";
import { useEffect, useRef, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "default", // "small", "default", "large", "full"
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventBodyScroll = true,
  className = "",
  titleClassName = "",
  contentClassName = "",
  overlayClassName = "",
  animation = "scale", // "scale", "slide", "fade"
  position = "center", // "center", "top", "bottom"
}) {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    if (!closeOnEscape) return;

    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!preventBodyScroll) return;

    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, preventBodyScroll]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modalRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handle closing with animation
  const handleClose = () => {
    if (!isOpen) return;

    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Animation duration
  };

  // Handle overlay click with improved click detection
  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay (not on modal content)
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      handleClose();
    }
  };

  // Enhanced content click handler to prevent event bubbling
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen && !isClosing) return null;

  // Size configurations
  const sizeClasses = {
    small: "max-w-md",
    default: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-7xl mx-4",
  };

  // Position configurations
  const positionClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-20",
    bottom: "items-end justify-center pb-20",
  };

  // Animation configurations
  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-200 ease-out";

    if (isClosing) {
      switch (animation) {
        case "scale":
          return `${baseClasses} scale-95 opacity-0`;
        case "slide":
          return `${baseClasses} translate-y-4 opacity-0`;
        case "fade":
          return `${baseClasses} opacity-0`;
        default:
          return `${baseClasses} scale-95 opacity-0`;
      }
    }

    switch (animation) {
      case "scale":
        return `${baseClasses} scale-100 opacity-100`;
      case "slide":
        return `${baseClasses} translate-y-0 opacity-100`;
      case "fade":
        return `${baseClasses} opacity-100`;
      default:
        return `${baseClasses} scale-100 opacity-100`;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        positionClasses[position]
      } bg-black/30 backdrop-blur transition-opacity duration-200 ${
        isClosing ? "bg-opacity-0" : "bg-opacity-50"
      } ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={`
          bg-white dark:bg-gray-900 
          text-gray-900 dark:text-gray-100 
          rounded-2xl 
          shadow-2xl 
          ${
            isFullscreen
              ? "w-full h-full max-w-none max-h-none rounded-none"
              : `${sizeClasses[size]} w-full max-h-[90vh]`
          }
          overflow-hidden
          relative
          ${getAnimationClasses()}
          ${className}
        `}
        onClick={handleContentClick}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="modal-title"
            className={`text-2xl font-bold text-gray-900 dark:text-gray-100 pr-8 ${titleClassName}`}
          >
            {title}
          </h2>

          <div className="flex items-center space-x-2">
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-150"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-150"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className={`
            p-6 
            overflow-y-auto 
            ${isFullscreen ? "h-full" : "max-h-[calc(90vh-8rem)]"}
            ${contentClassName}
          `}
        >
          {children}
        </div>

        {/* Resize Handle (only visible when not fullscreen) */}
        {!isFullscreen && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400 dark:border-gray-600"></div>
          </div>
        )}
      </div>

      {/* Resize Handle (only visible when not fullscreen) */}
      {!isFullscreen && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400 dark:border-gray-600"></div>
        </div>
      )}

      {/* Loading/Processing Overlay */}
      {isClosing && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
    // ...existing code...
    // ...existing code...
  );
}

// Utility hook for modal state management
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen,
  };
}

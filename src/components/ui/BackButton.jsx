"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/**
 * Instagram-style back button component with double router push back functionality
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Optional click handler (executes before navigation)
 * @param {string} props.ariaLabel - Accessibility label
 * @param {number} props.size - Icon size (default: 24)
 * @param {boolean} props.disabled - Disable the button
 */
const BackButton = ({
  className = "",
  onClick,
  ariaLabel = "Go back",
  size = 24,
  disabled = false,
}) => {
  const router = useRouter();

  const handleClick = () => {
    // Execute custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Double router back - go back twice in history
    router.back();
    setTimeout(() => {
      router.back();
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        w-10 h-10 
        rounded-full
        bg-transparent
        hover:bg-gray-100 dark:hover:bg-gray-800
        active:bg-gray-200 dark:active:bg-gray-700
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation
        ${className}
      `}
    >
      <ChevronLeft
        size={size}
        className="text-gray-900 dark:text-gray-100"
        strokeWidth={2}
      />
    </button>
  );
};

export default BackButton;

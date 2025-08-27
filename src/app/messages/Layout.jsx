// src/app/messages/layout.jsx
export default function MessagesLayout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <style jsx global>{`
        /* Custom scrollbar styles */
        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300 {
          scrollbar-color: #d1d5db transparent;
        }

        .dark .scrollbar-thumb-neutral-700 {
          scrollbar-color: #404040 transparent;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #404040;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #525252;
        }

        /* Hide scrollbar for emoji picker */
        .scrollbar-thumb-gray-300::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thumb-neutral-600::-webkit-scrollbar-thumb {
          background-color: #525252;
        }

        /* Prevent text selection on buttons and UI elements */
        button,
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Smooth transitions for dark mode */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease,
            color 0.2s ease;
        }
      `}</style>
      {children}
    </div>
  );
}

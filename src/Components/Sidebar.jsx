import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../components/ui/theme.toggle";
import { Settings, User, MessageSquare, X, Heart, Save } from "lucide-react";

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-screen w-full md:w-64 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-700/60 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Content */}
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 pt-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-red-50/50 dark:from-blue-950/20 dark:to-red-950/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                alt="My Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-[#EF4444] to-[#F97316] bg-clip-text text-transparent">
              Designer Here
            </h2>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-500 dark:text-gray-400 hover:text-#EF4444 dark:hover:text-#EF4444 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            <SidebarItem
              icon={MessageSquare}
              label="Messages"
              href="/messages"
            />
            <SidebarItem icon={User} label="Profile" href="/profile" />
            <SidebarItem icon={Heart} label="liked" href="/liked" />
            <SidebarItem icon={Save} label="saved" href="/saved" />
            <SidebarItem icon={Settings} label="Settings" href="/settings" />
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 transition">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-#EF4444 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black dark:text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accent border */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-#EF4444"></div>
    </div>
  );
};

// Enhanced Sidebar Item with better styling
const SidebarItem = ({ icon: Icon, label, href, badge }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
        isActive
          ? "text-#EF4444 dark:text-#EF4444 bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-950/20 dark:to-blue-950/20"
          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-800"
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>

      {badge && (
        <div className="px-2 py-1 bg-#EF4444 text-white text-xs font-semibold rounded-full min-w-[20px] text-center">
          {badge}
        </div>
      )}
    </Link>
  );
};

export default Sidebar;

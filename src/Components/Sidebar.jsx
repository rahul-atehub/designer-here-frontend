import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../components/ui/theme.toggle";
import {
  Home,
  Settings,
  User,
  FileText,
  MessageSquare,
  Star,
  X,
  Heart,
} from "lucide-react";

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-screen w-full md:w-64 bg-gray-100 dark:bg-[#0d1117] border-r border-gray-200 dark:border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Content */}
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 pt-4 border-b">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            logo
          </h2>
          <button
            onClick={onToggle}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            <SidebarItem icon={Home} label="Home" href="/" />
            <SidebarItem icon={FileText} label="About-Us" href="/about" />
            <SidebarItem
              icon={MessageSquare}
              label="Messages"
              href="/messages"
            />
            <SidebarItem icon={User} label="Profile" href="/profile" />
            <SidebarItem icon={Heart} label="Favorites" href="/favorites" />
            <SidebarItem icon={Settings} label="Settings" href="/settings" />
          </div>

          <ThemeToggle />
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-gray-800 dark:hover:bg-neutral-800 border border-neutral-800 transition">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
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
    </div>
  );
};

// Sidebar Item with Link & Active State
const SidebarItem = ({ icon: Icon, label, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
        isActive
          ? "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Sidebar;

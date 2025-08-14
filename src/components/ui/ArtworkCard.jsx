"use client";
import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  MoreVertical,
} from "lucide-react";

export default function ArtworkCard({
  artwork,
  isAdmin = false,
  onDelete,
  onEdit,
  onToggleVisibility,
}) {
  const [adminMode, setAdminMode] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("admin")) {
        return urlParams.get("admin") === "true";
      }
    }
    return isAdmin;
  });

  const [visible, setVisible] = useState(artwork?.visible ?? true);
  const [views, setViews] = useState(artwork?.views ?? 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const sampleArtwork = {
    id: 1,
    title: "House Of Balloons",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    description:
      "Atmospheric R&B masterpiece that launched a new era of dark, moody soundscapes.",
    visible: true,
    views: 1247,
    uploadDate: "2024-08-01T10:30:00Z",
  };

  const artworkData = artwork || sampleArtwork;

  const handleToggleVisibility = () => {
    const newVisibility = !visible;
    setVisible(newVisibility);
    if (onToggleVisibility) {
      onToggleVisibility(artworkData.id, newVisibility);
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete "${artworkData.title}"?`)) {
      setIsDeleting(true);
      setTimeout(() => {
        if (onDelete) {
          onDelete(artworkData.id);
        }
      }, 300);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(artworkData.id);
    }
  };

  return (
    <div
      className={`max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-out transform group w-full max-w-xs${
        isDeleting
          ? "scale-95 opacity-0 translate-y-4"
          : "hover:-translate-y-1 scale-100 opacity-100 translate-y-0"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-800">
        <img
          src={artworkData.image}
          alt={artworkData.title}
          className={`w-full h-full object-cover transition-all duration-500 ease-out ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />

        {/* 3-dot Menu for Admin */}
        {adminMode && (
          <div className="absolute top-2 right-2">
            {/* Always visible button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-full bg-gray-800/70 hover:bg-gray-800 text-white"
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                className={`absolute right-0 mt-2 w-40 rounded-lg dark:rounded-lg bg-white  shadow-lg transform transition-all duration-200 ease-out origin-top ${
                  menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                }`}
              >
                {/* Status */}
                <div className="px-3 py-2 text-sm flex items-center justify-between border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <span>Status:</span>
                  <span
                    className={`font-medium ${
                      visible
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {visible ? "Live" : "Hidden"}
                  </span>
                </div>

                {/* Views */}
                <div className="px-3 py-2 text-sm flex items-center gap-2 border-b border-gray-200  dark:bg-gray-800 dark:border-gray-700">
                  <TrendingUp
                    size={14}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  {views.toLocaleString()}
                </div>

                {/* Upload Date */}
                <div className="px-3 py-2 text-sm flex items-center gap-2 border-b border-gray-200  dark:bg-gray-800 dark:border-gray-700">
                  <Calendar
                    size={14}
                    className="text-purple-600 dark:text-purple-400"
                  />
                  {new Date(artworkData.uploadDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    }
                  )}
                </div>

                {/* Toggle Visibility */}
                <button
                  onClick={handleToggleVisibility}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 w-full text-left"
                >
                  {visible ? (
                    <>
                      <EyeOff size={14} /> Hide
                    </>
                  ) : (
                    <>
                      <Eye size={14} /> Show
                    </>
                  )}
                </button>

                {/* Edit */}
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Pencil size={14} /> Edit
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 w-full text-left text-red-500"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="p-3">
        <h1 className="text-base font-bold text-gray-900 dark:text-white truncate ">
          {artworkData.title}
        </h1>
      </div>

      {/* Description */}
      <div className="pt-0 px-3 pb-3 text-sm text-gray-700 dark:text-gray-300">
        <p className="leading-relaxed line-clamp-3 ">
          {artworkData.description}
        </p>
      </div>
    </div>
  );
}

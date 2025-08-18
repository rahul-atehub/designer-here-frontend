"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  MoreVertical,
  Heart,
  Bookmark,
  X,
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
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(artwork?.likes ?? 89);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = ""; // restore scroll
    }
  }, [isModalOpen]);

  const sampleArtwork = {
    id: 1,
    title: "House Of Balloons",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    description:
      "Atmospheric R&B masterpiece that launched a new era of dark, moody soundscapes. This groundbreaking work redefined contemporary music with its haunting melodies and innovative production techniques.",
    visible: true,
    views: 1247,
    uploadDate: "2024-08-01T10:30:00Z",
    likes: 89,
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

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Check if description is longer than 50 characters
  const isDescriptionLong = artworkData.description.length > 100;
  const truncatedDescription = isDescriptionLong
    ? artworkData.description.substring(0, 100) + "..."
    : artworkData.description;

  return (
    <>
      <div
        className={`group relative max-w-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 rounded-2xl overflow-hidden transition-all duration-300 ease-out transform w-full max-w-xs cursor-pointer ${
          isDeleting
            ? "scale-95 opacity-0 translate-y-4"
            : "hover:-translate-y-2 hover:scale-[1.02] scale-100 opacity-100 translate-y-0"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMenuOpen(false);
        }}
        onClick={handleCardClick}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-red-50/20 dark:from-blue-950/10 dark:to-red-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

        {/* Image Section */}
        <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          <img
            src={artworkData.image}
            alt={artworkData.title}
            className={`w-full h-full object-cover transition-all duration-500 ease-out ${
              isHovered
                ? "scale-110 brightness-110"
                : "scale-100 brightness-100"
            }`}
          />

          {/* Overlay gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          {/* Status indicator */}
          {adminMode && (
            <div className="absolute top-3 left-3">
              <div
                className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                  visible
                    ? "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
                    : "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30"
                }`}
              >
                {visible ? "Live" : "Hidden"}
              </div>
            </div>
          )}

          {/* Admin Menu - Always visible */}
          {adminMode && (
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-200 ease-out origin-top-right z-10">
                  {/* Stats Section */}
                  <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Views
                      </span>
                      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                        <TrendingUp size={14} />
                        <span className="font-semibold">
                          {views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Upload Date
                      </span>
                      <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                        <Calendar size={14} />
                        <span className="text-xs font-medium">
                          {new Date(artworkData.uploadDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility();
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                    >
                      {visible ? (
                        <>
                          <div className="p-1 bg-orange-500/10 rounded-lg">
                            <EyeOff
                              size={14}
                              className="text-orange-600 dark:text-orange-400"
                            />
                          </div>
                          <span>Hide Artwork</span>
                        </>
                      ) : (
                        <>
                          <div className="p-1 bg-green-500/10 rounded-lg">
                            <Eye
                              size={14}
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                          <span>Show Artwork</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                    >
                      <div className="p-1 bg-blue-500/10 rounded-lg">
                        <Pencil
                          size={14}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <span>Edit Artwork</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors duration-200 text-red-600 dark:text-red-400"
                    >
                      <div className="p-1 bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </div>
                      <span>Delete Artwork</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative p-4 space-y-3">
          {/* Like and Bookmark buttons - Always visible, above title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                  isLiked
                    ? "text-red-500"
                    : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart size={16} className={isLiked ? "fill-current" : ""} />
                <span className="text-sm font-medium">{likes}</span>
              </button>
            </div>

            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                isBookmarked
                  ? "text-blue-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
              }`}
            >
              <Bookmark
                size={16}
                className={isBookmarked ? "fill-current" : ""}
              />
            </button>
          </div>

          {/* Title */}
          <div className="flex items-start justify-between">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1 pr-2">
              {artworkData.title}
            </h1>
            {!adminMode && (
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                <TrendingUp size={12} />
                <span>{views.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Description with "more" option */}
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              {truncatedDescription}
              {isDescriptionLong && (
                <button
                  onClick={handleMoreClick}
                  className="ml-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  more
                </button>
              )}
            </p>
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>
                  {new Date(artworkData.uploadDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Action indicator */}
            <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-red-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Accent border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Modal for full description */}
      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleModalClose}
          >
            {/* Blurred background */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 z-10"
              >
                <X size={16} />
              </button>

              {/* Modal image */}
              <div className="w-full aspect-square overflow-hidden rounded-t-2xl">
                <img
                  src={artworkData.image}
                  alt={artworkData.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal content */}
              <div className="p-6 space-y-4">
                {/* Like and Bookmark buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-1 p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                        isLiked
                          ? "text-red-500"
                          : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={16}
                        className={isLiked ? "fill-current" : ""}
                      />
                      <span className="text-sm font-medium">{likes}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleBookmark}
                    className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                      isBookmarked
                        ? "text-blue-500"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
                    }`}
                  >
                    <Bookmark
                      size={16}
                      className={isBookmarked ? "fill-current" : ""}
                    />
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {artworkData.title}
                </h2>

                {/* Full description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {artworkData.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(artworkData.uploadDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp size={14} />
                      <span>{views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

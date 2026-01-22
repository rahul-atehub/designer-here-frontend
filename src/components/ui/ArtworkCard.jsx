// make the ui section transparent like iphone, so it'll give the classic frosted glass effect.

"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import socket from "@/lib/socket-client";
import axios from "axios";
import { API } from "@/config";
import { useLikedPosts } from "@/context/LikedPostsContext";
import { useSavedPosts } from "@/context/SavedPostsContext";
import { useUser } from "@/context/UserContext";

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
  Zap,
  Archive,
  ArchiveRestore,
  Star,
} from "lucide-react";

export default function ArtworkCard({
  artwork,
  onDelete,
  onEdit,
  onArchive,
  viewMode = "grid", // New prop with default value
}) {
  const [adminMode, setAdminMode] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      setAdminMode(user?.role === "admin");
    }
  }, [user, loading]);

  const [views, setViews] = useState(artwork?.views ?? 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const impressionTimerRef = useRef(null);
  const cardRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [archived, setArchived] = useState(artwork?.archived ?? false);
  const [featured, setFeatured] = useState(artwork?.featured ?? 0);

  const artworkData = artwork;
  if (!artwork) return null;

  const { savedPosts, toggleSave } = useSavedPosts();
  const isSaved = savedPosts.some((p) => p.id === artworkData._id);

  const [likes, setLikes] = useState(artwork?.likes ?? 0);
  const { likedPosts, toggleLike } = useLikedPosts();
  const isLiked = likedPosts.some((p) => p.id === artworkData._id);

  // 🔌 Connect to WebSocket server and listen for like updates
  useEffect(() => {
    // Subscribe only to this artwork's like updates
    socket.on(`likes-update-${artworkData._id}`, (newCount) => {
      setLikes(newCount);
    });

    // Clean up (unsubscribe) when component unmounts
    return () => {
      socket.off(`likes-update-${artworkData._id}`);
    };
  }, [artworkData._id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = ""; // restore scroll
    }
  }, [isModalOpen]);

  const confirmDelete = () => {
    console.log("confirmDelete called"); // Add this
    setShowDeleteConfirm(false);
    handleDelete();
  };

  const handleDelete = async () => {
    console.log("handleDelete called"); // Add this
    setIsDeleting(true);

    try {
      // Call API to delete post
      await axios.delete(API.PORTFOLIO.DELETE(artworkData._id), {
        withCredentials: true,
      });

      console.log("Post deleted on server");

      // Remove post from UI
      if (onDelete) onDelete(artworkData._id);
    } catch (err) {
      console.error("Error deleting post:", err);
      setIsDeleting(false); // rollback UI
    }
  };
  const handleEdit = () => {
    if (onEdit) {
      onEdit(artworkData._id);
    }
  };

  // Track engaged view (when modal opens)
  const trackView = async () => {
    if (hasTrackedView || adminMode) return; // Don't track admin views

    try {
      const viewedArtworks = JSON.parse(
        localStorage.getItem("viewedArtworks") || "[]",
      );

      if (!viewedArtworks.includes(artworkData._id)) {
        await axios.post(
          API.PORTFOLIO.TRACK(artworkData._id),
          { type: "view" },
          { withCredentials: true },
        );

        viewedArtworks.push(artworkData._id);
        localStorage.setItem("viewedArtworks", JSON.stringify(viewedArtworks));
        setHasTrackedView(true);

        // Optimistically update UI
        setViews((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error tracking view:", err);
    }
  };

  // Track impression (when card is visible)
  const trackImpression = async () => {
    if (hasTrackedImpression || adminMode) return; // Don't track admin impressions

    try {
      const impressedArtworks = JSON.parse(
        localStorage.getItem("impressedArtworks") || "[]",
      );

      if (!impressedArtworks.includes(artworkData._id)) {
        await axios.post(
          API.PORTFOLIO.TRACK(artworkData._id),
          { type: "impression" },
          { withCredentials: true },
        );

        impressedArtworks.push(artworkData._id);
        localStorage.setItem(
          "impressedArtworks",
          JSON.stringify(impressedArtworks),
        );
        setHasTrackedImpression(true);
      }
    } catch (err) {
      console.error("Error tracking impression:", err);
    }
  };

  // Add this useEffect after your existing useEffects

  // Track impression when card is visible
  useEffect(() => {
    if (adminMode || hasTrackedImpression) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start timer when card becomes visible
            impressionTimerRef.current = setTimeout(() => {
              trackImpression();
            }, 3000); // 3 seconds visible = impression
          } else {
            // Clear timer if card leaves viewport
            if (impressionTimerRef.current) {
              clearTimeout(impressionTimerRef.current);
            }
          }
        });
      },
      { threshold: 0.5 }, // 50% of card must be visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (impressionTimerRef.current) {
        clearTimeout(impressionTimerRef.current);
      }
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [adminMode, hasTrackedImpression]);

  const handleLike = async (e) => {
    e.stopPropagation();
    const wasLiked = isLiked;

    // Optimistic UI update
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    // Update global liked posts context
    toggleLike(artworkData);

    try {
      // Use single toggle endpoint for like/unlike
      const endpoint = API.LIKES.ADD_LIKE.replace("{postId}", artworkData._id);
      await axios.post(endpoint, {}, { withCredentials: true });

      console.log("Like saved on server");
    } catch (err) {
      console.error("Error liking post:", err);
      // Rollback UI if backend fails
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();

    // Optimistic UI update
    toggleSave(artworkData);

    try {
      const endpoint = API.SAVED.SAVE_POST.replace("{postId}", artworkData._id);
      await axios.post(endpoint, {}, { withCredentials: true });

      console.log("Save/Unsave updated on server");
    } catch (err) {
      console.error("Error updating saved post:", err);
      toggleSave(artworkData); // rollback UI if backend fails
    }
  };

  const handleCardClick = () => {
    trackView(); // Track engaged view
    setIsModalOpen(true);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle archive toggle
  const handleArchive = async () => {
    try {
      const response = await axios.post(
        API.PORTFOLIO.ARCHIVE(artworkData._id),
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        // ✅ Refetch data from server like Instagram
        if (onArchive) {
          onArchive();
        }
      }
    } catch (err) {
      console.error("Error archiving post:", err);
    }
  };

  // Handle feature toggle
  const handleFeature = async () => {
    if (archived) {
      alert("Cannot feature an archived post. Unarchive it first.");
      return;
    }

    try {
      const response = await axios.post(
        API.PORTFOLIO.FEATURE(artworkData._id),
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        setFeatured(response.data.data.featured);
      }
    } catch (err) {
      console.error("Error featuring post:", err);
    }
  };

  // Check if description is longer than 50 characters
  const isDescriptionLong = artworkData.description.length > 100;
  const truncatedDescription = isDescriptionLong
    ? artworkData.description.substring(0, 100) + "..."
    : artworkData.description;

  // List view truncation for description
  const listTruncatedDescription =
    viewMode === "list" && artworkData.description.length > 150
      ? artworkData.description.substring(0, 150) + "..."
      : artworkData.description;

  // Grid View (original design)
  if (viewMode === "grid") {
    return (
      <>
        <div
          ref={cardRef}
          className={`group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 rounded-2xl overflow-hidden transition-all duration-300 ease-out transform w-full cursor-pointer ${
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
          {/* Image Section - Takes up most of the card */}
          <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
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
              className={`absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            ></div>

            {/* Admin Menu */}
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
                    <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50 space-y-2">
                      {/* Engaged Views */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                          <Eye size={14} />
                          <span>Views</span>
                        </div>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {artwork.views?.toLocaleString() || 0}
                        </span>
                      </div>

                      {/* Impressions */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                          <Zap size={14} />
                          <span>Reach</span>
                        </div>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {artwork.impressions?.toLocaleString() || 0}
                        </span>
                      </div>

                      {/* Upload Date */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          <span>Uploaded</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {new Date(artworkData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      {/* Edit Date - Only show if edited */}
                      {artworkData.lastEditedDate && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                            <Pencil size={14} />
                            <span>Edited</span>
                          </div>
                          <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                            {new Date(
                              artworkData.lastEditedDate,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-1">
                      {/* Feature Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeature();
                        }}
                        disabled={archived}
                        className={`flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          archived
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div
                          className={`p-1 ${
                            featured > 0 ? "bg-yellow-500/10" : "bg-gray-500/10"
                          } rounded-lg`}
                        >
                          <Star
                            size={14}
                            className={
                              featured > 0
                                ? "text-yellow-600 dark:text-yellow-400 fill-current"
                                : "text-gray-600 dark:text-gray-400"
                            }
                          />
                        </div>
                        <span>
                          {featured > 0 ? "Unfeature" : "Add to Featured"}
                        </span>
                      </button>

                      {/* ✅ Archive Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive();
                        }}
                        className="flex items-center space-x-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                      >
                        {archived ? (
                          <>
                            <div className="p-1 bg-green-500/10 rounded-lg">
                              <ArchiveRestore
                                size={14}
                                className="text-green-600 dark:text-green-400"
                              />
                            </div>
                            <span>Unarchive Artwork</span>
                          </>
                        ) : (
                          <>
                            <div className="p-1 bg-orange-500/10 rounded-lg">
                              <Archive
                                size={14}
                                className="text-orange-600 dark:text-orange-400"
                              />
                            </div>
                            <span>Archive Artwork</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
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

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
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

          {/* Content Section - MINIMAL like Instagram */}
          <div className="relative p-3 space-y-2">
            {/* Like button and count */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-all duration-200 hover:scale-100 ${
                  isLiked
                    ? "text-red-500"
                    : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`transition-all duration-200 hover:scale-110 ${
                  isSaved
                    ? "text-blue-500"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
                }`}
              >
                <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
              </button>
            </div>

            {/* Title only */}
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {artworkData.title}
            </h1>

            {/* Views count */}
            {!adminMode && (
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <TrendingUp size={12} />
                <span>{views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>
        {/* Modal - Full details shown here */}
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
                <div className="p-2 space-y-1">
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
                        isSaved
                          ? "text-blue-500"
                          : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
                      }`}
                    >
                      <Bookmark
                        size={16}
                        className={isSaved ? "fill-current" : ""}
                      />
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {artworkData.title}
                  </h2>

                  {/* Full description - ONLY shown in modal */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {artworkData.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-0.5 border-t border-gray-200 dark:border-gray-700">
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
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )}
        {/* Delete Confirmation Modal - Instagram Style */}
        {showDeleteConfirm &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="fixed inset-0 z-60 flex items-center justify-center p-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

              {/* Modal */}
              <div
                className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Content */}
                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Delete Post?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Are you sure you want to delete "{artworkData.title}"? This
                    action cannot be undone.
                  </p>
                </div>

                {/* Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={confirmDelete}
                    className="w-full py-4 text-red-600 dark:text-red-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full py-4 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </>
    );
  }

  // List View (new horizontal layout)
  return (
    <>
      <div
        ref={cardRef}
        className={`group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 rounded-2xl overflow-hidden transition-all duration-300 ease-out transform w-full cursor-pointer ${
          isDeleting
            ? "scale-95 opacity-0 translate-y-4"
            : "hover:-translate-y-1 hover:scale-[1.01] scale-100 opacity-100 translate-y-0"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMenuOpen(false);
        }}
        onClick={handleCardClick}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 to-red-50/20 dark:from-blue-950/10 dark:to-red-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

        {/* Main Content Container - Horizontal Layout */}
        <div className="flex items-center h-32">
          {/* Image Section - Fixed width */}
          <div className="relative w-32 h-full shrink-0 overflow-hidden rounded-l-2xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
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
              className={`absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>

          {/* Content Section - Flexible width */}
          <div className="relative flex-1 p-4 flex flex-col justify-between h-full">
            {/* Top section with title and admin menu */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                  {artworkData.title}
                </h1>

                {/* Author/Category info */}
                {artworkData.author && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by {artworkData.author}
                  </p>
                )}
              </div>

              {/* Admin Menu */}
              {adminMode && (
                <div className="relative ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(!menuOpen);
                    }}
                    className="p-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 text-gray-600 dark:text-gray-400 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-200 ease-out origin-top-right z-20">
                      {/* Stats Section */}
                      {/* Stats Section */}
                      <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50 space-y-2">
                        {/* Engaged Views */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                            <Eye size={14} />
                            <span>Views</span>
                          </div>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {artwork.views?.toLocaleString() || 0}
                          </span>
                        </div>

                        {/* Impressions */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                            <Zap size={14} />
                            <span>Reach</span>
                          </div>
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {artwork.impressions?.toLocaleString() || 0}
                          </span>
                        </div>

                        {/* Upload Date */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                            <Calendar size={14} />
                            <span>Uploaded</span>
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {new Date(artworkData.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        {/* Edit Date - Only show if edited */}
                        {artworkData.lastEditedDate && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                              <Pencil size={14} />
                              <span>Edited</span>
                            </div>
                            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                              {new Date(
                                artworkData.lastEditedDate,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="p-1">
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
                            setShowDeleteConfirm(true);
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

            {/* Description */}
            <div className="flex-1 mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                {viewMode === "list" && artworkData.description.length > 150 ? (
                  <>
                    {listTruncatedDescription}
                    <button
                      onClick={handleMoreClick}
                      className="ml-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      more
                    </button>
                  </>
                ) : (
                  artworkData.description
                )}
              </p>
            </div>

            {/* Bottom section with stats and actions */}
            <div className="flex items-center justify-between">
              {/* Left side - Like and Bookmark buttons */}
              <div className="flex items-center space-x-4">
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

                <button
                  onClick={handleBookmark}
                  className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                    isSaved
                      ? "text-blue-500"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
                  }`}
                >
                  <Bookmark
                    size={16}
                    className={isSaved ? "fill-current" : ""}
                  />
                </button>
              </div>

              {/* Right side - Stats */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>
                    {new Date(artworkData.uploadDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                {!adminMode && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={12} />
                    <span>{views.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for full description - Same modal for both views */}
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
                      isSaved
                        ? "text-blue-500"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
                    }`}
                  >
                    <Bookmark
                      size={16}
                      className={isSaved ? "fill-current" : ""}
                    />
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {artworkData.title}
                </h2>

                {/* Author */}
                {artworkData.author && (
                  <p className="text-gray-500 dark:text-gray-400">
                    by {artworkData.author}
                  </p>
                )}

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
                          },
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
          document.body,
        )}
      {/* Delete Confirmation Modal - Instagram Style */}
      {showDeleteConfirm &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Modal */}
            <div
              className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Content */}
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Post?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Are you sure you want to delete "{artworkData.title}"? This
                  action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 text-red-600 dark:text-red-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-4 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

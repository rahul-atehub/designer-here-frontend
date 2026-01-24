"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle } from "lucide-react";
import Toast from "@/components/ui/Toast";
import axios from "axios";
import { API } from "@/config";

export default function EditArtworkModal({
  artwork,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [title, setTitle] = useState(artwork?.title || "");
  const [description, setDescription] = useState(artwork?.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Update state when artwork changes
  useEffect(() => {
    if (artwork) {
      setTitle(artwork.title);
      setDescription(artwork.description);
    }
  }, [artwork]);

  // Track if user made changes
  useEffect(() => {
    const changed =
      title !== artwork?.title || description !== artwork?.description;
    setHasChanges(changed);
  }, [title, description, artwork]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      // ✅ FIXED: Using correct API endpoint from config
      const response = await axios.patch(
        API.PORTFOLIO.UPDATE(artwork._id),
        {
          title: title.trim(),
          description: description.trim(),
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        // Show success toast
        setToastMessage("Artwork updated");
        setShowToast(true);

        if (onSuccess) onSuccess(response.data.data);

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error("Error updating artwork:", err);
      // Show error toast
      setToastMessage(
        err.response?.data?.message || "Failed to update artwork",
      );
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      // ✅ FIXED: Custom confirmation dialog instead of window.confirm()
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const confirmDiscard = () => {
    setShowUnsavedDialog(false);
    onClose();
  };

  if (!isOpen || !artwork) return null;

  return createPortal(
    <>
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Backdrop with blur */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

        {/* Modal - Split Screen Design */}
        <div
          className="relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side - Image Preview */}
          <div className="w-1/2 relative bg-black">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain"
            />

            {/* Close button on image */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white transition-all duration-200 hover:scale-110"
              disabled={isSaving}
            >
              <X size={20} />
            </button>
          </div>

          {/* Right Side - Edit Form with Glass Effect */}
          <div className="w-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Edit Artwork
              </h2>
            </div>

            {/* Form Content */}
            <div className="flex-1 px-8 py-6 space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  placeholder="Enter artwork title"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {title.length}/100
                </p>
              </div>

              {/* Description Input */}
              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={10}
                  placeholder="Enter artwork description"
                  className="w-full h-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {description.length}/500
                </p>
              </div>
            </div>

            {/* Footer with Save Button */}
            <div className="px-8 py-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`w-full py-3.5 rounded-2xl font-semibold text-base transition-all duration-300 ${
                  hasChanges && !isSaving
                    ? "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                    : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed backdrop-blur-xl"
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Unsaved Changes Dialog */}
      {showUnsavedDialog &&
        createPortal(
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
            onClick={() => setShowUnsavedDialog(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            <div
              className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Unsaved Changes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  You have unsaved changes. Are you sure you want to discard
                  them?
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 grid grid-cols-2">
                <button
                  onClick={() => setShowUnsavedDialog(false)}
                  className="py-4 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-r border-gray-200 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDiscard}
                  className="py-4 text-orange-600 dark:text-orange-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>,
    document.body,
  );
}

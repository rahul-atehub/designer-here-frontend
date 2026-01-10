"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Plus,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import axios from "axios";
import { API } from "@/config";

export default function CreatePost({ onClose, userId }) {
  const [step, setStep] = useState(1); // 1: Select, 2: Adjust, 3: Details & Share
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageScale, setImageScale] = useState(1);
  const [imageTranslate, setImageTranslate] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [imageCropSettings, setImageCropSettings] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);
  const additionalFilesRef = useRef(null);
  const { theme } = useTheme();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    const imagePromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setSelectedImages(images);
      setCurrentImageIndex(0);
      setStep(2); // Go to adjust step
    });
  };

  const handleAdditionalFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    const imagePromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setSelectedImages([...selectedImages, ...images]);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    const imagePromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setSelectedImages(images);
      setCurrentImageIndex(0);
      setStep(2);
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setShowGrid(true);
    setDragStart({
      x: e.clientX - imageTranslate.x,
      y: e.clientY - imageTranslate.y,
    });
  };

  const handleTouchStart = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      setShowGrid(!showGrid);
      if (imageScale > 1) {
        setImageScale(1);
        setImageTranslate({ x: 0, y: 0 });
      } else {
        setImageScale(2);
      }
    }
    setLastTap(currentTime);

    if (e.touches.length === 1) {
      setIsDragging(true);
      setShowGrid(true);
      setDragStart({
        x: e.touches[0].clientX - imageTranslate.x,
        y: e.touches[0].clientY - imageTranslate.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setImageTranslate({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setImageTranslate({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setShowGrid(false), 500);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, imageScale + delta), 3);
    setImageScale(newScale);
    if (newScale !== imageScale) {
      setShowGrid(true);
      setTimeout(() => setShowGrid(false), 500);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => setShowGrid(false), 500);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
      setSelectedImages([]);
      setCurrentImageIndex(0);
      setTitle("");
      setDescription("");
      setImageScale(1);
      setImageTranslate({ x: 0, y: 0 });
      setShowGrid(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedImages([]);
    setCurrentImageIndex(0);
    setTitle("");
    setDescription("");
    setImageScale(1);
    setImageTranslate({ x: 0, y: 0 });
    setShowGrid(false);
    if (onClose) onClose();
  };

  const handleNext = () => {
    setImageCropSettings((prev) => ({
      ...prev,
      [currentImageIndex]: {
        scale: imageScale,
        translate: { ...imageTranslate },
      },
    }));
    setStep(3);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
    }
    if (newImages.length === 0) {
      setStep(1);
    }
  };

  const getCroppedImage = async (imageData, imageIndex) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const size = 1080;
        canvas.width = size;
        canvas.height = size;

        // Use saved crop settings instead of current ref
        const cropSettings = imageCropSettings[imageIndex] || {
          scale: 1,
          translate: { x: 0, y: 0 },
        };

        // Use fixed container size (1:1 aspect ratio)
        const containerSize = 1080;

        const imgAspect = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > 1) {
          drawHeight = containerSize;
          drawWidth = drawHeight * imgAspect;
        } else {
          drawWidth = containerSize;
          drawHeight = drawWidth / imgAspect;
        }

        drawWidth *= cropSettings.scale;
        drawHeight *= cropSettings.scale;

        offsetX = (containerSize - drawWidth) / 2 + cropSettings.translate.x;
        offsetY = (containerSize - drawHeight) / 2 + cropSettings.translate.y;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, size, size);

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      };

      img.onerror = reject;
      img.src = imageData.preview;
    });
  };

  const handleShare = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    if (!userId) {
      alert("User ID is missing. Please try logging in again.");
      return;
    }

    try {
      setUploading(true);

      for (let i = 0; i < selectedImages.length; i++) {
        const imageData = selectedImages[i];

        // Validate file
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(imageData.file.type)) {
          alert(`Image ${i + 1}: Please select a valid image file`);
          continue;
        }

        if (imageData.file.size > 5 * 1024 * 1024) {
          alert(`Image ${i + 1}: File size must be less than 5MB`);
          continue;
        }

        // Get cropped image
        const croppedBlob = await getCroppedImage(imageData, i);

        // Create FormData
        const formData = new FormData();
        formData.append("artwork", croppedBlob, imageData.file.name);
        formData.append(
          "title",
          selectedImages.length > 1 ? `${title} (${i + 1})` : title
        );
        formData.append("description", description);
        // formData.append("uploadedBy", userId);
        formData.append("hidden", "false");

        // Upload - now uses the main PORTFOLIO endpoint, not UPLOAD
        await axios.post(API.PORTFOLIO.UPLOAD, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      setSuccessCount(selectedImages.length);
      setShowSuccess(true);
      setUploading(false);

      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error uploading post:", error);
      alert(
        error.response?.data?.error ||
          "Failed to upload post. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const currentImage = selectedImages[currentImageIndex];

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <motion.div className="flex flex-col items-center gap-4">
          <motion.div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </motion.div>
          <h2 className="text-2xl font-semibold text-white">
            Post{successCount > 1 ? "s" : ""} Shared!
          </h2>
          <p className="text-gray-400">
            {successCount} {successCount > 1 ? "posts" : "post"} uploaded
            successfully
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black">
      <style jsx global>{`
        .image-editor-container::-webkit-scrollbar {
          width: 1px;
          height: 1px;
        }
        .image-editor-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .image-editor-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        .image-editor-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .image-editor-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="flex items-center gap-3">
          {(step === 2 || step === 3) && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 1
              ? "Create new post"
              : step === 2
              ? "Crop"
              : "Create new post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full h-full pt-16">
        {step === 1 ? (
          // Step 1: Select Photos
          <div
            className="flex flex-col items-center justify-center w-full h-full"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-6 max-w-md px-6">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                <div className="flex items-center justify-center w-full h-full rounded-full bg-white dark:bg-black">
                  <ImageIcon className="w-12 h-12 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-2">
                  Drag photos here
                </h2>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Select from computer
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        ) : step === 2 ? (
          // Step 2: Adjust Images
          <div className="flex w-full h-full">
            {/* Image Preview Area */}
            <div className="flex-1 flex flex-col bg-black relative">
              {/* Image thumbnails at top if multiple images */}
              {selectedImages.length > 1 && (
                <div className="flex gap-2 p-3 border-b border-gray-800 overflow-x-auto">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative shrink-0">
                      <button
                        onClick={() => {
                          setCurrentImageIndex(index);

                          // Load saved crop settings for this image
                          const savedSettings = imageCropSettings[index];
                          if (savedSettings) {
                            setImageScale(savedSettings.scale);
                            setImageTranslate(savedSettings.translate);
                          } else {
                            setImageScale(1);
                            setImageTranslate({ x: 0, y: 0 });
                          }
                        }}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-blue-500 ring-2 ring-blue-500/50"
                            : "border-gray-700 hover:border-gray-500"
                        }`}
                      >
                        <img
                          src={img.preview}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Main image editor */}
              <div className="flex-1 flex items-center justify-center relative overflow-auto image-editor-container">
                <div
                  ref={imageContainerRef}
                  className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
                  style={{
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onWheel={handleWheel}
                >
                  {currentImage && (
                    <>
                      <img
                        src={currentImage.preview}
                        alt="Preview"
                        draggable={false}
                        className="max-w-full max-h-full object-contain pointer-events-none touch-none"
                        style={{
                          transform: `scale(${imageScale}) translate(${
                            imageTranslate.x / imageScale
                          }px, ${imageTranslate.y / imageScale}px)`,
                          transition: isDragging
                            ? "none"
                            : "transform 0.1s ease-out",
                        }}
                      />

                      {/* Grid overlay */}
                      {showGrid && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `
                              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: "33.33% 33.33%",
                          }}
                        >
                          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className="border border-white/20" />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Adjustments Sidebar */}
            <div className="w-80 lg:w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Image counter */}
                {selectedImages.length > 1 && (
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Image {currentImageIndex + 1} of {selectedImages.length}
                  </div>
                )}

                {/* Add more images button */}
                <button
                  onClick={() => additionalFilesRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Plus className="w-5 h-5" />
                  Add more images
                </button>
                <input
                  ref={additionalFilesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalFileSelect}
                  className="hidden"
                />

                {/* Adjustments */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Adjustments
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Zoom Level
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {(imageScale * 100).toFixed(0)}%
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setImageScale(1);
                        setImageTranslate({ x: 0, y: 0 });
                      }}
                      className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Reset Position
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                {currentImage && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Image Details
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span className="font-medium">File:</span>{" "}
                        {currentImage.file.name}
                      </p>
                      <p>
                        <span className="font-medium">Size:</span>{" "}
                        {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {currentImage.file.type}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleNext}
                  className="w-full px-4 py-3 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Step 3: Add Details & Share
          <div className="flex w-full h-full">
            {/* Images Preview */}
            <div className="flex-1 bg-black p-4 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-4">
                {selectedImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square w-full rounded-lg overflow-hidden"
                  >
                    <img
                      src={img.preview}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details Sidebar */}
            <div className="w-80 lg:w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Title Input */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a title..."
                    maxLength={100}
                    className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {title.length}/100
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a description..."
                    rows={8}
                    maxLength={2200}
                    className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {description.length}/2,200
                  </div>
                </div>

                {/* Summary */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Summary
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">Images:</span>{" "}
                      {selectedImages.length}
                    </p>
                    <p>
                      <span className="font-medium">Total Size:</span>{" "}
                      {(
                        selectedImages.reduce(
                          (acc, img) => acc + img.file.size,
                          0
                        ) /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleShare}
                  disabled={!title.trim() || !description.trim() || uploading}
                  className="w-full px-4 py-3 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Share{" "}
                      {selectedImages.length > 1
                        ? `${selectedImages.length} Posts`
                        : "Post"}
                    </>
                  )}
                </button>
                {(!title.trim() || !description.trim()) && (
                  <p className="mt-2 text-xs text-center text-red-500">
                    Please fill in all required fields
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

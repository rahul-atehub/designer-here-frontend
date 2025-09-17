"use client";
import { createContext, useContext, useState, useEffect } from "react";
import postsManager from "@/lib/postManager";

const LikedPostsContext = createContext();

export const LikedPostsProvider = ({ children }) => {
  const [likedPosts, setLikedPosts] = useState([]); // <-- start empty

  // ✅ Step 1: Sync with backend when provider mounts
  useEffect(() => {
    const userId = "demoUser123"; // later: replace with real auth user

    // Get local liked posts (safe on client)
    setLikedPosts(postsManager.getLikedPosts());

    // Sync with backend
    postsManager.syncWithBackend(userId).then((data) => {
      if (data?.likedPosts) {
        setLikedPosts(data.likedPosts);
      }
    });
  }, []);

  // ✅ Step 2: Toggle like
  const toggleLike = (post) => {
    const exists = likedPosts.find((p) => p.id === post.id);

    if (exists) {
      const updated = likedPosts.filter((p) => p.id !== post.id);
      setLikedPosts(updated);
      postsManager.toggleLike(post.id); // use toggleLike method
    } else {
      const updated = [...likedPosts, post];
      setLikedPosts(updated);
      postsManager.toggleLike(post.id);
    }
  };

  return (
    <LikedPostsContext.Provider value={{ likedPosts, toggleLike }}>
      {children}
    </LikedPostsContext.Provider>
  );
};

export const useLikedPosts = () => useContext(LikedPostsContext);

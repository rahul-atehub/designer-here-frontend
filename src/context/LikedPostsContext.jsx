"use client";
import { createContext, useContext, useState } from "react";

const LikedPostsContext = createContext();

export const LikedPostsProvider = ({ children }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (post) => {
    const exists = likedPosts.find((p) => p.id === post.id);
    if (exists) {
      // Remove if already liked
      setLikedPosts(likedPosts.filter((p) => p.id !== post.id));
    } else {
      // Add to liked posts
      setLikedPosts([...likedPosts, post]);
    }
  };

  return (
    <LikedPostsContext.Provider value={{ likedPosts, toggleLike }}>
      {children}
    </LikedPostsContext.Provider>
  );
};

export const useLikedPosts = () => useContext(LikedPostsContext);

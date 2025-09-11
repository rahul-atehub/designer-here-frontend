"use client";
import { createContext, useContext, useState } from "react";

const SavedPostsContext = createContext();

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);

  const toggleSave = (post) => {
    const exists = savedPosts.find((p) => p.id === post.id);
    if (exists) {
      setSavedPosts(savedPosts.filter((p) => p.id !== post.id));
    } else {
      setSavedPosts([...savedPosts, post]);
    }
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, toggleSave }}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = () => useContext(SavedPostsContext);

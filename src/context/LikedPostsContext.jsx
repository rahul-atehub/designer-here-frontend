// app/providers/LikedPostsProvider.jsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { useUser } from "./UserContext"; // adjust path to your UserProvider

const STORAGE_KEY = "likedPosts_v1";

const LikedPostsContext = createContext();

/**
 * Internal helpers that mimic the old postsManager local-storage behavior
 */
function _loadFromStorage(key) {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}
function _saveToStorage(key, setLikeData) {
  if (typeof window === "undefined") return;
  // accept either Set or Array
  const arr = Array.isArray(setLikeData)
    ? setLikeData
    : Array.from(setLikeData || []);
  localStorage.setItem(key, JSON.stringify(arr));
}

/**
 * Provider
 */
export const LikedPostsProvider = ({ children }) => {
  const { user, loading: userLoading } = useUser(); // keep using your UserProvider
  const [likedPosts, setLikedPosts] = useState([]); // array of post objects or ids
  const pending = useRef(new Map()); // track pending toggles per postId
  const mounted = useRef(false);

  // === Initialize from localStorage on first mount ===
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromStorage = _loadFromStorage(STORAGE_KEY);
    setLikedPosts(Array.isArray(fromStorage) ? fromStorage : []);
    mounted.current = true;
  }, []);

  // === Sync with backend whenever user becomes available ===
  // Expose syncWithBackend function below so other code can call it explicitly.
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      // logged out — clear liked posts
      setLikedPosts([]);
      _saveToStorage(STORAGE_KEY, []);
      return;
    }

    // on login, automatically sync once
    syncWithBackend(user.id).catch((err) => {
      // keep local state if fetch fails; optionally log
      console.error("auto syncWithBackend failed:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  // === Utility: check if a post is liked ===
  const isLiked = useCallback(
    (postId) => {
      if (!postId) return false;
      return likedPosts.some((p) => (p?.id ?? p) === postId);
    },
    [likedPosts]
  );

  // === getLikedPosts: return array (keeps old function name) ===
  const getLikedPosts = useCallback(() => {
    // If state empty, load from storage (keeps behavior similar to old)
    if (!likedPosts || likedPosts.length === 0) {
      const fromStorage = _loadFromStorage(STORAGE_KEY);
      setLikedPosts(Array.isArray(fromStorage) ? fromStorage : []);
      return Array.isArray(fromStorage) ? fromStorage : [];
    }
    return likedPosts;
  }, [likedPosts]);

  // === syncWithBackend: fetch authoritative liked posts for userId ===
  // Keeps the same function name as old postsManager
  const syncWithBackend = useCallback(
    async (userIdOverride) => {
      const uid = userIdOverride ?? user?.id;
      if (!uid) {
        // no user — clear
        setLikedPosts([]);
        _saveToStorage(STORAGE_KEY, []);
        return { likedPosts: [] };
      }

      try {
        // adjust endpoint path to match your backend
        const res = await axios.get(`/api/user/${uid}/likes`, {
          withCredentials: true,
        });
        const serverLikes = res?.data?.likedPosts ?? [];
        setLikedPosts(serverLikes);
        _saveToStorage(STORAGE_KEY, serverLikes);
        return { likedPosts: serverLikes };
      } catch (err) {
        console.error("syncWithBackend failed:", err);
        // return a shape similar to old manager error path
        return { likedPosts: _loadFromStorage(STORAGE_KEY) || [] };
      }
    },
    [user]
  );

  // === toggleLike: optimistic update, send to backend, rollback on error ===
  // Keeps same function name as before
  const toggleLike = useCallback(
    async (post) => {
      // accept either post object or postId
      const postId = post?.id ?? post;
      if (!postId) return;

      // avoid double toggles while pending
      if (pending.current.get(postId)) return;
      pending.current.set(postId, true);

      const currentlyLiked = isLiked(postId);

      // optimistic update (store full post if provided else store id)
      setLikedPosts((prev) => {
        const exists = prev.some((p) => (p?.id ?? p) === postId);
        if (exists) {
          return prev.filter((p) => (p?.id ?? p) !== postId);
        }
        // prefer storing the post object if available so consumers that expect object still work
        return post && typeof post === "object"
          ? [...prev, post]
          : [...prev, postId];
      });

      // persist optimistic state to localStorage
      // Note: we persist after state change by reading current state asynchronously via setTimeout 0
      // to ensure LocalStorage mirrors optimistic UI quickly.
      setTimeout(() => {
        _saveToStorage(
          STORAGE_KEY,
          likedPosts.length ? likedPosts : _loadFromStorage(STORAGE_KEY)
        );
      }, 0);

      try {
        // call backend: idempotent endpoints (POST to like, DELETE to unlike)
        const method = currentlyLiked ? "delete" : "post";
        const url = `/api/posts/${postId}/like`;
        const res = await axios({
          method,
          url,
          withCredentials: true,
        });

        // If server returns authoritative likedPosts array -> reconcile
        if (res?.data?.likedPosts) {
          setLikedPosts(res.data.likedPosts);
          _saveToStorage(STORAGE_KEY, res.data.likedPosts);
        } else if (res?.data?.liked !== undefined) {
          // server returned boolean; reconcile
          const likedFlag = res.data.liked;
          if (likedFlag !== !currentlyLiked) {
            // disagreement -> fetch authoritative list
            const fresh = await axios.get(`/api/user/${user?.id}/likes`, {
              withCredentials: true,
            });
            const serverLikes = fresh?.data?.likedPosts ?? [];
            setLikedPosts(serverLikes);
            _saveToStorage(STORAGE_KEY, serverLikes);
          } else {
            // server agrees — nothing to do
            // persist current optimistic
            _saveToStorage(STORAGE_KEY, _loadFromStorage(STORAGE_KEY));
          }
        } else {
          // server gave no helpful payload — keep optimistic state but persist it
          _saveToStorage(STORAGE_KEY, _loadFromStorage(STORAGE_KEY));
        }
      } catch (err) {
        console.error("toggleLike failed — rolling back:", err);
        // rollback
        setLikedPosts((prev) =>
          currentlyLiked
            ? // was liked previously → put it back
              post && typeof post === "object"
              ? [...prev, post]
              : [...prev, postId]
            : // was not liked previously → remove it
              prev.filter((p) => (p?.id ?? p) !== postId)
        );
        // persist rollback
        setTimeout(() => {
          _saveToStorage(STORAGE_KEY, _loadFromStorage(STORAGE_KEY));
        }, 0);
        // optional: you can enqueue this action for retry or show toast (not implemented)
      } finally {
        pending.current.delete(postId);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLiked, likedPosts, user?.id] // keep dependencies minimal but include what we reference
  );

  // Keep a stable context value; expose functions with the same names expected by consumers
  const contextValue = {
    likedPosts,
    toggleLike,
    isLiked,
    getLikedPosts,
    syncWithBackend,
  };

  return (
    <LikedPostsContext.Provider value={contextValue}>
      {children}
    </LikedPostsContext.Provider>
  );
};

export const useLikedPosts = () => useContext(LikedPostsContext);
export default LikedPostsProvider;

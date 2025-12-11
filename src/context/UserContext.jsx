"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API } from "@/config";

const UserContext = createContext(null);
export function UserProvider({ children, serverUser = undefined }) {
  // serverUser === undefined -> no server info (client-only), keep loading true until fetch
  // serverUser === null -> server confirmed "not logged in" (no flash)
  const [user, setUser] = useState(
    serverUser === undefined ? null : serverUser
  );
  const [loading, setLoading] = useState(
    serverUser === undefined ? true : false
  );

  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API.PROFILE.ME, {
        withCredentials: true,
      });

      const payload = res?.data?.data ?? res?.data ?? null;
      setUser(payload);
      setError(null);
    } catch (err) {
      setUser(null);
      setError({
        message: err?.message ?? "Unknown error",
        status: err?.response?.status ?? null,
        data: err?.response?.data ?? null,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // If SSR provided the user, do NOT fetch again immediately
    if (serverUser !== undefined) return;

    // Client-only: Fetch user on first mount
    fetchProfile();
  }, [serverUser]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "logout") {
        setUser(null);
        setLoading(false);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = async () => {
    try {
      // 1) Call backend to clear HttpOnly cookie
      await axios.post(API.AUTH.LOGOUT, {}, { withCredentials: true });

      // 2) Clear client-side stored tokens (if any)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      // 3) Remove global axios Authorization header (if you ever set it)
      if (axios.defaults.headers?.common?.Authorization) {
        delete axios.defaults.headers.common["Authorization"];
      }

      // 4) Reset React state
      setUser(null);
      setLoading(false); // <- ensure consumers know auth check finished

      // 5) Tell other tabs user logged out
      try {
        localStorage.setItem("logout", Date.now().toString());
      } catch (e) {
        /* ignore storage errors */
      }
    } catch (err) {
      console.error("Logout failed:", err);

      // Best effort cleanup
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      if (axios.defaults.headers?.common?.Authorization) {
        delete axios.defaults.headers.common["Authorization"];
      }
      setUser(null);
      setLoading(false); // <- also ensure loading false on error
      try {
        localStorage.setItem("logout", Date.now().toString());
      } catch (e) {
        /* ignore storage errors */
      }
    }
  };

  // Memoize value to avoid unnecessary re-renders of consumers
  const value = useMemo(() => {
    return {
      user,
      loading,
      error,
      setUser,
      refetchProfile: fetchProfile,
      logout,
    };
  }, [user, loading, error]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

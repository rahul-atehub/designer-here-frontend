"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API } from "@/config";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const res = await axios.get(API.USER.PROFILE, {
          withCredentials: true,
          signal: controller.signal, // cancels fetch on unmount
        });

        const payload = res?.data?.data ?? res?.data ?? null;
        setUser(payload);
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) return; // request was cancelled
        // normalize error so consumers can safely read it
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

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, []);

  // Memoize value to avoid unnecessary re-renders of consumers
  const value = useMemo(() => {
    // optionally expose helpers like login/logout later instead of setUser directly
    return { user, loading, error, setUser };
  }, [user, loading, error]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API } from "@/config";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await axios.post(API.AUTH.LOGOUT, {}, { withCredentials: true });
    } catch (err) {
      // ignore errors
    } finally {
      setUser(null);
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

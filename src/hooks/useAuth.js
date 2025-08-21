// hooks/useAuth.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Auth check failed:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/login", credentials);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/profile/admin");
      } else {
        router.push("/profile/user");
      }

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
    router.push("/auth");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    logout,
    checkAuth,
  };
};

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/config";

export default function useUserRole() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(API.PROFILE.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserRole(response.data.role);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setError("Session expired");
      } else {
        setError("Failed to verify user role");
      }
    } finally {
      setLoading(false);
    }
  };

  return { userRole, loading, error, checkUserRole };
}

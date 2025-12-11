// src/app/settings/page.jsx (or whatever your path is)
"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import AuthRequired from "@/components/ui/AuthRequired";
import UserSettings from "./user/page"; // user settings page
import AdminSettings from "./admin/page"; // admin settings page

export default function Settings() {
  const { user, loading, error } = useUser();
  const router = useRouter();

  const userRole = user?.role || null;

  // 🔄 Loading state (while UserContext is fetching /me)
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  // 🔐 Not authenticated or error → show AuthRequired
  if (error || !user) {
    return <AuthRequired />;
  }

  // 🧭 Route based on role
  if (userRole === "admin") {
    return <AdminSettings />;
  }

  if (userRole === "user") {
    return <UserSettings />;
  }

  //  Fallback if role is unknown / malformed
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          We couldn&apos;t determine your account permissions for settings.
        </p>
        <button
          onClick={() => router.push("/auth")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
        >
          Sign in again
        </button>
      </div>
    </div>
  );
}

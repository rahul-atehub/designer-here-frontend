"use client";

import { useRouter } from "next/navigation";
import useUserRole from "@/hooks/useUserRole";
import AuthRequired from "@/components/ui/AuthRequired";
import UserChatPage from "./user/page"; // explicit page import
import AdminChatPage from "./admin/page"; // explicit page import

export default function MessagesPage() {
  const { userRole, loading, error } = useUserRole();
  const router = useRouter();

  // Show loading spinner while verifying
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  // If not authenticated, show AuthRequired component
  if (error) {
    return <AuthRequired error={error} />;
  }
  if (userRole === "admin") {
    return <AdminChatPage />;
  } else if (userRole === "user") {
    return <UserChatPage />;
  }
  // Optional fallback if something unexpected happens
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
      <p>Redirecting...</p>
    </div>
  );
}

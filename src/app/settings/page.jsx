"use client";

import { useRouter } from "next/navigation";
import useUserRole from "@/hooks/useUserRole";
import AuthRequired from "@/components/ui/AuthRequired";
import UserSettings from "./user/page"; // explicit page import
import AdminSettings from "./admin/page"; // explicit page import

export default function Settings() {
  const { userRole, loading, error } = useUserRole();
  const router = useRouter();

  // Show authentication required if no valid role
  if (error) {
    return <AuthRequired error={error} />;
  }
  if (userRole === "admin") {
    return <AdminSettings />;
  } else if (userRole === "user") {
    return <UserSettings />;
  }

  // This shouldn't be reached as users are redirected, but just in case
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
    </div>
  );
}

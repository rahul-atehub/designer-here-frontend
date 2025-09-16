import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import axios from "axios";
import { API } from "@/config";

const UserCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(API.USER.PROFILE); // backend endpoint
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser({ name: "Guest" }); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 transition">
      <div className="relative">
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-red-500 shadow-sm">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-black dark:text-white truncate">
              {user?.name || "Guest"}
            </p>
            {user?.email && (
              <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                {user.email}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserCard;

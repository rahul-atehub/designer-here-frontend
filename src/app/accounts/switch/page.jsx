"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LayoutWrapper from "@/Components/LayoutWrapper";
import { API } from "@/config";
import { useUser } from "@/context/UserContext";
import AddAccountModal from "@/app/accounts/AddAccountModal";
import { User, Plus, ArrowLeft } from "lucide-react";

export default function SwitchAccountPage() {
  const { user: currentUser, refetchProfile } = useUser();
  const router = useRouter();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchingUserId, setSwitchingUserId] = useState(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API.ACCOUNTS.LINKED, {
        withCredentials: true,
      });
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
      setMessage({
        type: "error",
        text: "Failed to load accounts",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async (userId) => {
    try {
      setSwitchingUserId(userId);

      await axios.post(
        API.ACCOUNTS.SWITCH,
        { userId },
        { withCredentials: true },
      );

      // Refetch profile to update user context
      await refetchProfile();

      // Redirect to profile
      router.push("/profile");
    } catch (error) {
      console.error("Error switching account:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to switch account",
      });
      setSwitchingUserId(null);
    }
  };

  const handleAccountAdded = () => {
    setShowAddAccountModal(false);
    fetchLinkedAccounts();
    setMessage({
      type: "success",
      text: "Account added successfully!",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) {
    const LoadingSpinner = (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    );

    return isMobile ? (
      LoadingSpinner
    ) : (
      <LayoutWrapper>{LoadingSpinner}</LayoutWrapper>
    );
  }

  const PageContent = (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <button
            onClick={() => router.back()}
            className="md:hidden flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-8 md:mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black dark:text-white mb-3">
            Switch Account
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Switch between your linked accounts
          </p>
        </div>

        {/* Message Alert */}
        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`mb-8 md:mb-10 p-4 rounded-lg text-sm font-medium border ${
                message.type === "success"
                  ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300"
                  : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Accounts List */}
        <div className="space-y-3 md:space-y-5">
          {accounts.map((account) => {
            const isCurrent = account.isCurrent;
            const isSwitching = switchingUserId === account.id;

            return (
              <motion.button
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => !isCurrent && handleSwitchAccount(account.id)}
                disabled={isCurrent || isSwitching}
                className={`w-full border rounded-xl p-4 md:p-8 transition-all duration-200 text-left ${
                  isCurrent
                    ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 cursor-default"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                } ${isSwitching ? "opacity-50 cursor-wait" : ""}`}
              >
                <div className="flex items-center gap-3 md:gap-5">
                  {/* Profile Picture */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 md:w-20 md:h-20 border-2 border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-900">
                      {isSwitching ? (
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                      ) : account.profilePic ? (
                        <Image
                          src={account.profilePic}
                          alt={account.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 md:w-7 md:h-7 text-black dark:text-white" />
                      )}
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-lg font-medium text-black dark:text-white mb-0.5 md:mb-1">
                      {account.name}
                    </p>
                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 truncate">
                      @{account.username}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 md:mt-1.5 truncate">
                      {account.email}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Add Account Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => setShowAddAccountModal(true)}
            className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-5 md:p-8 hover:border-black dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4 md:w-6 md:h-6 text-black dark:text-white" />
              </div>
              <span className="text-sm md:text-base font-medium text-black dark:text-white">
                Add Another Account
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? PageContent : <LayoutWrapper>{PageContent}</LayoutWrapper>}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <AddAccountModal
          onClose={() => setShowAddAccountModal(false)}
          onSuccess={handleAccountAdded}
        />
      )}
    </>
  );
}

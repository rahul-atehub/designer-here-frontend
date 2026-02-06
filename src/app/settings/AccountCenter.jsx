// src/app/settings/AccountCenter.jsx

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/config";
import { Users, SettingsIcon, User, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountCenter({ defaultTab = "switch" }) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(defaultTab);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  // Account switching states
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [switchingUserId, setSwitchingUserId] = useState(null);

  // Account ownership states
  const [ownershipAction, setOwnershipAction] = useState(null);
  const [ownershipData, setOwnershipData] = useState({
    username: "",
    password: "",
    confirmation: "",
  });
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);

  // Toast helper functions
  const showSuccess = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showError = (message) => {
    setToastMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 3000);
  };

  // Fetch linked accounts on mount
  useEffect(() => {
    if (activeSection === "switch") {
      fetchLinkedAccounts();
    }
  }, [activeSection]);

  const fetchLinkedAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const response = await axios.get(API.ACCOUNTS.LINKED, {
        withCredentials: true,
      });
      setLinkedAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
      showError("Failed to load linked accounts");
    } finally {
      setLoadingAccounts(false);
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

      window.location.reload();
      showSuccess("Account switched successfully");
    } catch (error) {
      console.error("Error switching account:", error);
      showError(error.response?.data?.message || "Failed to switch account");
      setSwitchingUserId(null);
    }
  };

  const handleUnlinkAccount = async (userId, username) => {
    if (!window.confirm(`Unlink account @${username}?`)) return;

    try {
      await axios.delete(API.ACCOUNTS.UNLINK(userId), {
        withCredentials: true,
      });

      fetchLinkedAccounts();
      showSuccess("Account unlinked successfully");
    } catch (error) {
      console.error("Error unlinking account:", error);
      showError("Failed to unlink account");
    }
  };

  const handleOwnershipAction = async () => {
    if (!ownershipData.username || !ownershipData.password) {
      showError("Username and password are required");
      return;
    }

    const expectedConfirmation =
      ownershipAction === "delete" ? "DELETE" : "DEACTIVATE";
    if (ownershipData.confirmation !== expectedConfirmation) {
      showError(`Please type "${expectedConfirmation}" to confirm`);
      return;
    }

    try {
      setIsSaving(true);

      if (ownershipAction === "delete") {
        await axios.delete(API.USER.DELETE_ACCOUNT, {
          data: {
            username: ownershipData.username,
            password: ownershipData.password,
          },
          withCredentials: true,
        });
      } else {
        const response = await axios.post(
          API.USER.DEACTIVATE_ACCOUNT,
          {
            username: ownershipData.username,
            password: ownershipData.password,
          },
          { withCredentials: true },
        );

        // Check if self-deactivation
        if (response.data.isSelfDeactivation) {
          document.cookie =
            "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("auth_token");
          window.location.href =
            "/login?message=Account deactivated successfully";
          return; // Exit early
        }
      }

      showSuccess(
        `Account ${ownershipAction === "delete" ? "deleted" : "deactivated"} successfully`,
      );

      setShowOwnershipModal(false);
      setOwnershipData({ username: "", password: "", confirmation: "" });
      fetchLinkedAccounts();
    } catch (error) {
      console.error("Error performing action:", error);
      showError(
        error.response?.data?.message || `Failed to ${ownershipAction} account`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div>
          <h2 className="text-2xl font-light text-black dark:text-white mb-8">
            Account Center
          </h2>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto mb-8">
            <button
              onClick={() => setActiveSection("switch")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeSection === "switch"
                  ? "border-black dark:border-white text-black dark:text-white"
                  : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Accounts
              </div>
            </button>
            <button
              onClick={() => setActiveSection("ownership")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeSection === "ownership"
                  ? "border-black dark:border-white text-black dark:text-white"
                  : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Account Ownership
              </div>
            </button>
          </div>

          {/* SWITCH ACCOUNTS CONTENT */}
          {activeSection === "switch" && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light text-black dark:text-white">
                  Linked Accounts
                </h3>
                <button
                  onClick={() => router.push("/accounts/switch")}
                  className="px-4 py-2 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                >
                  Add Account
                </button>
              </div>

              {loadingAccounts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {linkedAccounts.map((account) => {
                    const isCurrent = account.isCurrent;
                    const isSwitching = switchingUserId === account.id;

                    return (
                      <div
                        key={account.id}
                        className={`border rounded-lg p-5 transition-all relative ${
                          isCurrent
                            ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-900"
                            : !account.isActive
                              ? "border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
                              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                        }`}
                      >
                        {/* Clickable overlay for switching - only for active, non-current accounts */}
                        {!isCurrent && account.isActive && (
                          <button
                            onClick={() => handleSwitchAccount(account.id)}
                            disabled={isSwitching}
                            className="absolute inset-0 w-full h-full cursor-pointer"
                            aria-label={`Switch to ${account.name}`}
                          />
                        )}

                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4 flex-1 pointer-events-none">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                              {isSwitching ? (
                                <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                              ) : !account.isActive || account.isDeleted ? (
                                <img
                                  src="/avatar-placeholder.png"
                                  alt={
                                    account.isDeleted
                                      ? "Deleted"
                                      : "Deactivated"
                                  }
                                  className="w-full h-full object-cover scale-120"
                                />
                              ) : account.profilePic ? (
                                <img
                                  src={account.profilePic}
                                  alt={account.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-black dark:text-white" />
                              )}
                            </div>

                            {/* Account Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  !account.isActive || account.isDeleted
                                    ? "text-zinc-400 dark:text-zinc-600"
                                    : "text-black dark:text-white"
                                }`}
                              >
                                {account.isDeleted
                                  ? "Deleted User"
                                  : !account.isActive
                                    ? "Deactivated"
                                    : account.name}
                              </p>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                @{account.username}
                              </p>
                            </div>
                          </div>

                          {/* Remove Button - only show for non-current accounts */}
                          {!isCurrent && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the card click
                                handleUnlinkAccount(
                                  account.id,
                                  account.username,
                                );
                              }}
                              className="px-3 py-2 text-xs font-medium border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-all pointer-events-auto"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT OWNERSHIP CONTENT */}
          {activeSection === "ownership" && (
            <>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Manage your data, modify your legacy contact, deactivate or
                delete your accounts and profiles.
              </p>

              {/* Deactivate Any Account */}
              <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8">
                <div className="flex items-start gap-3">
                  <LogOut className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mt-1 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-light text-black dark:text-white mb-2">
                      Deactivate Account
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                      Temporarily disable any of your linked accounts. You can
                      reactivate it anytime by logging in with that account's
                      credentials.
                    </p>
                    <button
                      onClick={() => {
                        setOwnershipAction("deactivate");
                        setShowOwnershipModal(true);
                      }}
                      className="px-5 py-3 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                      Deactivate an Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Any Account */}
              <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mt-1 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-light text-black dark:text-white mb-2">
                      Delete Account
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                      Permanently delete any of your linked accounts and all
                      associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={() => {
                        setOwnershipAction("delete");
                        setShowOwnershipModal(true);
                      }}
                      className="px-5 py-3 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                      Delete an Account
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Account Ownership Modal */}
      {showOwnershipModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 max-w-md w-full mx-4 bg-white dark:bg-black">
            <h2 className="text-xl font-light text-black dark:text-white mb-3">
              {ownershipAction === "delete" ? "Delete" : "Deactivate"} Account
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Enter the username and password of the account you want to{" "}
              {ownershipAction}.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={ownershipData.username}
                  onChange={(e) =>
                    setOwnershipData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="username"
                  className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={ownershipData.password}
                  onChange={(e) =>
                    setOwnershipData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                  Type "{ownershipAction === "delete" ? "DELETE" : "DEACTIVATE"}
                  " to confirm
                </label>
                <input
                  type="text"
                  value={ownershipData.confirmation}
                  onChange={(e) =>
                    setOwnershipData((prev) => ({
                      ...prev,
                      confirmation: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder={
                    ownershipAction === "delete" ? "DELETE" : "DEACTIVATE"
                  }
                  className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOwnershipModal(false);
                  setOwnershipData({
                    username: "",
                    password: "",
                    confirmation: "",
                  });
                  setOwnershipAction(null);
                }}
                className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleOwnershipAction}
                disabled={
                  isSaving ||
                  !ownershipData.username ||
                  !ownershipData.password ||
                  ownershipData.confirmation !==
                    (ownershipAction === "delete" ? "DELETE" : "DEACTIVATE")
                }
                className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
              >
                {isSaving
                  ? `${ownershipAction === "delete" ? "Deleting" : "Deactivating"}...`
                  : ownershipAction === "delete"
                    ? "Delete"
                    : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

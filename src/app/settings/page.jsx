// src/app/settings/page.jsx

"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API } from "@/config";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";
import AccountCenter from "@/app/settings/AccountCenter";
import { useUser } from "@/context/UserContext";
import AuthRequired from "@/components/ui/AuthRequired";
import {
  User,
  Lock,
  Users,
  Bell,
  Ban,
  Shield,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronUp,
  Upload,
  Mail,
  MessageSquare,
  FileText,
  HelpCircle,
  Trash2,
  LogOut,
} from "lucide-react";
import LayoutWrapper from "@/Components/LayoutWrapper";
import PasswordAndSecurity from "@/app/settings/PasswordAndSecurity";

function SettingsContent() {
  const {
    user: contextUser,
    loading: userLoading,
    error: userError,
  } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const searchParams = useSearchParams();
  const [expandedSections, setExpandedSections] = useState({ profile: true });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  const isAdmin = contextUser?.role === "admin";

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

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
      // Also expand the corresponding section
      setExpandedSections((prev) => ({
        ...prev,
        [tab]: true,
      }));
    }
  }, [searchParams]);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    profilePicture: null,
    profilePicturePreview: null,
    username: "",
    gender: "",
    customGender: "",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state
  const [deleteData, setDeleteData] = useState({
    password: "",
    inputConfirmation: "",
  });

  const [deactivateData, setDeactivateData] = useState({
    password: "",
    inputConfirmation: "",
  });

  // Admin states
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchAdminEmail, setSearchAdminEmail] = useState("");
  const [adminPromotionResult, setAdminPromotionResult] = useState(null);
  const [blockedAccounts, setBlockedAccounts] = useState([]);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newPostNotifications: true,
    messageNotifications: true,
    weeklyDigest: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    allowMessages: true,
    showActivity: true,
  });

  const sections = [
    {
      id: "profile",
      label: "Edit Profile",
      icon: User,
      subsections: [
        {
          id: "profile-picture",
          label: "Profile Picture",
          contentId: "profile",
        },
        { id: "basic-info", label: "Basic Info", contentId: "profile" },
        { id: "bio", label: "Bio", contentId: "profile" },
      ],
    },
    {
      id: "password",
      label: "Password & Security",
      icon: Lock,
      subsections: [
        {
          id: "change-password",
          label: "Change Password",
          contentId: "password",
        },
        {
          id: "password-recovery",
          label: "Password Recovery",
          contentId: "recovery",
        },
        {
          id: "change-email",
          label: "Change Email",
          contentId: "email",
        },
      ],
    },
    ...(isAdmin
      ? [
          {
            id: "admin",
            label: "Team Management",
            icon: Users,
            subsections: [
              { id: "add-members", label: "Add Members", contentId: "admin" },
              { id: "member-list", label: "Member List", contentId: "admin" },
            ],
          },
        ]
      : []),
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      subsections: [
        {
          id: "email-alerts",
          label: "Email Alerts",
          contentId: "notifications",
        },
        {
          id: "post-updates",
          label: "Post Updates",
          contentId: "notifications",
        },
        { id: "messages", label: "Messages", contentId: "notifications" },
      ],
    },
    ...(isAdmin
      ? [
          {
            id: "blocked",
            label: "Blocked Accounts",
            icon: Ban,
            subsections: [
              {
                id: "blocked-list",
                label: "Blocked List",
                contentId: "blocked",
              },
            ],
          },
        ]
      : []),
    {
      id: "privacy",
      label: "Privacy & Help",
      icon: Shield,
      subsections: [
        {
          id: "privacy-settings",
          label: "Privacy Settings",
          contentId: "privacy",
        },
        { id: "documentation", label: "Documentation", contentId: "privacy" },
      ],
    },
    {
      id: "account",
      label: "Account Center",
      icon: SettingsIcon,
      subsections: [
        { id: "accounts", label: "Accounts", contentId: "accounts" },
        {
          id: "account-ownership",
          label: "Account Ownership",
          contentId: "ownership",
        },
      ],
    },
  ];

  useEffect(() => {
    fetchUserData();
    if (activeTab === "admin" && isAdmin) {
      fetchUsers();
    }
    if (activeTab === "blocked") {
      if (isAdmin) {
        fetchBlockedAccounts();
      }
    }
  }, [activeTab, isAdmin]);

  // keep the sub-sections expanded when their content is active
  useEffect(() => {
    const activeSection = sections.find((section) =>
      section.subsections.some((sub) => sub.contentId === activeTab),
    );

    if (activeSection) {
      setExpandedSections((prev) => ({
        ...prev,
        [activeSection.id]: true,
      }));
    }
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API.PROFILE.ME, {
        withCredentials: true,
      });

      console.log("Full API Response:", response);
      console.log("Response data:", response.data);

      setProfile({
        name: response.data.name || "",
        bio: response.data.bio || "",
        email: response.data.email || "",
        profilePicture: response.data.profilePicture || null,
        profilePicturePreview: response.data.profilePicture || null,
        username: response.data.username || "",
        gender: response.data.gender || "",
        customGender: response.data.customGender || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API.ADMIN.USERS, {
        withCredentials: true,
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchBlockedAccounts = async () => {
    try {
      const response = await axios.get(API.ADMIN.BLOCKED_USERS, {
        withCredentials: true,
      });
      setBlockedAccounts(response.data.blockedUsers || []);
    } catch (error) {
      console.error("Error fetching blocked accounts:", error);
    }
  };

  const toggleSection = (sectionId, e) => {
    e.stopPropagation();
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSubsectionClick = (contentId) => {
    setActiveTab(contentId);

    // Find and expand the parent section
    const parentSection = sections.find((section) =>
      section.subsections.some((sub) => sub.contentId === contentId),
    );

    if (parentSection) {
      setExpandedSections((prev) => ({
        ...prev,
        [parentSection.id]: true,
      }));
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      showError("Invalid image format. Allowed: PNG, JPG, JPEG, GIF, WEBP");
      return;
    }

    try {
      setIsUploadingPicture(true);
      setShowProfilePictureModal(false);

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.put(API.PROFILE.PICTURE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local state with new picture
      setProfile((prev) => ({
        ...prev,
        profilePicture: response.data.data.profilePicture,
        profilePicturePreview: response.data.data.profilePicture,
      }));

      showSuccess("Profile picture uploaded");
      fetchUserData(); // Refetch to sync
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      showError(
        error.response?.data?.message || "Failed to upload profile picture",
      );
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("bio", profile.bio);
      formData.append("email", profile.email);
      formData.append("username", profile.username);
      formData.append("gender", profile.gender);
      if (profile.gender === "custom") {
        formData.append("customGender", profile.customGender);
      }

      // Note: Profile picture is NOT included here anymore
      // It's handled separately via uploadProfilePicture

      const response = await axios.put(API.PROFILE.ME, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccess("Profile updated");
      fetchUserData(); // Refetch to sync
    } catch (error) {
      console.error("Error updating profile:", error);
      showError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      setIsUploadingPicture(true);
      setShowProfilePictureModal(false);

      await axios.delete(API.PROFILE.PICTURE, {
        withCredentials: true,
      });

      // Update local state
      setProfile((prev) => ({
        ...prev,
        profilePicture: null,
        profilePicturePreview: null,
      }));

      showSuccess("Profile picture removed");
      fetchUserData(); // Refetch to sync
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      showError(
        error.response?.data?.message || "Failed to remove profile picture",
      );
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    try {
      setIsSaving(true);
      await axios.put(
        API.USER.CHANGE_PASSWORD,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          withCredentials: true,
        },
      );

      showSuccess("Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      showError("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!searchAdminEmail) {
      showError("Please enter a user email");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(
        API.ADMIN.MAKE_ADMIN,
        { email: searchAdminEmail },
        {
          withCredentials: true,
        },
      );

      setAdminPromotionResult({
        success: true,
        message: `User ${searchAdminEmail} promoted to team member successfully!`,
      });
      setSearchAdminEmail("");
      setTimeout(() => setAdminPromotionResult(null), 3000);
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      setAdminPromotionResult({
        success: false,
        message: error.response?.data?.message || "Failed to promote user",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeFromAdmin = async (userId) => {
    if (!window.confirm("Remove this user from team members?")) return;

    try {
      await axios.post(
        API.ADMIN.REMOVE_ADMIN,
        { userId },
        {
          withCredentials: true,
        },
      );
      fetchUsers();
      showSuccess("User removed from team members");
    } catch (error) {
      console.error("Error removing admin:", error);
      showError("Failed to remove user from team");
    }
  };

  const blockUser = async (userId) => {
    try {
      await axios.post(
        API.ADMIN.BLOCK_USER,
        { userId },
        {
          withCredentials: true,
        },
      );
      fetchUsers();
      fetchBlockedAccounts();
      showSuccess("User blocked successfully");
    } catch (error) {
      console.error("Error blocking user:", error);
      showError("Failed to block user");
    }
  };

  const unblockUser = async (userId) => {
    try {
      await axios.post(
        API.ADMIN.UNBLOCK_USER,
        { userId },
        {
          withCredentials: true,
        },
      );
      fetchUsers();
      fetchBlockedAccounts();
      showSuccess("User unblocked successfully");
    } catch (error) {
      console.error("Error unblocking user:", error);
      showError("Failed to unblock user");
    }
  };

  const deleteAccount = async () => {
    if (deleteData.inputConfirmation !== "DELETE") {
      showError('Please type "DELETE" to confirm');
      return;
    }

    try {
      setIsSaving(true);
      await axios.delete(API.USER.DELETE_ACCOUNT, {
        data: { password: deleteData.password },
        withCredentials: true,
      });

      localStorage.removeItem("auth_token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      showError("Failed to delete account");
    } finally {
      setIsSaving(false);
    }
  };

  const deactivateAccount = async () => {
    if (deactivateData.inputConfirmation !== "DEACTIVATE") {
      showError('Please type "DEACTIVATE" to confirm');
      return;
    }

    try {
      setIsSaving(true);
      const response = await axios.post(
        API.USER.DEACTIVATE_ACCOUNT,
        {
          username: contextUser.username, // ADD THIS
          password: deactivateData.password,
        },
        {
          withCredentials: true,
        },
      );

      // Check if self-deactivation
      if (response.data.isSelfDeactivation) {
        // Clear cookies and redirect
        document.cookie =
          "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("auth_token");
        window.location.href =
          "/login?message=Account deactivated successfully";
      } else {
        // Linked account deactivated, just refresh list
        showSuccess(`Account @${response.data.deactivatedAccount} deactivated`);
        setShowDeactivateModal(false);
      }
    } catch (error) {
      console.error("Error deactivating account:", error);
      showError("Failed to deactivate account");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isBlocked) ||
      (filterStatus === "blocked" && user.isBlocked);
    return matchesSearch && matchesFilter;
  });

  // 🔄 Loading state (while UserContext is fetching /me)
  if (userLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  // 🔐 Not authenticated or error → show AuthRequired
  if (userError || !contextUser) {
    return <AuthRequired />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <LayoutWrapper>
        <Head>
          <title>Settings - DesignStudio</title>
        </Head>

        <style>{`
        /* Thin scrollbar for all browsers */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #d4d4d8;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }

        /* Dark mode scrollbar */
        .dark ::-webkit-scrollbar-thumb {
          background: #52525b;
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }

        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #d4d4d8 transparent;
        }

        .dark {
          scrollbar-color: #52525b transparent;
        }
      `}</style>

        <div className="min-h-screen bg-white dark:bg-neutral-950">
          <div className="flex">
            {/* Left Sidebar Navigation */}
            <div className="hidden xl:flex flex-col w-72 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 px-6 py-8 sticky top-0 h-screen overflow-y-auto">
              {/* Settings Header */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  Settings
                </h2>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isExpanded = expandedSections[section.id];
                  const isActive =
                    activeTab === section.id ||
                    section.subsections.some(
                      (sub) => sub.contentId === activeTab,
                    );
                  return (
                    <div key={section.id}>
                      <div
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
                          isActive
                            ? "bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <button
                          onClick={() => {
                            setActiveTab(section.subsections[0].contentId);
                          }}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {section.label}
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(section.id, e);
                          }}
                          className="text-black dark:text-white transition-transform duration-300 hover:opacity-70 ml-2"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Subsections */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <div className="ml-4 mt-1 space-y-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                          {section.subsections.map((subsection) => (
                            <button
                              key={subsection.id}
                              onClick={() =>
                                handleSubsectionClick(subsection.contentId)
                              }
                              className={`w-full text-left text-xs px-3 py-2 rounded transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                                isActive
                                  ? "text-black dark:text-white font-medium"
                                  : "text-zinc-600 dark:text-zinc-400"
                              }`}
                            >
                              {subsection.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-8 py-12 max-w-5xl mx-auto w-full overflow-y-auto">
              {/* Content Sections */}
              <div className="space-y-8">
                {/* EDIT PROFILE TAB */}
                {activeTab === "profile" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                        Edit Profile
                      </h2>

                      {/* Profile Picture Card */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8">
                        <div className="flex items-start gap-8">
                          <div className="relative">
                            <div className="w-32 h-32 border-2 border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-white dark:bg-zinc-900">
                              {isUploadingPicture ? (
                                <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                              ) : profile.profilePicturePreview ? (
                                <img
                                  src={profile.profilePicturePreview}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-black dark:text-white" />
                              )}
                            </div>
                            <button
                              onClick={() => setShowProfilePictureModal(true)}
                              disabled={isUploadingPicture}
                              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-black dark:text-white disabled:opacity-50"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex-1 pt-2">
                            <p className="text-sm text-black dark:text-white font-medium">
                              {profile.username || "username"}
                            </p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                              {profile.name || "name"}
                            </p>
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Profile Fields */}
                      <div className="space-y-6 mb-8">
                        {/* Username and Name in one row */}
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                              Username
                            </label>
                            <input
                              type="text"
                              value={profile.username || ""}
                              onChange={(e) =>
                                handleProfileChange("username", e.target.value)
                              }
                              placeholder="Enter your username"
                              className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                              Name
                            </label>
                            <input
                              type="text"
                              value={profile.name}
                              onChange={(e) =>
                                handleProfileChange("name", e.target.value)
                              }
                              placeholder="Enter your name"
                              className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                            />
                          </div>
                        </div>

                        {/* Gender Section */}
                        <div className="grid grid-cols-2 gap-8">
                          <div className="relative">
                            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                              Gender
                            </label>
                            <button
                              onClick={() =>
                                setShowGenderDropdown(!showGenderDropdown)
                              }
                              className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all text-left flex items-center justify-between"
                            >
                              <span>
                                {profile.gender === "custom" &&
                                profile.customGender
                                  ? profile.customGender
                                  : profile.gender
                                    ? profile.gender.charAt(0).toUpperCase() +
                                      profile.gender.slice(1).replace(/_/g, " ")
                                    : "Select Gender"}
                              </span>
                              {showGenderDropdown ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>

                            {/* Gender Dropdown */}
                            {showGenderDropdown && (
                              <div className="absolute top-full mt-1 w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg shadow-lg z-10">
                                <div className="p-4 space-y-4">
                                  {[
                                    { value: "female", label: "Female" },
                                    { value: "male", label: "Male" },
                                    { value: "custom", label: "Custom" },
                                    {
                                      value: "prefer_not_to_say",
                                      label: "Prefer not to say",
                                    },
                                  ].map((option) => (
                                    <div key={option.value}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleProfileChange(
                                            "gender",
                                            option.value,
                                          );
                                          if (option.value !== "custom") {
                                            setShowGenderDropdown(false);
                                          }
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-left"
                                      >
                                        <label className="text-sm text-black dark:text-white cursor-pointer">
                                          {option.label}
                                        </label>
                                        <div
                                          className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${
                                            profile.gender === option.value
                                              ? "border-black dark:border-white"
                                              : "border-zinc-300 dark:border-zinc-700"
                                          }`}
                                        >
                                          {profile.gender === option.value && (
                                            <div className="w-3 h-3 rounded-full bg-black dark:bg-white" />
                                          )}
                                        </div>
                                      </button>

                                      {/* Custom Gender Input - appears right after custom button */}
                                      {option.value === "custom" &&
                                        profile.gender === "custom" && (
                                          <input
                                            type="text"
                                            value={profile.customGender || ""}
                                            onChange={(e) =>
                                              handleProfileChange(
                                                "customGender",
                                                e.target.value,
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                setShowGenderDropdown(false);
                                              }
                                            }}
                                            onBlur={() => {
                                              setShowGenderDropdown(false);
                                            }}
                                            autoFocus
                                            className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                                          />
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        <div>
                          <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                            Bio
                          </label>
                          <textarea
                            value={profile.bio}
                            onChange={(e) =>
                              handleProfileChange("bio", e.target.value)
                            }
                            placeholder="Tell us about yourself..."
                            rows="4"
                            className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="w-full px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                )}

                {/* PASSWORD & SECURITY TAB */}
                {(activeTab === "password" ||
                  activeTab === "email" ||
                  activeTab === "recovery") && (
                  <PasswordAndSecurity
                    defaultTab={
                      activeTab === "recovery" ? "forgot-password" : activeTab
                    }
                  />
                )}

                {/* TEAM MANAGEMENT TAB - Admin Only */}
                {activeTab === "admin" && isAdmin && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                        Team Management
                      </h2>

                      {/* Add Team Member Card */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8">
                        <h3 className="text-lg font-light text-black dark:text-white mb-2">
                          Add Team Member
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                          Grant team member privileges to a user by searching
                          their email
                        </p>

                        {adminPromotionResult && (
                          <div
                            className={`p-4 rounded-lg mb-6 text-xs font-medium border ${
                              adminPromotionResult.success
                                ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300"
                                : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {adminPromotionResult.message}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <input
                            type="email"
                            placeholder="Enter user email"
                            value={searchAdminEmail}
                            onChange={(e) =>
                              setSearchAdminEmail(e.target.value)
                            }
                            className="flex-1 text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                          />
                          <button
                            onClick={promoteToAdmin}
                            disabled={isSaving}
                            className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all whitespace-nowrap"
                          >
                            {isSaving ? "Adding..." : "Add Member"}
                          </button>
                        </div>
                      </div>

                      {/* Team Members List */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                        <h3 className="text-lg font-light text-black dark:text-white mb-6">
                          Team Members
                        </h3>

                        <div className="flex gap-3 mb-8">
                          <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                          />
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                          >
                            <option value="all">All Members</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <div
                                key={user._id}
                                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex items-center justify-between transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
                              >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="w-12 h-12 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-zinc-900">
                                    {user.profilePicture ? (
                                      <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 text-black dark:text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-black dark:text-white">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                  <span
                                    className={`text-xs px-3 py-1 rounded border ${
                                      user.isBlocked
                                        ? "border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
                                        : "border-green-200 dark:border-green-900 text-green-700 dark:text-green-400"
                                    }`}
                                  >
                                    {user.isBlocked ? "Blocked" : "Active"}
                                  </span>
                                </div>
                                <div className="flex gap-2 ml-4 shrink-0">
                                  <button
                                    onClick={() =>
                                      user.isBlocked
                                        ? unblockUser(user._id)
                                        : blockUser(user._id)
                                    }
                                    className={`px-3 py-2 text-xs font-medium border rounded-lg transition-all ${
                                      user.isBlocked
                                        ? "border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950"
                                        : "border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                                    }`}
                                  >
                                    {user.isBlocked ? "Unblock" : "Block"}
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                No team members found
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                        Notifications
                      </h2>

                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                        <h3 className="text-lg font-light text-black dark:text-white mb-8">
                          Email Alerts
                        </h3>
                        <div className="space-y-6">
                          {[
                            {
                              key: "emailNotifications",
                              label: "General Notifications",
                              icon: Mail,
                              desc: "Receive important updates via email",
                            },
                            {
                              key: "newPostNotifications",
                              label: "New Post Updates",
                              icon: FileText,
                              desc: "Get notified when users post new content",
                            },
                            {
                              key: "messageNotifications",
                              label: "Message Alerts",
                              icon: MessageSquare,
                              desc: "Get notified when you receive new messages",
                            },
                            {
                              key: "weeklyDigest",
                              label: "Weekly Summary",
                              icon: Bell,
                              desc: "Receive a summary of activities every week",
                            },
                          ].map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <div
                                key={item.key}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-start gap-4">
                                  <ItemIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-black dark:text-white">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setNotifications((prev) => ({
                                      ...prev,
                                      [item.key]: !prev[item.key],
                                    }))
                                  }
                                  className={`relative w-12 h-6 rounded-full transition-all duration-300 border border-zinc-600 dark:border-zinc-600 shrink-0 ${
                                    notifications[item.key]
                                      ? "bg-zinc-700 dark:bg-zinc-700"
                                      : "bg-zinc-200 dark:bg-zinc-800"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 w-5 h-5 border border-zinc-200 dark:border-zinc-800 rounded-full transition-transform duration-300 bg-white dark:bg-black ${
                                      notifications[item.key]
                                        ? "translate-x-6"
                                        : "translate-x-0.5"
                                    }`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BLOCKED ACCOUNTS TAB */}
                {activeTab === "blocked" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                        Blocked Accounts
                      </h2>

                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                          {isAdmin
                            ? "Manage accounts you have blocked or that have been blocked by you"
                            : "Manage accounts you have blocked"}
                        </p>

                        <div className="space-y-3">
                          {isAdmin ? (
                            blockedAccounts.length > 0 ? (
                              blockedAccounts.map((user) => (
                                <div
                                  key={user._id}
                                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex items-center justify-between transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                >
                                  <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-zinc-900">
                                      {user.profilePicture ? (
                                        <img
                                          src={user.profilePicture}
                                          alt={user.name}
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      ) : (
                                        <User className="w-5 h-5 text-black dark:text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-black dark:text-white">
                                        {user.name}
                                      </p>
                                      <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => unblockUser(user._id)}
                                    className="px-3 py-2 text-xs font-medium border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 rounded-lg transition-all hover:bg-green-50 dark:hover:bg-green-950"
                                  >
                                    Unblock
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                  No blocked accounts
                                </p>
                              </div>
                            )
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                No blocked accounts
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRIVACY & HELP TAB */}
                {activeTab === "privacy" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                        Privacy & Help
                      </h2>

                      {/* Privacy Settings */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8">
                        <h3 className="text-lg font-light text-black dark:text-white mb-8">
                          Privacy Settings
                        </h3>
                        <div className="space-y-6">
                          {[
                            {
                              key: "publicProfile",
                              label: "Public Profile",
                              icon: User,
                              desc: "Make your profile visible to everyone",
                            },
                            {
                              key: "allowMessages",
                              label: "Allow Messages",
                              icon: MessageSquare,
                              desc: "Let others send you direct messages",
                            },
                            {
                              key: "showActivity",
                              label: "Show Activity",
                              icon: Bell,
                              desc: "Display your activity status to others",
                            },
                          ].map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <div
                                key={item.key}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-start gap-4">
                                  <ItemIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-black dark:text-white">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setPrivacy((prev) => ({
                                      ...prev,
                                      [item.key]: !prev[item.key],
                                    }))
                                  }
                                  className={`relative w-12 h-6 rounded-full transition-all duration-300 border border-zinc-600 dark:border-zinc-600 shrink-0 ${
                                    privacy[item.key]
                                      ? "bg-zinc-700 dark:bg-zinc-700"
                                      : "bg-zinc-200 dark:bg-zinc-800"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 w-5 h-5 border border-zinc-200 dark:border-zinc-800 rounded-full transition-transform duration-300 bg-white dark:bg-black ${
                                      privacy[item.key]
                                        ? "translate-x-6"
                                        : "translate-x-0.5"
                                    }`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Help & Documentation */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                        <h3 className="text-lg font-light text-black dark:text-white mb-6 flex items-center gap-2">
                          <HelpCircle className="w-5 h-5" />
                          Documentation
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              title: "Privacy Policy",
                              url: "/privacy",
                              desc: "Review how we handle your data",
                            },
                            {
                              title: "Terms of Service",
                              url: "/terms",
                              desc: "Understand our terms and conditions",
                            },
                            {
                              title: "Developer Docs",
                              url: "/developer-docs",
                              desc: "API docs, webhooks, and integration guides",
                            },
                            {
                              title: "Support",
                              url: "/contact-support",
                              desc: "Get help from our support team",
                            },
                          ].map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              className="block p-4 rounded-lg transition-all border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            >
                              <p className="text-sm font-medium text-black dark:text-white">
                                {link.title}
                              </p>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                {link.desc}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(activeTab === "accounts" || activeTab === "ownership") && (
                  <AccountCenter
                    defaultTab={
                      activeTab === "ownership" ? "ownership" : "switch"
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Profile Picture Modal - Instagram Style */}
          {showProfilePictureModal && (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
                {/* Upload New Photo Option */}
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-200 dark:border-zinc-700"
                >
                  {profile.profilePicturePreview
                    ? "Update profile picture"
                    : "Upload profile picture"}
                </button>

                {/* Remove Photo Option - Only show if picture exists */}
                {profile.profilePicturePreview && (
                  <button
                    onClick={deleteProfilePicture}
                    className="w-full px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-200 dark:border-zinc-700"
                  >
                    Remove profile picture
                  </button>
                )}

                {/* Cancel Option */}
                <button
                  onClick={() => setShowProfilePictureModal(false)}
                  className="w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Deactivate Modal */}
          {showDeactivateModal && (
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 max-w-md w-full mx-4 bg-white dark:bg-black">
                <h2 className="text-xl font-light text-black dark:text-white mb-3">
                  Deactivate Account?
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  Your account will be temporarily disabled. You can reactivate
                  it anytime by logging in.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Enter your password
                    </label>
                    <input
                      type="password"
                      value={deactivateData.password}
                      onChange={(e) =>
                        setDeactivateData((prev) => ({
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
                      Type "DEACTIVATE" to confirm
                    </label>
                    <input
                      type="text"
                      value={deactivateData.inputConfirmation}
                      onChange={(e) =>
                        setDeactivateData((prev) => ({
                          ...prev,
                          inputConfirmation: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="DEACTIVATE"
                      className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeactivateModal(false);
                      setDeactivateData({
                        password: "",
                        inputConfirmation: "",
                      });
                    }}
                    className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deactivateAccount}
                    disabled={
                      isSaving ||
                      deactivateData.inputConfirmation !== "DEACTIVATE" ||
                      !deactivateData.password
                    }
                    className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                  >
                    {isSaving ? "Deactivating..." : "Deactivate"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 max-w-md w-full mx-4 bg-white dark:bg-black">
                <h2 className="text-xl font-light text-black dark:text-white mb-3">
                  Delete Account?
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  This action cannot be undone. All your data will be
                  permanently deleted.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                      Enter your password
                    </label>
                    <input
                      type="password"
                      value={deleteData.password}
                      onChange={(e) =>
                        setDeleteData((prev) => ({
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
                      Type "DELETE" to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteData.inputConfirmation}
                      onChange={(e) =>
                        setDeleteData((prev) => ({
                          ...prev,
                          inputConfirmation: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="DELETE"
                      className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteData({ password: "", inputConfirmation: "" });
                    }}
                    className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAccount}
                    disabled={
                      isSaving ||
                      deleteData.inputConfirmation !== "DELETE" ||
                      !deleteData.password
                    }
                    className="flex-1 px-4 py-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                  >
                    {isSaving ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Toast - Instagram Style */}
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

        {/* Error Toast - Instagram Style */}
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
      </LayoutWrapper>
    </>
  );
}

export default function Settings() {
  return (
    <SearchParamsWrapper>
      <SettingsContent />
    </SearchParamsWrapper>
  );
}

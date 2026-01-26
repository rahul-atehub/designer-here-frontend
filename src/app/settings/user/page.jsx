"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API } from "@/config";
import Head from "next/head";
import {
  User,
  Lock,
  Bell,
  Ban,
  Shield,
  Settings,
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

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedSections, setExpandedSections] = useState({ profile: true });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const fileInputRef = useRef(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    profilePicture: null,
    profilePicturePreview: null,
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
          contentId: "password",
        },
      ],
    },
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
    {
      id: "blocked",
      label: "Blocked Accounts",
      icon: Ban,
      subsections: [
        { id: "blocked-list", label: "Blocked List", contentId: "blocked" },
      ],
    },
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
      label: "Account Control",
      icon: Settings,
      subsections: [
        { id: "deactivate", label: "Deactivate", contentId: "account" },
        { id: "delete-account", label: "Delete Account", contentId: "account" },
      ],
    },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API.USER.PROFILE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      setProfile({
        name: response.data.name || "",
        bio: response.data.bio || "",
        email: response.data.email || "",
        profilePicture: response.data.profilePicture || null,
        profilePicturePreview: response.data.profilePicture || null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
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
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("bio", profile.bio);
      formData.append("email", profile.email);

      if (profile.profilePicture instanceof File) {
        formData.append("profilePicture", profile.profilePicture);
      }

      await axios.put(API.USER.PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      alert("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteData.inputConfirmation !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    try {
      setIsSaving(true);
      await axios.delete(API.USER.DELETE_ACCOUNT, {
        data: { password: deleteData.password },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      localStorage.removeItem("auth_token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    } finally {
      setIsSaving(false);
    }
  };

  const deactivateAccount = async () => {
    if (deactivateData.inputConfirmation !== "DEACTIVATE") {
      alert('Please type "DEACTIVATE" to confirm');
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(
        API.USER.DEACTIVATE_ACCOUNT,
        { password: deactivateData.password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      localStorage.removeItem("auth_token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deactivating account:", error);
      alert("Failed to deactivate account");
    } finally {
      setIsSaving(false);
    }
  };

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
                  const isActive = activeTab === section.id;

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
                            setActiveTab(section.id);
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
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-5xl font-light tracking-tight text-black dark:text-white mb-2">
                  Settings
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Manage your account, security, and preferences
                </p>
              </div>

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
                              {profile.profilePicturePreview ? (
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
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-black dark:text-white"
                            >
                              <Upload className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex-1 pt-2">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                              Profile Picture
                            </p>
                            <p className="text-sm text-black dark:text-white font-medium mb-4">
                              JPG or PNG up to 5MB
                            </p>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                            >
                              Choose Photo
                            </button>
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
                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) =>
                              handleProfileChange("name", e.target.value)
                            }
                            placeholder="Enter your full name"
                            className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              handleProfileChange("email", e.target.value)
                            }
                            placeholder="Enter your email"
                            className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mb-8">
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
                {activeTab === "password" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                        Password & Security
                      </h2>

                      {/* Change Password Card */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8">
                        <h3 className="text-lg font-light text-black dark:text-white mb-6">
                          Change Password
                        </h3>
                        <div className="space-y-5">
                          <div>
                            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.oldPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  oldPassword: e.target.value,
                                }))
                              }
                              placeholder="••••••••"
                              className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              placeholder="••••••••"
                              className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              placeholder="••••••••"
                              className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                            />
                          </div>
                        </div>
                        <button
                          onClick={changePassword}
                          disabled={isSaving}
                          className="w-full mt-7 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all"
                        >
                          {isSaving ? "Changing..." : "Change Password"}
                        </button>
                      </div>

                      {/* Forgot Password Link */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                        <h3 className="text-lg font-light text-black dark:text-white mb-3">
                          Forgot Password?
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                          If you can't remember your password, reset it using
                          your email address.
                        </p>
                        <button className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
                          Request Password Reset
                        </button>
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
                          Manage accounts you have blocked
                        </p>

                        <div className="space-y-3">
                          <div className="text-center py-8">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                              No blocked accounts
                            </p>
                          </div>
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

                {/* ACCOUNT CONTROL TAB */}
                {activeTab === "account" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-light text-black dark:text-white mb-8">
                        Account Control
                      </h2>

                      {/* Deactivate Account */}
                      <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8">
                        <div className="flex items-start gap-3">
                          <LogOut className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mt-1 shrink-0" />
                          <div className="flex-1">
                            <h3 className="text-lg font-light text-black dark:text-white mb-2">
                              Deactivate Account
                            </h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                              Temporarily disable your account. You can
                              reactivate it anytime by logging in.
                            </p>
                            <button
                              onClick={() => setShowDeactivateModal(true)}
                              className="px-5 py-3 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                            >
                              Deactivate Account
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Delete Account */}
                      <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
                        <div className="flex items-start gap-3">
                          <Trash2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mt-1 shrink-0" />
                          <div className="flex-1">
                            <h3 className="text-lg font-light text-black dark:text-white mb-2">
                              Delete Account
                            </h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                              Permanently delete your account and all associated
                              data. This action cannot be undone.
                            </p>
                            <button
                              onClick={() => setShowDeleteModal(true)}
                              className="px-5 py-3 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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
      </LayoutWrapper>
    </>
  );
}

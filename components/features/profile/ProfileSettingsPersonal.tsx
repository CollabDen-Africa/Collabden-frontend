"use client";

import React, { useState, useMemo, useRef } from "react";
import { FiSun, FiMoon, FiMonitor, FiLoader } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import VerificationPanel from "@/components/features/profile/VerificationPanel";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/profile/useProfile";
import profileService from "@/services/profile.service";

export default function ProfileSettingsContent() {
  const { user } = useAuth();
  const { useUserProfile, useUpdateProfile, useUpdateAvatar } = useProfile();
  
  const { data: profile, isLoading } = useUserProfile(user?.id || "");
  const updateProfileMutation = useUpdateProfile(user?.id || "");
  const updateAvatarMutation = useUpdateAvatar(user?.id || "");

  const [activeTheme, setActiveTheme] = useState("dark");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const showToast = (message: string, tone: "success" | "error") => {
    setToast({ message, tone });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Map the backend profile data into the form structure
  const formFields = useMemo(() => {
    if (!profile) return [];
    return [
      { id: "email", label: "Email Address", value: profile.email, readonly: true },
      { id: "phoneNumber", label: "Phone Number", value: profile.phoneNumber || "Not set", readonly: false },
      { id: "legalName", label: "Legal Name", value: profile.legalName || "Not set", readonly: false },
      { id: "displayName", label: "Stage / Display Name", value: profile.displayName || "Not set", readonly: false },
      { id: "role", label: "Role", value: profile.role || "Not set", readonly: false },
      { id: "bio", label: "Bio", value: profile.bio || "Not set", readonly: false },
    ];
  }, [profile]);

  const handleEditClick = (fieldId: string, currentValue: string) => {
    setEditingField(fieldId);
    setEditValue(currentValue === "Not set" ? "" : currentValue);
  };

  const handleSaveClick = async (fieldId: string) => {
    if (!profile) return;
    try {
      if (fieldId === "phoneNumber") {
        await profileService.updatePhone(editValue || null);
      } else {
        await updateProfileMutation.mutateAsync({
          [fieldId]: editValue,
        });
      }
      showToast("Profile information updated successfully.", "success");
      setEditingField(null);
    } catch (err: any) {
      console.error("Failed to update profile field:", err);
      showToast(err?.response?.data?.error || err?.message || "Failed to update profile field.", "error");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatarMutation.mutate(file, {
        onSuccess: () => {
          showToast("Profile picture updated successfully.", "success");
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.error || err?.message || "Failed to update profile picture.", "error");
        },
        onSettled: () => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    }
  };

  const handleRemoveAvatar = () => {
    updateAvatarMutation.mutate("", {
      onSuccess: () => {
        showToast("Profile picture removed successfully.", "success");
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.error || err?.message || "Failed to remove profile picture.", "error");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-white">
        <FiLoader className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  const isVerified = Boolean(profile?.isVerified || user?.identityVerified);

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 relative">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white">
          Personal Information
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-white/50">
          Manage your profile and how others see you
        </p>
      </div>

      {/* Profile Picture Card */}
      <div className="w-full bg-white/5 border-[1.6px] border-white/10 rounded-[35px] p-8.75 flex flex-row items-center gap-7.25 backdrop-blur-md">
        <Avatar
          name={profile?.displayName || profile?.email || "User"}
          src={profile?.avatarUrl}
          className="w-[126.7px] h-[126.7px] border-4 border-accent-green-success/35 text-[40px]"
        />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="font-raleway font-medium text-[20.5px] text-white">Profile Picture</span>
            <span className="font-raleway font-normal text-[17.6px] text-white/50">JPG, PNG or GIF · Max 5MB</span>
          </div>
          <div className="flex flex-row items-center gap-3 mt-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={updateAvatarMutation.isPending}
              className="bg-primary-green hover:bg-primary-green/90 text-white font-raleway font-semibold text-[17.6px] px-4.5 py-2.25 rounded-[17.6px] transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updateAvatarMutation.isPending ? (
                <>
                  <FiLoader className="animate-spin" size={20} />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload New</span>
              )}
            </button>
            {profile?.avatarUrl && (
              <button
                onClick={handleRemoveAvatar}
                disabled={updateAvatarMutation.isPending}
                className="border-[1.6px] border-white/10 hover:border-white/30 text-white/60 hover:text-white font-raleway font-medium text-[17.6px] px-4.5 py-2.25 rounded-[17.6px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NEW VERIFICATION COMPONENT PLACEMENT */}
        <VerificationPanel isVerified={isVerified} profile={profile} />

      {/* Form Fields Card */}
      <div className="w-full bg-white/5 border-[1.6px] border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden">
        {formFields.map((field, index) => {
          const isEditing = editingField === field.id;
          return (
            <div
              key={field.id}
              className={`flex flex-row justify-between items-start w-full px-8.75 py-5.75 ${
                index !== formFields.length - 1 ? "border-b-[1.6px] border-white/5" : ""
              }`}
            >
              <div className="flex flex-col gap-1.25 max-w-[80%] flex-1">
                <span className="font-raleway font-normal text-[17.6px] text-white/50">
                  {field.label}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-black/20 text-white border border-white/10 rounded-[10px] px-3 py-1 font-raleway text-[20.5px] outline-none focus:border-primary-green w-full mt-1"
                  />
                ) : (
                  <span className="font-raleway font-normal text-[20.5px] text-white leading-7.25 wrap-break-word">
                    {field.value}
                  </span>
                )}
              </div>
              {!field.readonly && (
                <div className="flex gap-2 shrink-0 ml-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveClick(field.id)}
                        className="bg-primary-green text-white hover:brightness-110 rounded-[17.6px] px-4 py-2 transition-all shrink-0 mt-1"
                      >
                        <span className="font-raleway font-medium text-[16px]">Save</span>
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="border border-white/10 text-white/70 hover:bg-white/5 rounded-[17.6px] px-4 py-2 transition-all shrink-0 mt-1"
                      >
                        <span className="font-raleway font-medium text-[16px]">Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(field.id, field.value)}
                      className="border-[1.6px] border-white/10 hover:border-white/30 hover:bg-white/5 rounded-[17.6px] px-4.5 py-2.25 transition-all shrink-0 mt-1"
                    >
                      <span className="font-raleway font-medium text-[17.6px] text-accent-soft-blue/70">Edit</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Theme Preference Card */}
      <div className="w-full bg-white/5 border-[1.6px] border-white/10 rounded-[35px] p-8.75 flex flex-col gap-5.75 backdrop-blur-md">
        <span className="font-inter font-medium text-[20.5px] text-accent-soft-blue">Theme Preference</span>

        <div className="flex flex-row flex-wrap gap-4.25">
          <button
            onClick={() => setActiveTheme("light")}
            className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
              activeTheme === "light"
                ? "bg-primary-green border-primary-green text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            <FiSun size={20} className={activeTheme === "light" ? "text-white" : "text-white/50"} />
            <span className="font-inter font-medium text-[20.5px]">Light</span>
          </button>

          <button
            onClick={() => setActiveTheme("dark")}
            className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
              activeTheme === "dark"
                ? "bg-primary-green border-primary-green text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            <FiMoon size={20} className={activeTheme === "dark" ? "text-white" : "text-white/50"} />
            <span className="font-inter font-medium text-[20.5px]">Dark</span>
          </button>

          <button
            onClick={() => setActiveTheme("system")}
            className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
              activeTheme === "system"
                ? "bg-primary-green border-primary-green text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            <FiMonitor size={20} className={activeTheme === "system" ? "text-white" : "text-white/50"} />
            <span className="font-inter font-medium text-[20.5px]">System</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-999 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 border ${
            toast.tone === "success"
              ? "bg-primary-green/20 border-primary-green/50 text-primary-green"
              : "bg-red-500/20 border-red-500/50 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { FiDownload, FiUserX, FiTrash2, FiLoader } from "react-icons/fi";
import Toggle from "@/components/ui/Toggle";
import { useCollaborator } from "@/hooks/collaborator/useCollaborator";
import { useProfile } from "@/hooks/profile/useProfile";
import { useSecurity } from "@/hooks/security/useSecurity";
import { useAuth } from "@/context/AuthContext";

const MESSAGE_OPTIONS = [
  "Everyone",
  "Connections Only",
  "Project Collaborators Only",
  "Nobody"
];

export default function ProfileSettingsPrivacy() {
  const { user } = useAuth();
  const { useCurrentProfile, useUpdateProfile } = useProfile();
  const { useUpdateAvailability } = useCollaborator();
  const { useDeactivateAccount, useDeleteAccount, useDataExport } = useSecurity();

  const { data: profile, isLoading } = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile(user?.id || "");
  const updateAvailability = useUpdateAvailability();
  
  const deactivateMutation = useDeactivateAccount();
  const deleteAccountMutation = useDeleteAccount();
  const dataExportMutation = useDataExport();

  // State
  const [openToCollaborate, setOpenToCollaborate] = useState(false);
  const [displayNameMode, setDisplayNameMode] = useState<"legal" | "stage">("legal");
  const [showLocation, setShowLocation] = useState(true);
  const [whoCanMessage, setWhoCanMessage] = useState("Everyone");

  // Modals & Toasts
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const showToast = (message: string, tone: "success" | "error") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (profile) {
      if (typeof profile.openToCollaborate === "boolean") {
        setOpenToCollaborate(profile.openToCollaborate);
      }
      if (typeof profile.showLocation === "boolean") {
        setShowLocation(profile.showLocation);
      }
      if (profile.displayNameMode) {
        setDisplayNameMode(profile.displayNameMode);
      }
      if (profile.whoCanMessage) {
        setWhoCanMessage(profile.whoCanMessage);
      }
    }
  }, [profile]);

  const handleAvailabilityChange = () => {
    const nextValue = !openToCollaborate;
    setOpenToCollaborate(nextValue);
    updateAvailability.mutate(nextValue, {
      onSuccess: () => showToast("Collaboration availability updated.", "success"),
      onError: () => {
        setOpenToCollaborate(!nextValue);
        showToast("Failed to update availability.", "error");
      },
    });
  };

  const handleDisplayNameModeChange = async (mode: "legal" | "stage") => {
    setDisplayNameMode(mode);
    try {
      await updateProfileMutation.mutateAsync({ displayNameMode: mode });
      showToast(`Display name mode set to ${mode === "legal" ? "Legal Name" : "Stage Name"}.`, "success");
    } catch (err: any) {
      showToast("Failed to update display name mode.", "error");
    }
  };

  const handleShowLocationToggle = async () => {
    const nextValue = !showLocation;
    setShowLocation(nextValue);
    try {
      await updateProfileMutation.mutateAsync({ showLocation: nextValue });
      showToast(`Location display ${nextValue ? "enabled" : "hidden"}.`, "success");
    } catch (err: any) {
      setShowLocation(!nextValue);
      showToast("Failed to update location privacy.", "error");
    }
  };

  const handleMessageOptionChange = async (option: string) => {
    setWhoCanMessage(option);
    try {
      await updateProfileMutation.mutateAsync({ whoCanMessage: option });
      showToast(`Messaging privacy updated to "${option}".`, "success");
    } catch (err: any) {
      showToast("Failed to update messaging privacy.", "error");
    }
  };

  const handleDataExport = () => {
    dataExportMutation.mutate(undefined, {
      onSuccess: () => showToast("Your data export has been requested. Check your email for the download link.", "success"),
      onError: (err: any) => showToast(err?.response?.data?.error || "Failed to request data export.", "error"),
    });
  };

  const handleDeactivate = () => {
    deactivateMutation.mutate(undefined, {
      onSuccess: () => {
        showToast("Account deactivated successfully.", "success");
        window.location.href = "/login";
      },
      onError: (err: any) => showToast(err?.response?.data?.error || "Failed to deactivate account.", "error"),
    });
  };

  const handleDelete = () => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        showToast("Account scheduled for deletion.", "success");
        window.location.href = "/login";
      },
      onError: (err: any) => showToast(err?.response?.data?.error || "Failed to delete account.", "error"),
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-white">
        <FiLoader className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-3">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white/90">
          Privacy & Controls
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-8.5 text-text-muted">
          Manage how you interact with the platform and your data
        </p>
      </div>

      {/* Card 1: Display Settings */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden p-8.75 gap-7">
        <span className="font-raleway font-medium text-[20.5px] text-white">
          Display Settings
        </span>
        
        {/* Open to Collaborate */}
        <div className="flex flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-raleway font-medium text-[17.6px] text-white">
              Open to Collaborate
            </span>
            <span className="font-raleway font-normal text-[14.7px] text-text-muted max-w-105">
              Control whether your profile appears in the CollabDen search and recommendations.
            </span>
          </div>
          <Toggle 
            active={openToCollaborate} 
            onChange={handleAvailabilityChange}
          />
        </div>

        <div className="w-full h-[1.6px] bg-white/5" />

        {/* Collaboration Display Name */}
        <div className="flex flex-col gap-4.5">
          <div className="flex flex-col gap-1">
            <span className="font-raleway font-medium text-[17.6px] text-white">
              Collaboration Display Name
            </span>
            <span className="font-raleway font-normal text-[14.7px] text-text-muted max-w-105">
              Choose the name that will appear across collaborative workspaces and public spaces.
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleDisplayNameModeChange("legal")}
              className="flex items-center gap-3 w-fit group"
            >
              <div className={`w-4.5 h-4.5 rounded-full border-[1.6px] flex items-center justify-center transition-colors ${displayNameMode === "legal" ? "border-primary-green" : "border-text-muted group-hover:border-white/50"}`}>
                {displayNameMode === "legal" && <div className="w-2.5 h-2.5 bg-primary-green rounded-full" />}
              </div>
              <span className={`font-raleway font-medium text-[17.6px] ${displayNameMode === "legal" ? "text-white" : "text-text-muted"}`}>
                Verified Legal Name
              </span>
            </button>
            
            <button 
              onClick={() => handleDisplayNameModeChange("stage")}
              className="flex items-center gap-3 w-fit group"
            >
              <div className={`w-4.5 h-4.5 rounded-full border-[1.6px] flex items-center justify-center transition-colors ${displayNameMode === "stage" ? "border-primary-green" : "border-text-muted group-hover:border-white/50"}`}>
                {displayNameMode === "stage" && <div className="w-2.5 h-2.5 bg-primary-green rounded-full" />}
              </div>
              <span className={`font-raleway font-medium text-[17.6px] ${displayNameMode === "stage" ? "text-white" : "text-text-muted"}`}>
                Stage Name / Alias
              </span>
            </button>
          </div>
        </div>

        <div className="w-full h-[1.6px] bg-white/5" />

        {/* Display Location */}
        <div className="flex flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-raleway font-medium text-[17.6px] text-white">
              Display Location
            </span>
            <span className="font-raleway font-normal text-[14.7px] text-text-muted max-w-105">
              Show or hide your location from other users on your profile page.
            </span>
          </div>
          <Toggle 
            active={showLocation} 
            onChange={handleShowLocationToggle} 
          />
        </div>
      </div>

      {/* Card 2: Who Can Message Me? */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md p-8.75 gap-6">
        <span className="font-raleway font-medium text-[20.5px] text-white/90">
          Who Can Message Me?
        </span>
        <div className="flex flex-row flex-wrap items-center gap-3">
          {MESSAGE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => handleMessageOptionChange(option)}
              disabled={updateProfileMutation.isPending}
              className={`flex items-center justify-center px-4.5 py-3 rounded-[23.4px] border-[1.6px] font-raleway font-medium text-[17.6px] transition-all duration-200 disabled:opacity-60 ${
                whoCanMessage === option
                  ? "bg-primary-green border-primary-green text-white"
                  : "bg-transparent border-white/10 text-text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Card 3: Data Export */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md p-8.75 gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-raleway font-medium text-[20.5px] text-white">
            Data Export
          </span>
          <span className="font-raleway font-normal text-[14.7px] text-text-muted">
            Download a copy of all your CollabDen data
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDataExport}
          disabled={dataExportMutation.isPending}
          className="w-fit rounded-[10px] px-6 py-3 h-auto border-[1.6px] border-white/20 text-white/70 hover:text-white hover:bg-white/5 gap-3 disabled:opacity-60"
        >
          {dataExportMutation.isPending ? (
            <>
              <FiLoader size={18} className="animate-spin text-primary-green" />
              <span className="font-raleway font-medium text-[17.6px]">Requesting Export...</span>
            </>
          ) : (
            <>
              <FiDownload size={18} />
              <span className="font-raleway font-medium text-[17.6px]">Download My Data</span>
            </>
          )}
        </Button>
      </div>

      {/* Card 4: Danger Zone (Deactivate & Delete) */}
      <div className="w-full bg-white/10 border-[1.6px] border-border-muted/20 rounded-[35px] p-6 flex flex-col gap-4.5 backdrop-blur-md">
        
        {/* Deactivate Account */}
        <div className="w-full bg-white/5 border-[1.6px] border-border-muted/20 rounded-[23.4px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-6">
            <div className="w-11.75 h-11.75 bg-white/10 rounded-[17.6px] flex items-center justify-center shrink-0">
              <FiUserX size={22} className="text-white" />
            </div>
            <div className="flex flex-col gap-0.75">
              <span className="font-inter font-medium text-[20.5px] text-white/90">
                Deactivate Account
              </span>
              <span className="font-inter font-normal text-[17.6px] text-text-muted">
                Temporarily hide your profile and pause all activities
              </span>
            </div>
          </div>
          <Button 
            variant="red"
            onClick={() => setShowDeactivateConfirm(true)}
            className="shrink-0 border-[1.6px] border-accent-red/30 py-2.25! font-inter font-medium text-[17.6px]"
          >
            Deactivate
          </Button>
        </div>

        {/* Delete Account */}
        <div className="w-full bg-white/5 border-[1.6px] border-border-muted/20 rounded-[23.4px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-6">
            <div className="w-11.75 h-11.75 bg-white/10 rounded-[17.6px] flex items-center justify-center shrink-0">
              <FiTrash2 size={22} className="text-white" />
            </div>
            <div className="flex flex-col gap-0.75">
              <span className="font-inter font-medium text-[20.5px] text-white/90">
                Delete Account
              </span>
              <span className="font-inter font-normal text-[17.6px] text-text-muted">
                Permanently delete your account and all associated data
              </span>
            </div>
          </div>
          <Button 
            variant="red"
            onClick={() => setShowDeleteConfirm(true)}
            className="shrink-0 border-[1.6px] border-accent-red/30 py-2.25! font-inter font-medium text-[17.6px]"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Deactivate */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#18202e] border border-white/10 rounded-3xl p-6 max-w-md w-full flex flex-col gap-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-white">Deactivate Account?</h3>
            <p className="text-white/60 text-sm">
              Your profile will be hidden and your account paused until you sign back in. Are you sure?
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                disabled={deactivateMutation.isPending}
                className="px-4 py-2 rounded-full text-white/60 hover:bg-white/10 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={deactivateMutation.isPending}
                className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm disabled:opacity-60 flex items-center gap-2"
              >
                {deactivateMutation.isPending ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    <span>Deactivating...</span>
                  </>
                ) : (
                  <span>Yes, Deactivate</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#18202e] border border-red-500/30 rounded-3xl p-6 max-w-md w-full flex flex-col gap-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-red-400">Permanently Delete Account?</h3>
            <p className="text-white/60 text-sm">
              This action cannot be undone. All your project history, messages, and uploaded files will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAccountMutation.isPending}
                className="px-4 py-2 rounded-full text-white/60 hover:bg-white/10 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteAccountMutation.isPending}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm disabled:opacity-60 flex items-center gap-2"
              >
                {deleteAccountMutation.isPending ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Permanently Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

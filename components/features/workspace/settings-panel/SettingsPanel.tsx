"use client";

import React, { useState } from "react";
import {
  FiX,
  FiInfo,
  FiUsers,
  FiBell,
  FiShield,
  FiKey,
  FiChevronRight,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import Modal from "@/components/ui/Modal";
import GeneralSettingsTab from "./GeneralSettingsTab";
import MembersSettingsTab from "./MemberSettingsTab";
import NotificationsSettingsTab from "./NotificationsSettingsTab";
import PrivacySettingsTab from "./PrivacySettingsTab";
import OwnershipSettingsTab from "./OwnershipSettingsTab";

const SETTINGS_OPTIONS = [
  {
    id: "gen",
    title: "General",
    sub: "Project Information",
    icon: <FiInfo size={16} />,
  },
  {
    id: "mem",
    title: "Members & Roles",
    sub: "Collaborators",
    icon: <FiUsers size={16} />,
  },
  {
    id: "not",
    title: "Notifications",
    sub: "Your preferences",
    icon: <FiBell size={16} />,
  },
  {
    id: "pri",
    title: "Privacy & Visibility",
    sub: "Access control",
    icon: <FiShield size={16} />,
  },
  {
    id: "own",
    title: "Ownership",
    sub: "Transfer project",
    icon: <FiKey size={16} />,
  },
];

import { Project } from "@/types/api.types";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  project,
}: SettingsPanelProps) {
  // State to track which settings tab is currently open
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    tone: "success" | "error" = "success"
  ) => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTabSuccess = (
    message: string = "Project updated successfully."
  ) => {
    setActiveTab(null);
    showToast(message, "success");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop for Settings Drawer */}
      <div
        className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="flex h-full items-start justify-end shrink-0">
        {/* Settings Navigation Sidebar */}
        <aside
          className="fixed inset-y-0 right-0 z-[100] w-[85vw] sm:w-[322px] bg-[#121A1F]/95 border-l border-white/10 p-[26px_17px] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex flex-col shrink-0
                          lg:sticky lg:top-6 lg:inset-auto lg:z-auto lg:w-[322px] lg:h-auto lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:bg-black/20 lg:border lg:border-white/5 lg:rounded-[30px] lg:shadow-none custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-sans font-bold text-[18px] text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Close settings"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {SETTINGS_OPTIONS.map((opt) => {
              const isActive = activeTab === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveTab(opt.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group text-left ${
                    isActive
                      ? "bg-white/10 border border-white/10 shadow-sm"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-[30px] h-[30px] rounded-[10px] flex items-center justify-center border transition-colors ${
                        isActive
                          ? "bg-primary-green text-white border-primary-green/50"
                          : "bg-white/15 text-white border-white/10"
                      }`}
                    >
                      {opt.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-semibold text-[13px] text-white">
                        {opt.title}
                      </span>
                      <span className="font-sans font-medium text-[10px] text-white/60">
                        {opt.sub}
                      </span>
                    </div>
                  </div>
                  <FiChevronRight
                    size={14}
                    className={`transition-transform duration-300 ${
                      isActive
                        ? "text-primary-green translate-x-1"
                        : "text-white/30 group-hover:text-white"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Reusable Modal for Active Tab */}
        <Modal
          isOpen={Boolean(activeTab)}
          onClose={() => setActiveTab(null)}
          maxWidth="max-w-[880px]"
        >
          {activeTab === "gen" && (
            <GeneralSettingsTab
              project={project}
              onSuccess={() =>
                handleTabSuccess("Project details updated successfully.")
              }
            />
          )}
          {activeTab === "mem" && (
            <MembersSettingsTab
              project={project}
              onSuccess={(msg) =>
                handleTabSuccess(msg || "Members updated successfully.")
              }
              onError={(errMsg) => showToast(errMsg, "error")}
            />
          )}
          {activeTab === "not" && (
            <NotificationsSettingsTab
              onSuccess={(msg) =>
                handleTabSuccess(msg || "Notification preferences updated.")
              }
            />
          )}
          {activeTab === "pri" && (
            <PrivacySettingsTab
              project={project}
              onSuccess={(msg) =>
                handleTabSuccess(msg || "Privacy settings updated.")
              }
            />
          )}
          {activeTab === "own" && (
            <OwnershipSettingsTab
              project={project}
              onSuccess={(msg) =>
                handleTabSuccess(msg || "Project deleted successfully.")
              }
              onError={(errMsg) => showToast(errMsg, "error")}
            />
          )}
        </Modal>

        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 border ${
              toast.tone === "success"
                ? "bg-primary-green/20 border-primary-green/50 text-white"
                : "bg-red-500/20 border-red-500/50 text-white"
            }`}
          >
            {toast.tone === "success" ? (
              <div className="w-5 h-5 rounded-full bg-primary-green flex items-center justify-center text-black shrink-0">
                <FiCheck size={12} className="stroke-[3]" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                <FiAlertCircle size={14} />
              </div>
            )}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </>
  );
}
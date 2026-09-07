import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { LuMegaphone } from "react-icons/lu";
import { FiEye, FiEdit2, FiTrash2, FiCheck, FiX, FiPlus } from "react-icons/fi";

interface SystemAnnouncementProps {
  onPublish?: (data: {
    title: string;
    body: string;
    type?: "info" | "warning" | "critical";
  }) => Promise<boolean>;
  isSaving?: boolean;
}

export function SystemAnnouncement({
  onPublish,
  isSaving = false,
}: SystemAnnouncementProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("System Notice");
  const [announcementText, setAnnouncementText] = useState(
    "Scheduled platform maintenance window. The marketplace and contract services will be temporarily updated."
  );
  const [draftTitle, setDraftTitle] = useState(announcementTitle);
  const [draftText, setDraftText] = useState(announcementText);
  const [announcementType, setAnnouncementType] = useState<"info" | "warning" | "critical">("info");

  const handleSave = async () => {
    setAnnouncementTitle(draftTitle);
    setAnnouncementText(draftText);
    setIsEditing(false);
    if (onPublish) {
      await onPublish({
        title: draftTitle,
        body: draftText,
        type: announcementType,
      });
    }
  };

  const handleCancel = () => {
    setDraftTitle(announcementTitle);
    setDraftText(announcementText);
    setIsEditing(false);
  };

  if (!isVisible) {
    return (
      <div className="flex flex-col items-center justify-center p-8 w-full bg-white/2 border border-white/10 border-dashed rounded-2xl">
        <span className="text-xs text-white/50 mb-4">
          No active system announcements.
        </span>
        <Button
          variant="ghost"
          size="sm"
          icon={FiPlus}
          iconPosition="left"
          onClick={() => setIsVisible(true)}
        >
          Create Announcement
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-6 w-full bg-white/5 border border-white/10 rounded-2xl transition-all">
      <div className="flex flex-row items-center gap-3 w-full mb-4">
        <div className="flex justify-center items-center w-9 h-9 bg-primary-green/10 border border-primary-green/20 rounded-xl shrink-0">
          <LuMegaphone className="w-4 h-4 text-primary-green" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-bold text-sm text-white">System Announcement</h2>
          {!isEditing && (
            <span
              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                isPreview
                  ? "bg-secondary-blue/10 text-secondary-blue"
                  : "bg-primary-green/10 text-primary-green"
              }`}
            >
              {isPreview ? "PREVIEW MODE" : "ACTIVE"}
            </span>
          )}
        </div>
      </div>

      <div
        className={`flex flex-col p-4 w-full rounded-xl transition-all ${
          isEditing
            ? "bg-black/40 border border-primary-green/50"
            : "bg-white/3 border border-white/10"
        }`}
      >
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-white outline-none border-b border-white/10 pb-1"
              placeholder="Announcement Title..."
            />
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              className="w-full bg-transparent text-xs text-white resize-none outline-none min-h-16"
              placeholder="Enter announcement body text here..."
              autoFocus
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-white/50 font-semibold uppercase">Type:</span>
              <select
                value={announcementType}
                onChange={(e) => setAnnouncementType(e.target.value as any)}
                className="bg-card-bg-alt text-xs text-white px-2 py-1 rounded border border-white/10 outline-none"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-xs text-white">{announcementTitle}</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              {announcementText}
            </p>
          </div>
        )}

        {!isEditing && (
          <span className="text-[10px] text-white/40 mt-2">
            Displayed globally to all connected active users
          </span>
        )}
      </div>

      <div className="flex flex-row items-center gap-2 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-green rounded-lg transition-colors hover:bg-primary-green/80 text-black font-bold text-xs"
            >
              <FiCheck className="w-3.5 h-3.5" />
              <span>{isSaving ? "Publishing..." : "Publish Announcement"}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg transition-colors hover:bg-white/10 text-white/80 text-xs font-medium"
            >
              <FiX className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 border rounded-lg transition-colors text-xs font-semibold ${
                isPreview
                  ? "bg-secondary-blue/10 border-secondary-blue/30 text-secondary-blue"
                  : "bg-primary-green/10 border-primary-green/30 text-primary-green"
              }`}
            >
              <FiEye className="w-3.5 h-3.5" />
              <span>{isPreview ? "Exit Preview" : "Preview"}</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg transition-colors hover:bg-white/10 text-white/60 text-xs font-medium"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent-red/10 border border-accent-red/20 rounded-lg transition-colors hover:bg-accent-red/20 text-accent-red text-xs font-medium"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
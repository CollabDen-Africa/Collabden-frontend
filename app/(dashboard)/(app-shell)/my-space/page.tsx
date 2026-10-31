"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import {
  FiSearch,
  FiFileText,
  FiDownload,
  FiEye,
  FiTrash2,
  FiFolder,
  FiMessageSquare,
} from "react-icons/fi";
import {
  useUserSpace,
  useRemoveSavedFile,
} from "@/hooks/user/useUserSpace";
import type {
  UserSpaceItem,
  UserSpaceItemType,
} from "@/services/userSpace.service";

const TAB_TO_TYPE: Record<string, UserSpaceItemType | undefined> = {
  "All Files": undefined,
  Agreements: "agreement",
  "Saved Files": "saved-file",
  "Message Attachments": "dm-attachment",
};

const formatFileSize = (bytes?: number | null) => {
  if (bytes === null || bytes === undefined || bytes < 0) return "—";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 10 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TypeIcon: React.FC<{ type: UserSpaceItemType }> = ({ type }) => {
  if (type === "agreement") return <FiFileText className="text-primary-green" size={22} />;
  if (type === "dm-attachment") return <FiMessageSquare className="text-primary-green" size={22} />;
  return <FiFolder className="text-primary-green" size={22} />;
};

const typeLabel = (type: UserSpaceItemType) =>
  type === "agreement" ? "Agreement" : type === "saved-file" ? "Saved File" : "Message";

export default function MySpacePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All Files");
  const [search, setSearch] = useState("");

  const typeFilter = TAB_TO_TYPE[activeTab];
  const { data, isLoading } = useUserSpace({
    type: typeFilter,
    search: search || undefined,
    limit: 50,
  });

  const removeSaved = useRemoveSavedFile();

  const items = data?.items || [];

  const handleOpen = (item: UserSpaceItem) => {
    if (item.url) window.open(item.url, "_blank");
  };

  const handleDownload = async (item: UserSpaceItem) => {
    if (!item.url) return;
    try {
      const res = await fetch(item.url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      window.open(item.url, "_blank");
    }
  };

  const handleGoToProject = (item: UserSpaceItem) => {
    if (!item.project) return;
    if (item.type === "agreement") {
      router.push(`/projects/${item.project.id}/agreements`);
    } else {
      router.push(`/projects/${item.project.id}`);
    }
  };

  const handleRemove = (item: UserSpaceItem) => {
    if (item.type !== "saved-file" || !item.meta.projectFileId) return;
    removeSaved.mutate(item.meta.projectFileId);
  };

  if (isLoading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green" />
      </div>
    );
  }

  const TAB_OPTIONS = Object.keys(TAB_TO_TYPE);

  return (
    <div className="relative w-full min-h-screen lg:p-3 overflow-hidden">
      <div className="flex flex-col gap-12.5 max-w-300 mx-auto">
        <div className="flex flex-col gap-2 px-3">
          <h1 className="font-raleway font-bold text-[32px] text-white">My Space</h1>
          <p className="font-raleway text-[14px] text-white/60">
            All your agreements, saved project files, and message attachments in one place.
          </p>
        </div>

        <div className="flex justify-start px-3">
          <Tabs tabs={TAB_OPTIONS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="relative w-full max-w-275.25">
          <FiSearch
            size={23}
            className="absolute left-8.5 top-1/2 -translate-y-1/2 text-white/30 z-10"
          />
          <Input
            type="text"
            variant="glass"
            placeholder="Search by file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-18.5 h-12.25 bg-black/10 rounded-full font-raleway font-normal text-[20px] leading-6 border-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="max-w-275">
              <EmptyState
                icon={<FiFileText size={32} />}
                title="Your space is empty"
                description="Agreements, files you save from projects, and message attachments will appear here."
              />
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 bg-black/10 border border-white/10 rounded-[20px] px-6 py-4 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-black/20 p-2.5 rounded-md shrink-0">
                    <TypeIcon type={item.type} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-raleway font-semibold text-[16px] text-white truncate">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-3 text-white/50 text-[12px] font-raleway flex-wrap">
                      <span className="px-2 py-0.5 bg-white/5 rounded-full text-[11px]">
                        {typeLabel(item.type)}
                      </span>
                      {item.project && (
                        <>
                          <span className="truncate">{item.project.name}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatDate(item.createdAt)}</span>
                      {item.size != null && (
                        <>
                          <span>•</span>
                          <span>{formatFileSize(item.size)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {item.type === "agreement" && item.meta.awaitingMySignature && (
                  <span className="px-3 py-1 rounded-full bg-accent-yellow/20 text-accent-yellow text-[12px] font-raleway font-semibold">
                    Awaiting your signature
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {item.url && (
                    <button
                      onClick={() => handleOpen(item)}
                      className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-primary-green transition-colors"
                      title="View"
                    >
                      <FiEye size={16} />
                    </button>
                  )}
                  {item.url && (
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-primary-green transition-colors"
                      title="Download"
                    >
                      <FiDownload size={16} />
                    </button>
                  )}
                  {item.project && (
                    <button
                      onClick={() => handleGoToProject(item)}
                      className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-primary-green transition-colors"
                      title="Open in project"
                    >
                      <FiFolder size={16} />
                    </button>
                  )}
                  {item.type === "saved-file" && (
                    <button
                      onClick={() => handleRemove(item)}
                      disabled={removeSaved.isPending}
                      className="flex items-center justify-center p-2 bg-white/10 hover:bg-red-500/20 rounded-full text-white/70 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Remove from My Space"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

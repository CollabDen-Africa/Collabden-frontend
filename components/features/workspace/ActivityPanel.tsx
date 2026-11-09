"use client";

import React from "react";
import { FiX, FiCheckCircle, FiFileText, FiMessageSquare, FiUser, FiActivity } from "react-icons/fi";
import { useWorkspace } from "@/context/WorkspaceContext";

interface ActivityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to format timestamps into relative time (e.g., "2h ago")
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Helper to dynamically style icons based on the action type
const getActionConfig = (action: string) => {
  const lowerAction = action.toLowerCase();
  
  if (lowerAction.includes("escrow") || lowerAction.includes("payment") || lowerAction.includes("fund")) {
    return { icon: FiCheckCircle, color: "text-primary-green", bg: "bg-primary-green/10" };
  }
  if (lowerAction.includes("agreement") || lowerAction.includes("file") || lowerAction.includes("upload") || lowerAction.includes("sign")) {
    return { icon: FiFileText, color: "text-secondary-blue", bg: "bg-primary-blue/10" };
  }
  if (lowerAction.includes("message") || lowerAction.includes("comment")) {
    return { icon: FiMessageSquare, color: "text-accent-pink", bg: "bg-accent-pink/10" };
  }
  if (lowerAction.includes("collaborator") || lowerAction.includes("invite") || lowerAction.includes("user")) {
    return { icon: FiUser, color: "text-accent-yellow", bg: "bg-accent-yellow/10" };
  }
  
  return { icon: FiActivity, color: "text-white/60", bg: "bg-white/5" };
};

export default function ActivityPanel({ isOpen, onClose }: ActivityPanelProps) {
  const { projectDetails, activeProject } = useWorkspace();
  
  // Fallback to activeProject if projectDetails hasn't loaded yet
  const activities = projectDetails?.activities || activeProject?.activities || [];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-90 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 right-0 z-100 w-[85vw] sm:w-80.5 bg-[#162026] border-l border-white/10 p-[26px_17px] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex flex-col shrink-0 lg:sticky lg:top-6 lg:inset-auto lg:z-auto lg:w-80.5 lg:h-auto lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:bg-white/10 lg:border-none lg:rounded-[30px] lg:shadow-none custom-scrollbar">
        
        <div className="flex lg:hidden justify-between items-center mb-6 px-2 shrink-0">
          <h2 className="font-sans font-medium text-[18px] text-white">Activity</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={20} className="text-white" />
          </button>
        </div>

        <h2 className="hidden lg:block font-sans font-medium text-[16px] leading-4.75 text-white text-center mt-1 mb-8 shrink-0">
          Activity
        </h2>
        
        <div className="flex-1 flex flex-col w-full overflow-y-auto custom-scrollbar pr-1 pb-6 lg:pb-2">
          {activities.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                <FiActivity size={20} className="text-white/20" />
              </div>
              <p className="text-white/40 text-[13px] font-sans">No recent activity recorded.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {activities.map((activity: any) => {
                const { icon: Icon, color, bg } = getActionConfig(activity.action);
                
                return (
                  <div key={activity.id} className="flex gap-3.5 items-start">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div className="flex flex-col gap-1 pt-0.5">
                      <span className="font-raleway font-bold text-[13px] text-white leading-tight capitalize">
                        {activity.action.replace(/_/g, ' ')}
                      </span>
                      {activity.details && (
                        <span className="font-sans font-medium text-[12px] text-white/60 leading-relaxed">
                          {activity.details}
                        </span>
                      )}
                      <span className="font-sans font-semibold text-[10px] text-white/30 mt-1 uppercase tracking-wider">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
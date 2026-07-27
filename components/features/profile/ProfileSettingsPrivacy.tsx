"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { FiDownload, FiUserX, FiTrash2 } from "react-icons/fi";
import Toggle from "@/components/ui/Toggle";

const MESSAGE_OPTIONS = [
  "Everyone",
  "Connections Only",
  "Project Collaborators Only",
  "Nobody"
];

export default function ProfileSettingsPrivacy() {
  // Merged States
  const [openToCollaborate, setOpenToCollaborate] = useState(true);
  const [displayName, setDisplayName] = useState<"legal" | "stage">("legal");
  const [showLocation, setShowLocation] = useState(true);
  const [whoCanMessage, setWhoCanMessage] = useState("Everyone");

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-1 mb-3">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white/90">
          Privacy & Controls
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-8.5 text-text-muted">
          Manage how you interact with the platform and your data
        </p>
      </div>

      {/* Card 1: Display Settings (Migrated from Profile Visibility) */}
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
            onChange={() => setOpenToCollaborate(!openToCollaborate)} 
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
              onClick={() => setDisplayName("legal")}
              className="flex items-center gap-3 w-fit group"
            >
              <div className={`w-4.5 h-4.5 rounded-full border-[1.6px] flex items-center justify-center transition-colors ${displayName === "legal" ? "border-primary-green" : "border-text-muted group-hover:border-white/50"}`}>
                {displayName === "legal" && <div className="w-2.5 h-2.5 bg-primary-green rounded-full" />}
              </div>
              <span className={`font-raleway font-medium text-[17.6px] ${displayName === "legal" ? "text-white" : "text-text-muted"}`}>
                Verified Legal Name
              </span>
            </button>
            
            <button 
              onClick={() => setDisplayName("stage")}
              className="flex items-center gap-3 w-fit group"
            >
              <div className={`w-4.5 h-4.5 rounded-full border-[1.6px] flex items-center justify-center transition-colors ${displayName === "stage" ? "border-primary-green" : "border-text-muted group-hover:border-white/50"}`}>
                {displayName === "stage" && <div className="w-2.5 h-2.5 bg-primary-green rounded-full" />}
              </div>
              <span className={`font-raleway font-medium text-[17.6px] ${displayName === "stage" ? "text-white" : "text-text-muted"}`}>
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
            onChange={() => setShowLocation(!showLocation)} 
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
              onClick={() => setWhoCanMessage(option)}
              className={`flex items-center justify-center px-4.5 py-3 rounded-[23.4px] border-[1.6px] font-raleway font-medium text-[17.6px] transition-all duration-200 ${
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
          className="w-fit rounded-[10px] px-6 py-3 h-auto border-[1.6px] border-white/20 text-white/70 hover:text-white hover:bg-white/5 gap-3"
        >
          <FiDownload size={18} />
          <span className="font-raleway font-medium text-[17.6px]">Download My Data</span>
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
            className="shrink-0 border-[1.6px] border-accent-red/30 py-2.25! font-inter font-medium text-[17.6px]"
          >
            Delete Account
          </Button>
        </div>

      </div>
    </div>
  );
}
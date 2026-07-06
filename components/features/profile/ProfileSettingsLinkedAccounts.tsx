"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { FiGlobe } from "react-icons/fi";
import { 
  FaLinkedinIn, 
  FaInstagram, 
  FaBehance, 
  FaDribbble, 
  FaSpotify, 
  FaYoutube, 
  FaXTwitter 
} from "react-icons/fa6";

const ACCOUNTS = [
  { id: "linkedin", platform: "LinkedIn", username: "oyinda-Babalola", sync: "Synced 2 hours ago", connected: true, bg: "bg-[#0A66C2]", icon: FaLinkedinIn },
  { id: "instagram", platform: "Instagram", username: "@oyinda.creates", sync: "Synced 1 day ago", connected: true, bg: "bg-gradient-to-tr from-[#FFDD55] via-[#FF543E] to-[#C837AB]", icon: FaInstagram },
  { id: "behance", platform: "Behance", username: "", sync: "Not connected", connected: false, bg: "bg-[#000000] border border-white/20", icon: FaBehance },
  { id: "dribbble", platform: "Dribbble", username: "oyinda", sync: "Synced 3 days ago", connected: true, bg: "bg-[#EA4C89]", icon: FaDribbble },
  { id: "spotify", platform: "Spotify", username: "", sync: "Not connected", connected: false, bg: "bg-[#1ED760]", icon: FaSpotify },
  { id: "youtube", platform: "YouTube", username: "", sync: "Not connected", connected: false, bg: "bg-[#FF0000]", icon: FaYoutube },
  { id: "twitter", platform: "X (Twitter)", username: "@oyinda_", sync: "Synced 5 hours ago", connected: true, bg: "bg-[#000000] border border-white/20", icon: FaXTwitter },
  { id: "web", platform: "Personal Website", username: "", sync: "Not connected", connected: false, bg: "bg-[#204F99]", icon: FiGlobe }
];

export default function ProfileSettingsLinkedAccounts() {
  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white">
          Linked Accounts
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-white/50">
          Connect your professional profiles to enrich your profile
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {ACCOUNTS.map((account) => {
          const Icon = account.icon;
          
          return (
            <div 
              key={account.id} 
              className="bg-white/5 border border-black/10 rounded-[35px] p-6 flex flex-row items-center justify-between gap-6 backdrop-blur-md transition-all hover:bg-white/10"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                {/* Brand Icon Badge */}
                <div className={`w-[58.6px] h-[58.6px] rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${account.bg}`}>
                  <Icon className="text-white text-[24px]" />
                </div>
                
                {/* Text Data */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-raleway font-medium text-[20.5px] text-white truncate">
                    {account.platform}
                  </span>
                  {account.connected ? (
                    <span className="font-sans font-normal text-[17.6px] text-white/50 truncate">
                      {account.username}
                    </span>
                  ) : null}
                  <span className={`font-sans font-normal text-[14.6px] truncate ${account.connected ? 'text-white/80' : 'text-white/40'}`}>
                    {account.sync}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {account.connected ? (
                <Button 
                  variant="outline" 
                  className="text-[17.6px] border-white/20 text-white/75! shrink-0 hover:bg-accent-red-alt/40! hover:text-white! hover:border-border-muted/10"
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  className="text-[17.6px] shrink-0"
                >
                  Connect
                </Button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
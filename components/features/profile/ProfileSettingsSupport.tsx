"use client";

import React from "react";
import { 
  FiMessageCircle, 
  FiAlertOctagon, 
  FiBookOpen, 
  FiArrowRight,
 FiStar 
} from "react-icons/fi";
import { LuLightbulb } from "react-icons/lu";

const SUPPORT_CARDS = [
  { 
    id: 'contact', 
    title: "Contact Support", 
    desc: "Talk to our team via live chat or email", 
    link: "Open Chat", 
    color: "#6495ED", 
    icon: FiMessageCircle 
  },
  { 
    id: 'report', 
    title: "Report a Problem", 
    desc: "Let us know about bugs or unexpected behavior", 
    link: "Report", 
    color: "#FF0000", 
    icon: FiAlertOctagon 
  },
  { 
    id: 'knowledge', 
    title: "Knowledge Base", 
    desc: "Browse guides, tutorials, and documentation", 
    link: "Browse", 
    color: "#73BF44", 
    icon: FiBookOpen 
  },
  { 
    id: 'feedback', 
    title: "Submit Feedback", 
    desc: "Share your experience with the CollabDen team", 
    link: "Send Feedback", 
    color: "#FBBC04", 
    icon: FiStar
  },
  { 
    id: 'features', 
    title: "Feature Requests", 
    desc: "Suggest new features and vote on existing ideas", 
    link: "Request Feature", 
    color: "#9B59B6", 
    icon: LuLightbulb  
  },
];

export default function ProfileSettingsSupport() {
  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-3">
        <h1 className="font-inter font-semibold text-[26.4px] leading-8.5 text-white">
          Support & Help
        </h1>
        <p className="font-inter font-normal text-[20.5px] leading-7.25 text-text-muted">
          We&apos;re here whenever you need us
        </p>
      </div>

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {SUPPORT_CARDS.map((card) => {
          const Icon = card.icon;
          
          return (
            <div 
              key={card.id} 
              className="bg-black/20 border border-white/10 rounded-[35px] p-7.25 flex flex-col justify-between h-full backdrop-blur-md min-h-58.75 group hover:border-white/20 transition-all"
            >
              <div className="flex flex-col gap-[17.6px]">
                {/* Icon Container */}
                <div 
                  className="w-[58.6px] h-[58.6px] rounded-[23.5px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${card.color}18` }} 
                >
                  <Icon size={26} color={card.color} />
                </div>
                
                {/* Text Data */}
                <div className="flex flex-col gap-0.75">
                  <span className="font-inter font-medium text-[20.5px] text-white">
                    {card.title}
                  </span>
                  <span className="font-inter font-medium text-[17.6px] text-white/50 leading-5.75">
                    {card.desc}
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <button 
                className="flex items-center gap-1.5 mt-[17.6px] w-fit group-hover:opacity-80 transition-opacity"
                style={{ color: card.color }}
              >
                <span className="font-inter font-semibold text-[17.6px]">
                  {card.link}
                </span>
                <FiArrowRight size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* System Status Footer Card */}
      <div className="w-full bg-primary-green/5 border-[1.6px] border-primary-green/15 rounded-[35px] px-7.25 py-5.75 flex flex-row items-center justify-between backdrop-blur-md mt-2.5">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-[17.6px]">
          <div className="w-[11.7px] h-[11.7px] bg-primary-green rounded-full shadow-[0_0_8px_rgba(115,191,68,0.8)] animate-pulse" />
          <span className="font-inter font-normal text-[20.5px] text-white">
            All systems operational
          </span>
        </div>

        {/* Link */}
        <button className="flex items-center gap-1.5 text-primary-green hover:brightness-125 transition-all">
          <span className="font-inter font-medium text-[17.6px]">
            Status Page
          </span>
          <FiArrowRight size={18} />
        </button>
        
      </div>

    </div>
  );
}
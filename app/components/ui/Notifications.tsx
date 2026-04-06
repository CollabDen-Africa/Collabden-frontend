"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LuBell } from "react-icons/lu";
import {
  FaHandshake,
  FaCheck,
  FaUserPlus,
  FaMessage
} from 'react-icons/fa6';
import NotificationItem from '../dashboard/NotificationsItem';



// Mock Data (To be replaced with database fetch)
const NOTIFICATIONS = [
  {
    id: 1,
    user: "John Ike",
    action: "commented on",
    target: "“Summer Vibes Ep”",
    time: "15 minutes ago",
    iconWrapperClass: "bg-[#800080]/20 text-[#800080]",
    icon: FaMessage
  },
  {
    id: 2,
    user: "Tobi Alao",
    action: "approved your mix",
    target: "",
    time: "1 hour ago",
    iconWrapperClass: "bg-accent-green-success/20 text-accent-green-success",
    icon: FaCheck
  },
  {
    id: 3,
    user: "Isa Ali",
    action: "joined your project",
    target: "",
    time: "3 hours ago",
    iconWrapperClass: "bg-primary-blue/20 text-primary-blue", 
    icon: FaUserPlus
  },
  { 
      id: 4, 
      action: "Agreement has been signed for", 
      target: "“Urban Beats”", 
      time: "5 hours ago", 
      iconWrapperClass: "bg-accent-green-success/20 text-accent-green-success", 
      icon: FaHandshake
    },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* The Bell Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-colors ${isOpen ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
      >
        <LuBell className="w-6 h-6 text-black fill-background" />
        <div className="absolute top-2 right-2 w-[12px] h-[12px] bg-accent-red rounded-full border-2 border-white" />
      </button>

      {/* The Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-[413px] bg-white border border-gray-300 rounded-[30px] p-7 shadow-2xl z-50 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
          
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[20px] text-black">Notifications</h2>
            <div className="bg-accent-red/10 text-accent-red px-3 py-1 rounded-full text-[10px] font-medium">
              5 new
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {NOTIFICATIONS.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <NotificationItem {...notif} />
                {index < NOTIFICATIONS.length - 1 && <hr className="border-gray-200" />}
              </React.Fragment>
            ))}
            
            <hr className="border-gray-200" />
            
            <button className="text-primary-green font-semibold text-[16px] text-center w-full mt-2 hover:underline">
              View All Notifications
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}
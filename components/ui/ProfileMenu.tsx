"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";


export default function ProfileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  // Safely construct display name
    const displayName = `${user.firstName} ${user.lastName}`;

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5"
      >
        <Avatar 
          name={displayName} 
          src={user.avatarUrl} 
          className="w-9 h-9 border-2 border-primary-green shrink-0" 
        />
        <div className="hidden md:flex flex-col items-start text-left">
          <span className="font-raleway font-bold text-[14px] text-white leading-tight">
            {displayName}
          </span>
          <span className="font-raleway font-normal text-[12px] text-white/50 leading-tight">
            {user.role}
          </span>
        </div>
        <FiChevronDown 
          size={16} 
          className={`text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-56 bg-black/30 border-[1.1px] border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-md flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 z-999 transform-gpu backface-hidden">
          
          {/* User Info Section */}
          <div className="p-[14px_16px] border-b-[1.1px] border-white/5 flex items-center gap-3">
            <Avatar 
              name={displayName} 
              src={user.avatarUrl} 
              className="w-9 h-9 border-2 border-primary-green shrink-0" 
            />
            <div className="flex flex-col min-w-0">
              <span className="font-raleway font-bold text-[14px] text-white leading-5 truncate">
                {displayName}
              </span>
              <span className="font-raleway font-normal text-[12px] text-white/35 leading-4 truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* Links Section */}
          <div className="p-1.5 flex flex-col">
            <Link 
              href="/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-[10px_12px] rounded-[14px] hover:bg-white/10 transition-colors group"
            >
              <FiUser size={16} className="text-white/55 group-hover:text-white transition-colors" />
              <span className="font-raleway font-medium text-[14px] leading-5 text-white/55 group-hover:text-white transition-colors">
                View Profile
              </span>
            </Link>

            <Link 
              href="/profile-settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-[10px_12px] rounded-[14px] hover:bg-white/10 transition-colors group"
            >
              <FiSettings size={16} className="text-white/55 group-hover:text-white transition-colors" />
              <span className="font-raleway font-medium text-[14px] leading-5 text-white/55 group-hover:text-white transition-colors">
                Account Settings
              </span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="p-1.5 border-t-[1.1px] border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-[10px_12px] rounded-[14px] hover:bg-primary-white/10 transition-colors group"
            >
              <FiLogOut size={16} className="text-accent-red group-hover:text-red-400 transition-colors" />
              <span className="font-raleway font-medium text-[14px] leading-5 text-accent-red group-hover:text-red-400 transition-colors">
                Log Out
              </span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
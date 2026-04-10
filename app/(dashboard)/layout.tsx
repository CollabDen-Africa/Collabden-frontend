"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import Avatar from '@/app/components/ui/Avatar';
import NotificationBell from '@/app/components/ui/Notifications';
import { 
  FaCreditCard,
  FaFolderOpen,
  FaUser,
  FaPlus,
  FaBars,
  FaTimes,
  FaSearch,
  FaStore,
  FaHandshake
} from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

// MOCK SESSION STATE
const CURRENT_USER = {
  firstName: "Emmanuel",
  lastName: "O",
  fullName: "Emmanuel O",
  role: "Producer",
  avatarUrl: "/mock-profiles/small.png",
  activeProjectCount: 3
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white font-raleway overflow-hidden relative">
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[221px] flex-shrink-0 border-r border-gray-300 flex flex-col justify-between bg-white transform transition-transform duration-300 ease-in-out 
          lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Area */}
        <div className="h-[86px] border-b border-gray-300 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-green rounded-[9px] flex items-center justify-center shrink-0">
              <Image
                src="/collabden-logo-small.png"
                alt="logo"
                width={25}
                height={25}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[20px] leading-tight text-black">CollabDen</span>
              <span className="font-medium text-[13px] leading-tight text-black/60">Studio Pro</span>
            </div>
          </div>
          {/* Close Button for Mobile Only */}
          <button 
            className="lg:hidden text-black/60 hover:text-black p-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <Link href="/dashboard" className="flex items-center gap-3 px-6 py-4 bg-primary-green rounded-2xl text-white">
            <FaFolderOpen className="w-5 h-5" />
            <span className="font-bold text-[16px]">Projects</span>
          </Link>
          
          {[
            { name: 'Marketplace', icon: FaStore, href: '/marketplace' },
            { name: 'Messages', icon: IoIosChatbubbles, href: '/messages' },
            { name: 'Agreements', icon: FaHandshake, href: '/agreements' },
            { name: 'Payment', icon: FaCreditCard, href: '/payment' },
            { name: 'Profile', icon: FaUser, href: '/profile' },
          ].map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-3 px-6 py-4 text-black/60 hover:bg-gray-50 rounded-2xl transition-colors">
              <item.icon className="w-5 h-5 shrink-0 fill-accent-gray stroke-accent-pink" />
              <span className="font-medium text-[16px]">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Bottom */}
        <div className="h-[97px] border-t-2 border-gray-300 flex items-center px-4 gap-4 shrink-0">
          <Avatar 
            name={CURRENT_USER.fullName} 
            src={CURRENT_USER.avatarUrl} 
            className="w-[42px] h-[42px] text-[16px]" 
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[16px] text-black truncate">{CURRENT_USER.fullName}</span>
            <span className="font-medium text-[14px] text-black/60 truncate">{CURRENT_USER.role}</span>
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* HEADER - Adjusted padding and heights for smaller screens */}
        <header className="min-h-[70px] lg:h-[86px] py-4 lg:py-0 border-b border-gray-300 bg-white flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
          
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle (Mobile Only) */}
            <button 
              className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars className="w-5 h-5" />
            </button>

            {/* Greeting Area (Subtitle hidden on mobile to save space) */}
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-[22px] md:text-[30px] leading-none text-black">Dashboard</h1>
              <p className="hidden md:block font-medium text-[16px] text-black/60">
                Welcome back, {CURRENT_USER.firstName}! You have {CURRENT_USER.activeProjectCount} active projects.
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Search Bar - Hidden on Mobile, Flexible width on Tablet/Desktop */}
            <div className="hidden lg:flex items-center gap-2 px-6 h-[40px] bg-gray-100 border border-gray-300 rounded-full w-[250px] xl:w-[472px]">
              <FaSearch className="text-black/40 w-4 h-4 shrink-0" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-black/50 text-black"
              />
            </div>

            <NotificationBell />

            {/* New Project Button - Icon only on mobile, full text on larger screens */}
            <Button variant="primary" icon={FaPlus} iconPosition="left" className="px-3 md:px-6 h-[40px]">
              <span className="hidden sm:inline">New Project</span>
            </Button>
          </div>

        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
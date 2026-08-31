import React, { useState } from 'react';
import { Shield, Clock, Lock, Settings2 } from 'lucide-react';

const historyData = [
  { id: 1, section: 'General', sectionTheme: 'green', setting: 'Platform Name', prevValue: 'CollabDen Beta', newValue: 'CollabDen', admin: 'Super Admin', date: 'Jul 13, 2025 · 10:20 AM' },
  { id: 2, section: 'Payments', sectionTheme: 'teal', setting: 'Marketplace Service Fee', prevValue: '8%', newValue: '10%', admin: 'Super Admin', date: 'Jul 10, 2025 · 9:00 AM' },
  { id: 3, section: 'Payments', sectionTheme: 'teal', setting: 'Minimum Withdrawal Amount', prevValue: '₦2,000', newValue: '₦5,000', admin: 'Super Admin', date: 'Jul 8, 2025 · 3:30 PM' },
  { id: 4, section: 'Marketplace', sectionTheme: 'blue', setting: 'Marketplace Enabled', prevValue: 'Enabled', newValue: 'Maintenance (4 hrs)', admin: 'Super Admin', date: 'Jul 5, 2025 · 11:00 PM' },
  { id: 5, section: 'Users', sectionTheme: 'purple', setting: 'Verification Required to Sell', prevValue: 'Off', newValue: 'On', admin: 'Super Admin', date: 'Jun 28, 2025 · 10:15 AM' },
  { id: 6, section: 'Features', sectionTheme: 'yellow', setting: 'Analytics Dashboard Feature', prevValue: 'Enabled', newValue: 'Disabled', admin: 'Super Admin', date: 'Jun 20, 2025 · 8:00 PM' },
  { id: 7, section: 'Users', sectionTheme: 'purple', setting: 'Default Profile Visibility', prevValue: 'Public', newValue: 'Connections Only', admin: 'Super Admin', date: 'Jun 15, 2025 · 2:00 PM' },
  { id: 8, section: 'General', sectionTheme: 'green', setting: 'Default Language', prevValue: 'English (en-US)', newValue: 'English (en-NG)', admin: 'Super Admin', date: 'Jun 12, 2025 · 11:30 AM' },
  { id: 9, section: 'Notifications', sectionTheme: 'red', setting: 'Email Notifications — Payments', prevValue: 'Off', newValue: 'On', admin: 'Super Admin', date: 'Jun 10, 2025 · 9:45 AM' },
];

const FILTERS = ['All Sections', 'General', 'Users', 'Marketplace', 'Payments', 'Notifications', 'Features'];

export default function ChangeHistoryTab() {
  const [activeFilter, setActiveFilter] = useState('All Sections');

  const displayedHistory = activeFilter === 'All Sections' 
    ? historyData 
    : historyData.filter(item => item.section === activeFilter);

  return (
    <div className="flex flex-col w-full">
      
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-0.75 h-4 bg-primary-blue rounded-sm" />
          <h2 className="font-['Raleway'] font-bold text-sm text-white">
            Platform-Wide Settings Change History
          </h2>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/4 border-[0.8px] border-secondary-blue/20 rounded-lg">
          <Shield className="w-2.75 h-2.75 text-secondary-blue" />
          <span className="font-['Inter'] font-semibold text-[11px] text-secondary-blue">
            Immutable · Read-Only
          </span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-row items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex flex-col items-center px-3.25 py-1.25 border-[0.8px] rounded-full whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-primary-green/10 border-primary-green/20 text-primary-green font-bold'
                : 'bg-white/3 border-white/10 text-white/45 font-medium hover:bg-white/8'
            }`}
          >
            <span className="font-['Inter'] text-[11px] leading-relaxed">
              {filter}
            </span>
          </button>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="flex flex-col w-full bg-white/5 border-[0.8px] border-white/10 rounded-[20px] overflow-hidden">
        
        {/* Table Area */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-212.5 w-full flex flex-col">
            
            {/* Table Header */}
            <div className="flex flex-row items-center h-9.25 w-full bg-white/3 border-b-[0.8px] border-white/10">
              <div className="w-11.25 shrink-0 px-3.5">
                <span className="font-['Inter'] font-bold text-[10px] tracking-wide uppercase text-white/45 text-center block w-full">#</span>
              </div>
              <div className="flex-1 min-w-27.5 px-3.5">
                <span className="font-['Inter'] font-bold text-[10px] tracking-wide uppercase text-white/45">Section</span>
              </div>
              <div className="flex-[1.5] min-w-40 px-3.5">
                <span className="font-['Inter'] font-bold text-[10px] tracking-wide uppercase text-white/45">Setting Changed</span>
              </div>
              <div className="flex-1 min-w-31.25 px-3.5">
                <span className="font-['Inter'] font-bold text-[10px] tracking-wide uppercase text-white/45">Previous Value</span>
              </div>
              <div className="flex-[1.2] min-w-35 px-3.5">
                <span className="font-['Inter'] font-bold text-[10px] tracking-wide uppercase text-white/45">New Value</span>
              </div>
              <div className="flex-1 min-w-31.25 px-3.5">
                <span className="font-['Inter'] font-bold text-[10px] tracking-wide uppercase text-white/45">Administrator</span>
              </div>
              <div className="flex-1 min-w-32.5 px-3.5">
                <span className="font-['Inter'] font-bold text-[10px] tracking-wide uppercase text-white/45">Date & Time</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col w-full">
              {displayedHistory.map((row) => (
                <HistoryRow key={row.id} data={row} />
              ))}
            </div>

          </div>
        </div>

        {/* Table Footer */}
        <div className="flex flex-row justify-between items-center px-5 py-3 w-full bg-white/3 border-t-[0.8px] border-white/10">
          <span className="font-['Inter'] text-[12px] text-white/45">
            {historyData.length} entries across all settings sections · Retained for compliance
          </span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-2.275 h-2.275 text-primary-green" />
            <span className="font-['Inter'] font-semibold text-[11px] text-primary-green">
              Cryptographically Sealed
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent for individual table rows
function HistoryRow({ data }: { data: any }) {
  const themes: Record<string, { bg: string; text: string }> = {
    green: { bg: 'bg-primary-green/10', text: 'text-primary-green' },
    teal: { bg: 'bg-[#11EA9B]/10', text: 'text-[#11EA9B]' },
    blue: { bg: 'bg-secondary-blue/10', text: 'text-secondary-blue' },
    purple: { bg: 'bg-[#A78BFA]/10', text: 'text-[#A78BFA]' },
    yellow: { bg: 'bg-accent-yellow/10', text: 'text-accent-yellow' },
    red: { bg: 'bg-accent-red/10', text: 'text-accent-red' },
  };

  const themeClass = themes[data.sectionTheme] || themes.green;

  return (
    <div className="flex flex-row items-center h-14.5 w-full border-b-[0.8px] border-white/10 hover:bg-white/2 transition-colors">
      
      {/* Index */}
      <div className="w-11.25 shrink-0 px-3.5">
        <span className="font-['Inter'] text-[11px] text-white/45 text-center block w-full">
          {data.id}
        </span>
      </div>

      {/* Section Badge */}
      <div className="flex-1 min-w-27.5 px-3.5 flex items-center">
        <div className={`px-2.5 py-0.5 rounded-full ${themeClass.bg}`}>
          <span className={`font-['Inter'] font-bold text-[10px] ${themeClass.text}`}>
            {data.section}
          </span>
        </div>
      </div>

      {/* Setting Changed */}
      <div className="flex-[1.5] min-w-40 px-3.5 flex items-center gap-2">
        <div className="flex justify-center items-center w-6.5 h-6.5 bg-white/3 border-[0.8px] border-white/10 rounded-md shrink-0">
          <Settings2 className="w-2.75 h-2.75 text-white/45" />
        </div>
        <span className="font-['Raleway'] font-bold text-[12px] text-white truncate">
          {data.setting}
        </span>
      </div>

      {/* Previous Value */}
      <div className="flex-1 min-w-31.25 px-3.5 flex items-center">
        <div className="px-2.5 py-0.5 bg-accent-red/10 rounded-md truncate max-w-27.5">
          <span className="font-['Inter'] font-bold text-[11px] text-accent-red">
            {data.prevValue}
          </span>
        </div>
      </div>

      {/* New Value */}
      <div className="flex-[1.2] min-w-35 px-3.5 flex items-center">
        <div className="px-2.5 py-0.5 bg-primary-green/10 rounded-md truncate max-w-35">
          <span className="font-['Inter'] font-bold text-[11px] text-primary-green">
            {data.newValue}
          </span>
        </div>
      </div>

      {/* Administrator */}
      <div className="flex-1 min-w-31.25 px-3.5 flex items-center gap-2 truncate">
        <div className="flex justify-center items-center w-5 h-5.5 bg-primary-green/20 border-[0.8px] border-white/10 rounded-[10px] shrink-0">
          <span className="font-['Raleway'] font-bold text-[8px] text-primary-green">SA</span>
        </div>
        <span className="font-['Raleway'] font-semibold text-[12px] text-white truncate">
          {data.admin}
        </span>
      </div>

      {/* Date & Time */}
      <div className="flex-1 min-w-32.5 px-3.5 flex items-center gap-1.5">
        <Clock className="w-2.75 h-2.75 text-white/45 shrink-0" />
        <span className="font-['Inter'] text-[11px] text-white/45 whitespace-nowrap">
          {data.date}
        </span>
      </div>

    </div>
  );
}


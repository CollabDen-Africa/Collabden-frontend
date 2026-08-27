import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface AuditControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
  adminFilter: string;
  onAdminFilterChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
}

export default function AuditControls({
  searchTerm, onSearchChange,
  actionFilter, onActionFilterChange,
  adminFilter, onAdminFilterChange,
  dateFilter, onDateFilterChange
}: AuditControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full max-w-300 mt-5.5">
      
      {/* Search Field */}
      <div className="flex flex-1 items-center gap-2 px-3.5 py-2 h-9 w-full sm:max-w-200 bg-white/5 border-[0.8px] border-white/9 rounded-full">
        <Search size={13} className="text-white/45 shrink-0" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search audit entries..." 
          className="bg-transparent border-none outline-none font-raleway text-[12px] leading-4.5 text-white w-full placeholder:text-white/45"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
        
        {/* Action Filter */}
        <div className="relative flex items-center bg-white/5 border-[0.8px] border-white/9 rounded-full shrink-0 h-[35.6px] min-w-[104.8px]">
          <select 
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            className="appearance-none bg-transparent outline-none pl-[18.8px] pr-8 py-1 font-inter text-[11px] leading-3.25 text-white/45 cursor-pointer w-full h-full"
          >
            <option value="All Actions" className="bg-[#13161D]">All Actions</option>
            <option value="Approvals" className="bg-[#13161D]">Approvals</option>
            <option value="Rejections" className="bg-[#13161D]">Rejections</option>
          </select>
          <ChevronDown size={10} className="absolute right-3.5 text-white/45 pointer-events-none" />
        </div>

        {/* Admin Filter */}
        <div className="relative flex items-center bg-white/5 border-[0.8px] border-white/9 rounded-full shrink-0 h-[35.6px] min-w-[104.8px]">
          <select 
            value={adminFilter}
            onChange={(e) => onAdminFilterChange(e.target.value)}
            className="appearance-none bg-transparent outline-none pl-[18.8px] pr-8 py-1 font-inter text-[11px] leading-3.25 text-white/45 cursor-pointer w-full h-full"
          >
            <option value="All Admins" className="bg-[#13161D]">All Admins</option>
            <option value="Super Admins" className="bg-[#13161D]">Super Admins</option>
            <option value="Verification Admins" className="bg-[#13161D]">Verification Admins</option>
          </select>
          <ChevronDown size={10} className="absolute right-3.5 text-white/45 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative flex items-center bg-white/5 border-[0.8px] border-white/9 rounded-full shrink-0 h-[35.6px] min-w-[109.6px]">
          <select 
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="appearance-none bg-transparent outline-none pl-[18.8px] pr-8 py-1 font-inter text-[11px] leading-3.25 text-white/45 cursor-pointer w-full h-full"
          >
            <option value="Date Range" className="bg-[#13161D]">Date Range</option>
            <option value="Last 7 Days" className="bg-[#13161D]">Last 7 Days</option>
            <option value="Last 30 Days" className="bg-[#13161D]">Last 30 Days</option>
          </select>
          <ChevronDown size={10} className="absolute right-3.5 text-white/45 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
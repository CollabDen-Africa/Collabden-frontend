import React from 'react';
import { Search, ListFilter, ChevronDown } from 'lucide-react';

interface DashboardControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  dateFilter: string; 
    onDateFilterChange: (value: string) => void;
}

export default function DashboardControls({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange, typeFilter, onTypeFilterChange, dateFilter, onDateFilterChange }: DashboardControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 w-full max-w-400 mt-5">
      <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full min-w-50 max-w-90">
        <Search size={13} className="text-white/45 shrink-0" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, user ID, or status…" 
          className="bg-transparent border-none outline-none text-[12px] font-raleway text-white w-full placeholder:text-white/45"
        />
      </div>
      
      <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-full transition-colors hover:bg-white/10">
        <ListFilter size={13} className="text-white/45" />
        <span className="font-raleway text-[12px] text-white/45">Filters</span>
      </button>
      
      {/* Status Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors shrink-0">
              <select 
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="appearance-none bg-transparent outline-none pl-4 pr-8 py-2 font-inter text-[11px] text-white/45 cursor-pointer w-full"
              >
                <option value="All" className="bg-[#13161D]">All Statuses</option>
                <option value="Pending" className="bg-[#13161D]">Pending</option>
                <option value="Under Review" className="bg-[#13161D]">Under Review</option>
                <option value="Approved" className="bg-[#13161D]">Approved</option>
                <option value="Rejected" className="bg-[#13161D]">Rejected</option>
                <option value="Incomplete" className="bg-[#13161D]">Incomplete / Expired</option>
              </select>
              <ChevronDown size={10} className="absolute right-3 text-white/45 pointer-events-none" />
            </div>
      
            {/* Type Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors shrink-0">
              <select 
                value={typeFilter}
                onChange={(e) => onTypeFilterChange(e.target.value)}
                className="appearance-none bg-transparent outline-none pl-4 pr-8 py-2 font-inter text-[11px] text-white/45 cursor-pointer w-full"
              >
                <option value="All" className="bg-[#13161D]">All Types</option>
                <option value="Identity Document" className="bg-[#13161D]">Identity Document</option>
                <option value="Selfie + ID" className="bg-[#13161D]">Selfie + ID</option>
                <option value="Artist Portfolio" className="bg-[#13161D]">Artist Portfolio</option>
                <option value="Business Reg." className="bg-[#13161D]">Business Reg.</option>
              </select>
              <ChevronDown size={10} className="absolute right-3 text-white/45 pointer-events-none" />
      </div>

      {/* Date Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors shrink-0">
              <select 
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value)}
                className="appearance-none bg-transparent outline-none pl-4 pr-8 py-2 font-inter text-[11px] text-white/45 cursor-pointer w-full"
              >
                <option value="All" className="bg-[#13161D]">All Dates</option>
                <option value="Jul 2025" className="bg-[#13161D]">July 2025</option>
                <option value="Jun 2025" className="bg-[#13161D]">June 2025</option>
                <option value="May 2025" className="bg-[#13161D]">May 2025</option>
              </select>
              <ChevronDown size={10} className="absolute right-3 text-white/45 pointer-events-none" />
            </div>
    </div>
  );
}
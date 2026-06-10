"use client";

import React, { useState } from "react";
import { FiUsers, FiSearch, FiMoreVertical } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar"; 
import Select from "@/components/ui/Select";

// --- MOCK DATA ---
const TEAM_MEMBERS = [
  { id: "m1", name: 'David Chen', role: 'Mixing Engineer', email: 'davidchen24@gmail.com', access: 'Editor', isOwner: true },
  { id: "m2", name: 'Tayo Oni', role: 'Producer', email: 'tayooni68@gmail.com', access: 'Editor', isOwner: false },
  { id: "m3", name: 'Michael Awe', role: 'Vocalist', email: 'michaelawe22@gmail.com', access: 'Viewer', isOwner: false },
  { id: "m4", name: 'Chika Ike', role: 'Bass Player', email: 'johnike244@gmail.com', access: 'Viewer', isOwner: false },
];

export default function MembersSettingsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState(TEAM_MEMBERS);

  // Filter members based on search
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccessChange = (id: string, newAccess: string) => {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, access: newAccess } : m));
    };

  return (
    <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-[32px] w-full max-w-[860px]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] gap-[16px] bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-[54px] h-[54px] bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiUsers className="text-white" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
              Members & Roles
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-[21px] text-white/60">
              Manage who has access to this project and what they can do.
            </p>
          </div>
        </div>

        {/* Search Bar Wrapper */}
        <div className="flex flex-col w-full gap-[16px]">
          <div className="w-full h-[50px] bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-full flex items-center px-[20px] transition-all duration-300 shadow-sm group">
            <FiSearch className="text-white/50 group-focus-within:text-primary-green shrink-0 mr-[12px] transition-colors" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-raleway font-medium text-[16px] text-white placeholder:text-white/50"
              placeholder="Search collaborators"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="flex flex-col w-full gap-[12px] mt-[10px]">
          
          {filteredMembers.length === 0 ? (
            <div className="w-full py-8 text-center text-white/50 font-raleway font-medium">
              No collaborators found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between w-full p-[16px] lg:px-[24px] lg:py-[20px] bg-black/10 hover:bg-black/20 border border-white/5 hover:border-white/10 rounded-[24px] transition-all duration-300"
              >
                
                {/* Left Side: Avatar & Info */}
                <div className="flex items-center gap-[16px]">
                  <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 bg-white/10 border border-white/20">
                     <Avatar name={member.name} /> 
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white">
                        {member.name}
                      </span>
                      {member.isOwner && (
                        <span className="bg-primary-green/20 border border-primary-green/30 text-primary-green text-[10px] font-bold uppercase tracking-wider px-[8px] py-[2px] rounded-full">
                          Owner
                        </span>
                      )}
                    </div>
                    <span className="font-raleway font-medium text-[13px] lg:text-[14px] text-white/60">
                      {member.role} • {member.email}
                    </span>
                  </div>
                </div>

                {/* Right Side: Access Level & Options */}
                <div className="flex items-center gap-[16px] lg:gap-[24px]">
                  
                  {/* Select Dropdown (Native for simplicity, but you can swap to your custom Select) */}
                  <div className="hidden sm:block">
                    <Select 
                                          options={["Viewer", "Editor", "Admin"]}
                                          value={member.access}
                                          onChange={(val) => handleAccessChange(member.id, val)}
                                          variant="glass"
                                          disabled={member.isOwner}
                                        />
                  </div>

                  {/* Options Menu Button */}
                  <button 
                    className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={member.isOwner}
                  >
                    <FiMoreVertical size={20} />
                  </button>

                </div>
              </div>
            ))
          )}
          
        </div>

      </div>
    </div>
  );
}
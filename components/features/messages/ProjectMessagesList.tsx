"use client";

import React from "react";
import Avatar from "@/components/ui/Avatar";
import { FiHeadphones } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Mock Data
const MOCK_PROJECT_CHATS = [
  { id: "p1", name: "Acoustic Sessions", genre: "Hip-Hop", tracks: 4, collaborators: 2, unread: 2, avatars: ["/mock-profiles/small.png", "/mock-profiles/small3.png"] },
  { id: "p2", name: "Urban Beats Vol. 2", genre: "Hip-Hop", tracks: 5, collaborators: 4, unread: 4, avatars: ["/mock-profiles/small.png", "/mock-profiles/small2.png", "/mock-profiles/small3.png", "/mock-profiles/small.png"] },
  { id: "p3", name: "Urban Beats Vol. 3", genre: "Hip-Hop", tracks: 6, collaborators: 5, unread: 2, avatars: ["/mock-profiles/small3.png", "/mock-profiles/small.png", "/mock-profiles/small2.png", "/mock-profiles/small.png", "/mock-profiles/small3.png"] },
];

export default function ProjectMessagesList() {
  const router = useRouter();

  return (
    <div className="hidden lg:flex flex-col bg-white/10 rounded-[30px] transition-all duration-500 relative shadow-2xl h-full flex-1 w-full max-w-153 overflow-hidden border border-white/5">
      
      {/* Header */}
      <div className="absolute top-18.25 left-3 flex flex-row justify-center items-center p-2.5 gap-2.5 w-46.75 h-10.75">
         <span className="font-raleway font-semibold text-[20px] leading-5.75 text-white/85">
           Project Messages
         </span>
      </div>

      {/* List Container */}
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar w-full mt-33.5 px-5.5 pb-5 gap-4">
        {MOCK_PROJECT_CHATS.map((project) => (
          <button 
            key={project.id}
            onClick={() => 
              router.push('/workspace/messages')
            } 
            className="flex flex-col items-start p-[20px_16px_10px] w-full h-35.25 shrink-0 bg-white/10 rounded-[30px] hover:bg-white/15 transition-colors border border-transparent hover:border-white/10 text-left relative group"
          >
             <div className="flex flex-col gap-4.75 w-full h-full">
                
                {/* Top Half (Row: Icon + Titles) */}
                <div className="flex flex-row items-start gap-6 w-full">
                  
                  {/* Tilted Green Icon Box */}
                  <div className="w-[39.33px] h-[39.33px] bg-primary-green rounded-[6.55px] rotate-[-1.49deg] flex items-center justify-center shrink-0 shadow-[0px_2.9px_2.9px_rgba(0,0,0,0.25)] mt-1">
                     <FiHeadphones className="text-white rotate-[1.49deg]" size={20} />
                  </div>
                  
                  {/* Title & Subtitle Stack */}
                  <div className="flex flex-col gap-3 mt-1">
                     <span className="font-raleway font-semibold text-[20px] leading-5.75 text-white">
                       {project.name}
                     </span>
                     <div className="flex flex-row items-center gap-2.5">
                       <span className="font-raleway font-medium text-[16px] leading-4.75 text-white/60">
                         {project.genre}
                       </span>
                       <div className="w-2 h-2 rounded-full bg-white/60" />
                       <span className="font-raleway font-medium text-[16px] leading-4.75 text-white/60">
                         {project.tracks} tracks in progress
                       </span>
                     </div>
                  </div>
                </div>

                {/* Bottom Half (Collaborators) */}
                <div className="flex flex-row items-center gap-1.5 pl-15.75">
                   {/* Avatars Overlapping */}
                   <div className="flex flex-row items-center">
                      {project.avatars.map((src, i) => (
                        <div 
                          key={i} 
                          className="w-5.75 h-5.75 rounded-full border-[1.15px] border-primary-green overflow-hidden relative" 
                          style={{ marginLeft: i > 0 ? '-11.5px' : '0', zIndex: project.avatars.length - i }}
                        >
                          <Avatar name={`collab-${i}`} src={src} className="w-full h-full object-cover" />
                        </div>
                      ))}
                   </div>
                   <span className="font-raleway font-medium text-[16px] leading-4.75 text-white/60 ml-1.5">
                     {project.collaborators} collaborators
                   </span>
                </div>

             </div>

             {/* Unread Badge */}
             <div className="absolute right-4 flex flex-row justify-center items-center p-[4px_10px] gap-2.5 w-6 h-6 bg-primary-green border border-accent-green-success rounded-full shadow-sm">
                <span className="font-inter font-medium text-sm leading-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                  {project.unread}
                </span>
             </div>

          </button>
        ))}
      </div>
    </div>
  );
}
"use client";

import React from "react";
import Avatar from "@/components/ui/Avatar";
import { FiHeadphones } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/projects/useProjects";

export default function ProjectMessagesList() {
  const router = useRouter();
  const { useAllProjects } = useProjects();
  const { data: myProjects = [], isLoading } = useAllProjects();

  return (
    <div className="hidden lg:flex flex-col bg-white/10 rounded-[30px] transition-all duration-500 relative shadow-2xl h-full flex-1 w-full max-w-153 overflow-hidden border border-white/5">
      
      <div className="absolute top-18.25 left-3 flex flex-row justify-center items-center p-2.5 gap-2.5 w-46.75 h-10.75">
         <span className="font-raleway font-semibold text-[20px] leading-5.75 text-white/85">
           Project Messages
         </span>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar w-full mt-33.5 px-5.5 pb-5 gap-4">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
          </div>
        ) : myProjects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <FiHeadphones className="text-white/30 mb-3" size={36} />
            <p className="text-sm font-semibold text-white/80">No active project conversations</p>
            <p className="text-xs text-white/40 mt-1">Join or create a project to start messaging collaborators.</p>
          </div>
        ) : (
          myProjects.map((project: any) => {
            const collaborators = project.collaborators || [];
            const genre = project.genre || project.category || "General";
            const trackCount = project.files?.length || 0;

            return (
              <button 
                key={project.id}
                onClick={() => router.push("/workspace/messages?projectId=" + project.id)} 
                className="flex flex-col items-start p-[20px_16px_10px] w-full shrink-0 bg-white/10 rounded-[30px] hover:bg-white/15 transition-colors border border-transparent hover:border-white/10 text-left relative group"
              >
                 <div className="flex flex-col gap-4.75 w-full h-full">
                    
                    <div className="flex flex-row items-start gap-6 w-full">
                      <div className="w-[39.33px] h-[39.33px] bg-primary-green rounded-[6.55px] rotate-[-1.49deg] flex items-center justify-center shrink-0 shadow-md mt-1">
                         <FiHeadphones className="text-white rotate-[1.49deg]" size={20} />
                      </div>
                      
                      <div className="flex flex-col gap-1.5 mt-1">
                         <span className="font-raleway font-semibold text-[18px] leading-5.75 text-white truncate">
                           {project.title || project.name}
                         </span>
                         <div className="flex flex-row items-center gap-2.5">
                           <span className="font-raleway font-medium text-[14px] text-white/60">
                             {genre}
                           </span>
                           <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                           <span className="font-raleway font-medium text-[14px] text-white/60">
                             {trackCount} tracks
                           </span>
                         </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-1.5 pl-15.75">
                       <div className="flex flex-row items-center">
                          {collaborators.slice(0, 4).map((c: any, i: number) => (
                            <div 
                              key={c.id || i} 
                              className="w-5.75 h-5.75 rounded-full border-[1.15px] border-primary-green overflow-hidden relative" 
                              style={{ marginLeft: i > 0 ? '-8px' : '0', zIndex: collaborators.length - i }}
                            >
                              <Avatar name={c.user?.displayName || "Member"} src={c.user?.avatarUrl} className="w-full h-full object-cover" />
                            </div>
                          ))}
                       </div>
                       <span className="font-raleway font-medium text-[14px] text-white/60 ml-1.5">
                         {collaborators.length} collaborators
                       </span>
                    </div>

                 </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

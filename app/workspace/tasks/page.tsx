"use client";

import React from "react";
import Avatar from "@/app/components/ui/Avatar";

// Mock data
const BOARD_DATA = [
  {
    title: "To do",
    count: 2,
    dotColor: "bg-[#D9D9D9]",
    tasks: [
      { 
        id: 1, 
        title: "Record ad-libs for track 3", 
        tag: "Recording", 
        tagBg: "bg-[#204F99]/50", 
        tagText: "text-[#C8E6FF]", 
        avatar: "/avatar.svg" 
      },
      { 
        id: 2, 
        title: "Create cover art concepts", 
        tag: "Design", 
        tagBg: "bg-[#DF69DF]/50", 
        tagText: "text-[#C8E6FF]", 
        avatar: "/mock-profiles/Sam.png" 
      }
    ]
  },
  {
    title: "In Progress",
    count: 2,
    dotColor: "bg-[#FFFF00]",
    tasks: [
      { 
        id: 3, 
        title: "Mix vocals for track 1", 
        tag: "Mixing", 
        tagBg: "bg-[#FFFF00]/20", 
        tagText: "text-[#FFFF00]", 
        avatar: "/avatar.svg" 
      },
      { 
        id: 4, 
        title: "Write hook for track 5", 
        tag: "Writing", 
        tagBg: "bg-[#11EA9B]/50", 
        tagText: "text-[#11EA9B]", 
        avatar: "/mock-profiles/small.png" 
      }
    ]
  },
  {
    title: "Done",
    count: 3,
    dotColor: "bg-primary-green",
    tasks: [
      { 
        id: 5, 
        title: "Produce beat for track 1", 
        tag: "Production", 
        tagBg: "bg-primary-green/20", 
        tagText: "text-primary-green", 
        avatar: "/mock-profiles/David.png" 
      },
      { 
        id: 6, 
        title: "Record ad-libs for track 3", 
        tag: "Recording", 
        tagBg: "bg-[#204F99]/50", 
        tagText: "text-[#C8E6FF]", 
        avatar: "/avatar.svg" 
      },
      { 
        id: 7, 
        title: "Master track 4", 
        tag: "Mastering", 
        tagBg: "bg-[#DF69DF]/50", 
        tagText: "text-[#C8E6FF]", 
        avatar: "/mock-profiles/David.png" 
      }
    ]
  }
];

export default function WorkspaceTasksPage() {
  return (
    <div className="w-full h-full animate-in fade-in duration-300 overflow-x-auto custom-scrollbar pb-8">
      
      {/* Kanban Board Container */}
      <div className="flex flex-row items-start gap-8 lg:gap-[73px] min-w-max">
        
        {BOARD_DATA.map((column, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-[19px] w-[333px]">
            
            {/* Column Header */}
            <div className="flex items-center gap-2 w-full">
              <div className={`w-[10px] h-[10px] rounded-full ${column.dotColor}`} />
              <span className="font-sans font-medium text-[16px] leading-[19px] text-white">
                {column.title}
              </span>
              <span className="font-sans font-medium text-[16px] leading-[19px] text-white ml-1">
                {column.count}
              </span>
            </div>

            {/* Task Cards Column */}
            <div className="flex flex-col gap-[16px] w-full">
              {column.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex flex-col gap-[16px] w-full p-[20px_15px] bg-black/20 border border-[#D7D7D7]/50 rounded-[20px] cursor-pointer hover:border-primary-green/50 hover:bg-black/30 transition-all"
                >
                  
                  {/* Task Title */}
                  <h4 className="font-sans font-medium text-[16px] leading-[19px] text-white">
                    {task.title}
                  </h4>

                  {/* Task Metadata (Tag & Avatar) */}
                  <div className="flex items-center justify-between w-full mt-2">
                    
                    {/* Category Pill */}
                    <div className={`flex items-center justify-center px-[10px] py-[5px] rounded-[20px] ${task.tagBg}`}>
                      <span className={`font-sans font-medium text-[12px] leading-[14px] ${task.tagText}`}>
                        {task.tag}
                      </span>
                    </div>

                    {/* Assignee Avatar */}
                    <div className="w-[25px] h-[25px] rounded-full border border-primary-green overflow-hidden relative shrink-0">
                      <Avatar name="Assignee" src={task.avatar} className="w-full h-full" />
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
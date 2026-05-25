"use client";

import React, { useState, useRef, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { MOCK_BOARD, Column, Priority } from "@/lib/mockData";
import CreateTaskModal from "@/components/features/workspace/CreateNewTask"

// --- HELPERS ---
const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case "High":
      return "border-accent-red-alt text-accent-red-alt bg-accent-red-alt/10";
    case "Medium":
      return "border-accent-yellow text-accent-yellow bg-accent-yellow/10";
    case "Low":
      return "border-primary-blue text-primary-blue bg-primary-blue/10";
    default:
      return "border-white/50 text-white bg-white/10";
  }
};

const getPriorityDot = (priority: Priority) => {
  switch (priority) {
    case "High": return "bg-accent-red-alt";
    case "Medium": return "bg-accent-yellow";
    case "Low": return "bg-primary-blue";
    default: return "bg-white";
  }
};

const FILTERS = ["All priorities", "High", "Medium", "Low"];

export default function TasksPage() {
  const [columns, setColumns] = useState<Column[]>(MOCK_BOARD);
  
  // Filter Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All priorities");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter columns based on selected priority
  const filteredColumns = columns.map(col => ({
    ...col,
    tasks: col.tasks.filter(task => 
      selectedFilter === "All priorities" ? true : task.priority === selectedFilter
    )
  }));
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const handleCreateTask = (newTask: any) => {
      setColumns(prevColumns => prevColumns.map(col => {
        if (col.id === newTask.status) {
          const taskData = { ...newTask };
          delete taskData.status; 
          return { ...col, tasks: [...col.tasks, taskData] };
        }
        return col;
      }));
    };

  return (
    <div className="flex flex-col w-full h-full pb-4">
      
      {/* Top Filter Bar */}
      <div className="flex justify-end w-full mb-6 pr-2 relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 transition-colors rounded-full px-4 py-2 ${
            selectedFilter !== "All priorities" ? "bg-primary-green" : "bg-white/10 hover:bg-white/20 border border-white/10"
          }`}
        >
          <span className="font-sans font-medium text-[12px] leading-[14px] text-white">
            {selectedFilter}
          </span>
          <FiChevronDown size={14} className={`text-white transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isFilterOpen && (
          <div className="absolute top-[110%] right-2 w-[117px] bg-white/20 border border-[#C0C3C4]/20 rounded-2xl p-1 z-50 backdrop-blur-md shadow-xl flex flex-col gap-1">
            {FILTERS.map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => {
                  setSelectedFilter(filterOption);
                  setIsFilterOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors font-sans font-medium text-[13px] leading-[15px] ${
                  selectedFilter === filterOption 
                    ? "bg-primary-green text-white font-semibold" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 w-full overflow-x-auto custom-scrollbar flex items-start gap-6 pb-6">
        
        {filteredColumns.map((col) => (
          <div 
            key={col.id} 
            className="w-[337px] shrink-0 max-h-full flex flex-col bg-black/20 rounded-[20px] border border-white/5"
          >
            
            {/* Column Header */}
            <div className="flex items-center justify-between p-[14px_19px] border-b-[0.5px] border-white/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-[10px] h-[10px] rounded-full ${col.indicatorColor}`} />
                <div className="flex flex-col gap-1">
                  <h3 className="font-sans font-bold text-[14px] leading-[16px] text-white">
                    {col.title}
                  </h3>
                  <p className="font-sans font-medium text-[12px] leading-[14px] text-white/80">
                    {col.subtitle}
                  </p>
                </div>
              </div>

              {/* Task Count Badge */}
              <div className="w-[20px] h-[20px] rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-sans font-medium text-[10px] text-white">
                  {col.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-[14px] flex flex-col gap-4 min-h-[150px]">
              
              {/* Empty State Condition */}
              {col.tasks.length === 0 ? (
                <div className="w-full h-[120px] rounded-[20px] border-[0.5px] border-dashed border-[#D7D7D7]/50 bg-black/10 flex flex-col items-center justify-center gap-3 mt-2">
                  <div className="w-[30px] h-[30px] rounded-full bg-black/10 border-[0.5px] border-dashed border-[#D7D7D7]/50 flex items-center justify-center relative">
                    <div className="w-[11.25px] h-[11.25px] bg-white/50 border-[0.5px] border-dashed border-[#D7D7D7]/50" />
                  </div>
                  <span className="font-sans font-medium text-[12px] leading-[14px] text-white/50">
                    Drop a task here or create one
                  </span>
                </div>
              ) : (
                col.tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="bg-black/20 border-[0.5px] border-[#D7D7D7]/50 shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] p-[20px_16px] flex flex-col gap-[18px] hover:border-white/40 transition-colors cursor-pointer group"
                  >
                    
                    {/* Priority Badge */}
                    <div className={`self-start flex items-center justify-center px-[10px] py-[5px] gap-1 rounded-[20px] border ${getPriorityStyles(task.priority)}`}>
                      <div className={`w-[6px] h-[6px] rounded-full ${getPriorityDot(task.priority)}`} />
                      <span className="font-sans font-semibold text-[8px] leading-[9px] uppercase tracking-wider">
                        {task.priority}
                      </span>
                    </div>

                    {/* Task Text */}
                    <div className="flex flex-col gap-2">
                      <h4 className="font-sans font-bold text-[16px] leading-[19px] text-white group-hover:text-primary-green transition-colors">
                        {task.title}
                      </h4>
                      <p className="font-sans font-medium text-[12px] leading-[14px] text-white/70">
                        {task.description}
                      </p>
                    </div>

                    {/* Footer (Assignees + Meta) */}
                    <div className="flex items-end justify-between w-full mt-2">
                      <div className="flex items-center -space-x-2.5">
                        {task.assignees.map((avatar, i) => (
                          <div key={i} className="w-[24px] h-[24px] rounded-full border border-primary-green overflow-hidden relative">
                            <Avatar name={`Assignee ${i}`} src={avatar} className="w-full h-full text-[8px]" />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-[4px]">
                          <span className="w-[10px] h-[10px] rounded-sm bg-white/20 inline-block" />
                          <span className="font-sans font-medium text-[12px] text-white">
                            {task.date}
                          </span>
                        </div>
                        <span className="font-sans font-medium text-[12px] text-primary-green/80">
                          {task.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 p-[10px] m-[14px] hover:bg-white/5 transition-colors shrink-0 rounded-lg">
              <FiPlus size={14} className="text-white/50" />
              <span className="font-sans font-medium text-[12px] leading-[14px] text-white/50">
                Add Task
              </span>
            </button>

          </div>
        ))}
      </div>

      {/* Create New Task Modal */}
      <CreateTaskModal 
              isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)} 
              onSubmit={handleCreateTask}
      />
      
    </div>
  );
}
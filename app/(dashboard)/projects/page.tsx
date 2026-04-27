"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button"
import { HiPlus, HiOutlineClock } from "react-icons/hi";
import { PROJECTS_DATA } from "@/lib/mockData";



export default function ProjectsPage() {
  
  const router = useRouter();
  
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8 pt-4 pb-10">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-semibold text-[28px] md:text-[32px] text-foreground leading-tight">
            Projects
          </h1>
          <p className="font-sans font-medium text-[16px] text-foreground/60">
            Manage and track all your active sessions
          </p>
        </div>
        <Button 
                  variant="primary"
                  icon={HiPlus}
                  iconPosition="left"
                  onClick={() => router.push("/projects/new-project")}
                  className="shrink-0 h-[48px] px-6"
                >
                  <span className="font-sans font-semibold text-[16px]">New Project</span>
                </Button>
      </div>

      {/* PROJECTS GRID */}
      <div className="flex flex-col gap-6 w-full">
        {PROJECTS_DATA.map((project) => (
          
          /* Project Card */
          <div 
            key={project.id} 
            className="w-full bg-foreground/10 border border-foreground/10 backdrop-blur-md rounded-[30px] p-6 sm:p-8 flex flex-col gap-6 md:gap-8 hover:bg-foreground/[0.12] transition-colors"
          >
            
            {/* Top Half: Icon, Titles, Status, Collaborators */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              {/* Left: Info */}
              <div className="flex gap-4 sm:gap-6">
                <div className="w-[54px] h-[54px] bg-background/50 rounded-[9px] flex items-center justify-center shrink-0 border border-foreground/10">
                    {/* SVG Audio Lines Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                    <path d="M2 10v3" />
                    <path d="M6 6v11" />
                    <path d="M10 3v18" />
                    <path d="M14 8v7" />
                    <path d="M18 5v13" />
                    <path d="M22 10v3" />
                  </svg>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h2 className="font-sans font-semibold text-[20px] text-foreground leading-tight">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-medium text-[14px] sm:text-[16px] text-foreground/60">
                      {project.subtitle} • {project.tracksProgress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Collaborators & Status Pill */}
              <div className="flex flex-row-reverse md:flex-row items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                
                {/* Collaborator Stack */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {project.collaborators.map((img, i) => (
                      <div key={i} className={`w-[32px] h-[32px] rounded-full border-2 border-primary-green overflow-hidden relative ${i > 0 ? '-ml-3' : ''}`}>
                        <Image src={img} alt="collab" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="font-sans font-medium text-[14px] text-foreground/60 whitespace-nowrap">
                    {project.totalCollab} collaborators
                  </span>
                </div>

                {/* Status Pill */}
                <div className={`px-4 py-1.5 rounded-full flex items-center justify-center ${project.statusBg}`}>
                  <span className={`font-sans font-semibold text-[11px] sm:text-[12px] tracking-wide uppercase ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Half: Progress Bar & Actions */}
            <div className="flex flex-col gap-3">
              
              {/* Progress Header */}
              <div className="flex items-center justify-between">
                <span className="font-sans font-medium text-[14px] text-foreground/60">Progress</span>
                <span className="font-sans font-bold text-[14px] text-foreground">{project.progressPercent}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-[8px] bg-foreground/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${project.progressColor}`}
                  style={{ width: `${project.progressPercent}%` }}
                />
              </div>

              {/* Footer: Time & Action */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <HiOutlineClock className="text-foreground/60" size={16} />
                  <span className="font-sans font-medium text-[12px] sm:text-[13px] text-foreground/60">
                    Updated {project.lastUpdated}
                  </span>
                </div>
                
                <button className="flex items-center gap-2 text-primary-green hover:brightness-110 transition-colors">
                  <span className="font-sans font-semibold text-[13px] sm:text-[14px]">Open Project</span>
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
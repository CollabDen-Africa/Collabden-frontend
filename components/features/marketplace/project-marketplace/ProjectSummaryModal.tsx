"use client";

import React from "react";
import Image from "next/image";
import { HiX, HiLightningBolt, HiShieldCheck, HiOutlineClock, HiOutlineUserGroup, HiOutlineCurrencyDollar } from "react-icons/hi";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

interface Project {
  id: string;
  title: string;
  description: string;
  genres: string[];
  roles: string[];
  compensation: string;
  duration: string;
  deadline: string;
  applicants: number;
  authorName: string;
  authorInitials: string;
  postedAt: string;
  isUrgent?: boolean;
  isEscrowProtected?: boolean;
  openRolesCount: number;
  image: string;
  isOwner?: boolean;
}

interface ProjectSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (project: Project) => void;
  project: Project | null;
}

export function ProjectSummaryModal({ isOpen, onClose, onApply, project }: ProjectSummaryModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="flex flex-col w-full max-w-2xl bg-[#141414] border border-border-muted/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh]">
        
        {/* Header Section */}
        <div className="relative w-full bg-black/40 border-b border-border-muted/30 p-6 sm:p-8">
          {project.image && (
            <div className="absolute inset-0 z-0 opacity-20">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-[#141414] z-0" />

          <div className="relative z-10 flex justify-between items-start gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-primary-green uppercase tracking-wider bg-primary-green/10 border border-primary-green/30 px-2.5 py-1 rounded-full">
                  Public Project
                </span>
                {project.genres?.map((genre) => (
                  <span key={genre} className="text-xs font-medium text-text-muted bg-white/10 px-2.5 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
                {project.isUrgent && (
                  <span className="text-xs font-medium text-accent-yellow bg-[#2A1E08]/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <HiLightningBolt className="w-3 h-3" /> Urgent
                  </span>
                )}
                {project.isEscrowProtected && (
                  <span className="text-xs font-medium text-primary-green bg-primary-green/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <HiShieldCheck className="w-3 h-3" /> Escrow Protected
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mt-1">{project.title}</h2>

              {/* Author & Date */}
              <div className="flex items-center gap-2.5 mt-2">
                <Avatar name={project.authorName} className="w-7 h-7 bg-accent-blue text-xs font-bold" />
                <span className="text-sm font-medium text-text-muted">{project.authorName}</span>
                <span className="text-xs text-white/30">• Posted {project.postedAt}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
            >
              <HiX size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body Section */}
        <div className="flex flex-col p-6 sm:p-8 gap-6 overflow-y-auto">
          
          {/* Overview Summary Box */}
          <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Project Overview</h3>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Roles Needed */}
          {project.roles && project.roles.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Roles Needed</h3>
              <div className="flex flex-wrap gap-2">
                {project.roles.map((role) => (
                  <div key={role} className="bg-primary-blue/20 border border-primary-blue/40 text-accent-soft-blue text-xs font-semibold px-3 py-1.5 rounded-lg">
                    {role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Metrics / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                <HiOutlineCurrencyDollar size={14} /> Compensation
              </span>
              <span className="text-sm font-bold text-white mt-1.5">{project.compensation}</span>
            </div>

            <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                <HiOutlineClock size={14} /> Duration
              </span>
              <span className="text-sm font-bold text-white mt-1.5">{project.duration}</span>
            </div>

            <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                <HiOutlineClock size={14} /> Deadline
              </span>
              <span className="text-sm font-bold text-white mt-1.5">{project.deadline}</span>
            </div>

            <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                <HiOutlineUserGroup size={14} /> Applicants
              </span>
              <span className="text-sm font-bold text-white mt-1.5">{project.applicants} pitched</span>
            </div>
          </div>

          {/* Creator & Team Overview */}
          <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Project Lead</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={project.authorName} className="w-10 h-10 bg-accent-blue text-sm font-bold" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{project.authorName}</span>
                  <span className="text-xs text-white/50">Project Owner & Creator</span>
                </div>
              </div>
              <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full border border-white/10">
                Accepting Collaborators
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border-muted/30 bg-black/20">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white/70 hover:text-white border border-white/10 rounded-full px-6 py-2.5 text-sm"
          >
            Close
          </Button>
          <Button
            onClick={() => onApply(project)}
            className="bg-primary-green hover:bg-primary-green/90 text-white font-bold rounded-full px-8 py-2.5 text-sm transition-all shadow-lg"
          >
            Apply to Collaborate
          </Button>
        </div>

      </div>
    </div>
  );
}

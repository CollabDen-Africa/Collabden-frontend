import React from 'react';
import Link from 'next/link';
import ProjectCard, { ProjectCollaborator } from './ProjectCard';

export interface ActiveProject {
  id: number;
  title: string;
  genre: string;
  tracks: string;
  collaborators: ProjectCollaborator[];
  progress: number;
  updated: string;
  status?: string;
}

const ACTIVE_PROJECTS: ActiveProject[] = [
  { 
    id: 1, 
    title: "Summer Vibes EP", 
    genre: "Electronic", 
    tracks: "4 tracks in progress", 
    collaborators: [
      { name: "David Chen", avatarUrl: "/mock-profiles/small2.png" },
      { name: "Sarah James", avatarUrl: "/mock-profiles/small3.png" }, 
      { name: "Michael Awe", avatarUrl: "/mock-profiles/small4.png" }
    ], 
    progress: 70, 
    updated: "3 hours ago",
    status: "Active"
  },
  { 
    id: 2, 
    title: "Urban Beats Vol.2", 
    genre: "Hip-Hop", 
    tracks: "6 tracks in progress", 
    collaborators: [
      { name: "Tayo Oni", avatarUrl: "/mock-profiles/small5.png" }, { name: "Lizz Torres", avatarUrl: "/mock-profiles/small4.png" }, { name: "Emma Wilson", avatarUrl: "/avatar.svg" }, { name: "John Ike", avatarUrl: "/mock-profiles/small2.png" }
    ], 
    progress: 40, 
    updated: "5 hours ago",
    status: "In Review"
  },
  { 
    id: 3, 
    title: "Acoustic Sessions", 
    genre: "Folk", 
    tracks: "2 tracks in progress", 
    collaborators: [
      { name: "Chris Morgan", avatarUrl: "/mock-profiles/small4.png" }, { name: "Sam Martin", avatarUrl: "/mock-profiles/small2.png" }
    ], 
    progress: 90, 
    updated: "6 hours ago",
   status: "Active" 
  },
];

export default function ActiveProjectsPanel() {
  return (
    <section className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="font-bold text-[25px] leading-[29px] text-black">Active Projects</h2>
        <Link href="/projects" className="font-medium text-[16px] leading-[19px] text-primary-green hover:underline">
          View all
        </Link>
      </div>
      
      {/* List Wrapper */}
      <div className="flex flex-col gap-4 w-full">
        {ACTIVE_PROJECTS.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}
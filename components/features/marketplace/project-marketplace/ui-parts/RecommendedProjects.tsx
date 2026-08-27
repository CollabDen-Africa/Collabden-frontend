"use client";

import React from 'react';
import { ProjectGridCard } from './ProjectGridCard';


const RECOMMENDED_PROJECTS = [
  {
    id: 'rec-1',
    title: 'Neon Soul — R&B Album Production',
    description: 'Crafting a 12-track R&B album blending neo-soul with modern electronic elements.',
    genres: ['R&B', 'Neo-Soul'],
    roles: ['Vocalist', 'Session Guitar', 'Mixing Engineer'],
    compensation: '$2,400–$3,800',
    duration: '4 months',
    deadline: 'Aug 30, 2026',
    applicants: 18,
    authorName: 'Marcus Webb',
    authorInitials: 'MW',
    postedAt: '2 days ago',
    isUrgent: false,
    openRolesCount: 4,
    isEscrowProtected: true,
    image: '/Neon-Soul.png',
  },
  {
    id: 'rec-2',
    title: 'Parallax — Electronic Concept EP',
    description: 'An experimental electronic EP exploring spatial soundscapes.',
    genres: ['Electronic', 'Experimental'],
    roles: ['Sound Designer', 'Mastering Engineer'],
    compensation: '$1,200–$2,000',
    duration: '2 months',
    deadline: 'Sep 15, 2026',
    applicants: 11,
    authorName: 'Zara Osei',
    authorInitials: 'ZO',
    postedAt: '1 week ago',
    isUrgent: false,
    openRolesCount: 2,
    isEscrowProtected: true,
    image: '/Electronic.png',
  },
  {
    id: 'rec-3',
    title: 'Folklore Roots — Folk Documentary Score',
    description: 'Original score for a 45-minute documentary on folk traditions.',
    genres: ['Folk', 'Cinematic'],
    roles: ['Composer', 'Traditional Instrumentalist', 'Music Editor'],
    compensation: 'Rev Share',
    duration: '6 months',
    deadline: 'Oct 1, 2026',
    applicants: 7,
    authorName: 'Priya Nair',
    authorInitials: 'PN',
    postedAt: '3 days ago',
    isUrgent: true,
    openRolesCount: 3,
    isEscrowProtected: false,
    image: '/Folklore.png',
  },
  {
    id: 'rec-4', 
    title: 'Folklore Roots — Folk Documentary Score',
    description: 'Original score for a 45-minute documentary on folk traditions.',
    genres: ['Folk', 'Cinematic'],
    roles: ['Composer', 'Traditional Instrumentalist', 'Music Editor'],
    compensation: 'Rev Share',
    duration: '6 months',
    deadline: 'Oct 1, 2026',
    applicants: 7,
    authorName: 'Priya Nair',
    authorInitials: 'PN',
    postedAt: '3 days ago',
    isUrgent: true,
    openRolesCount: 3,
    isEscrowProtected: false,
    image: '/Folklore.png',
  }
];

export function ProjectsYouMayLike({ onApply }: { onApply?: (project: any) => void }) {
  return (
    <div className="flex flex-col items-start pt-12 w-full">
      
      {/* Header Row */}
      <div className="flex flex-row items-center gap-[9.38px] w-full h-full my-4">
        {/* Green Accent Pill */}
        <div className="w-[2.77px] h-[18.73px] bg-primary-green rounded-full shrink-0" />
        
        {/* Title */}
        <h2 className="text-[15px] font-bold text-white whitespace-nowrap">
          Projects You May Like
        </h2>
        
        {/* Subtitle */}
        <span className="text-[11.25px] font-normal text-text-muted whitespace-nowrap">
          Based on your profile
        </span>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {RECOMMENDED_PROJECTS.map((project) => (
          <ProjectGridCard 
            key={project.id} 
            project={project} 
            onApply={() => onApply && onApply(project)} 
          />
        ))}
      </div>
      
    </div>
  );
}
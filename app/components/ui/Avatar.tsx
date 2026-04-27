import React from 'react';
import Image from 'next/image';

export interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string; 
}

// Generates a consistent background color string based on the user's name
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-primary-blue',
    'bg-primary-green',
    'bg-accent-pink',
    'bg-accent-red',
    'bg-accent-yellow',
    'bg-accent-green-success',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Extract up to 2 initials from the name
const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function Avatar({ name, src, className = "w-10 h-10" }: AvatarProps) {
  // If a valid image URL is provided, render the image
  if (src) {
    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 bg-card-bg ${className}`}>
        <Image src={src} alt={`${name}'s profile picture`} fill className="object-cover" sizes="100px" />
      </div>
    );
  }

  // Fallback: Render the colored initials
  const bgColor = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div 
      className={`flex items-center justify-center rounded-full text-primary-white font-bold shrink-0 ${bgColor} ${className}`}
      title={name}
    >
      <span className="opacity-95">{initials}</span>
    </div>
  );
}
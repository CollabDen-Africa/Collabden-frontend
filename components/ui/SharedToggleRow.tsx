import React from 'react';
import Toggle from './Toggle';

interface SharedToggleRowProps {
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  isLast?: boolean;
}

export function SharedToggleRow({ title, description, isActive, onToggle, isLast }: SharedToggleRowProps) {
  return (
    <div className={`flex items-center justify-between py-3 w-full ${!isLast ? 'border-b border-white/10' : ''}`}>
      <div className="flex flex-col pr-4">
        <span className="font-['Raleway'] font-semibold text-[13px] text-white">{title}</span>
        <span className="text-[11px] text-white/45 mt-0.5">{description}</span>
      </div>
      <Toggle active={isActive} onChange={onToggle} />
    </div>
  );
}
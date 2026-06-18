import React from 'react';
import { 
  FaHandshake, 
  FaCheck, 
  FaUserPlus, 
  FaMessage, 
  FaBell 
} from 'react-icons/fa6';
import type { NotificationType } from '@/types/api.types';

//Data structure — matches backend Notification schema
export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
  onMarkRead?: (id: string) => void;
}

// Map backend notification types to icons
const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  'MESSAGE': FaMessage,
  'INVITE': FaUserPlus,
  'PROJECT_CREATED': FaCheck,
  'TASK_ASSIGNED': FaHandshake,
  'SYSTEM': FaBell,
};

// Format ISO timestamp to relative time (e.g. "2 hours ago")
const formatRelativeTime = (isoDate: string): string => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export default function NotificationItem({ 
  id, title, message, type, isRead, link, createdAt, onMarkRead 
}: NotificationItemProps) {
  const IconComponent = TYPE_ICONS[type] || FaBell;

  const handleClick = () => {
    if (!isRead && onMarkRead) {
      onMarkRead(id);
    }
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`${isRead ? 'bg-white/5' : 'bg-white/10 border-primary-green/20'} hover:bg-white/15 transition-colors cursor-pointer rounded-[20px] px-[16px] py-[12px] flex items-start gap-[12px] w-full border border-white/5`}
    >
      
      {/* Activity Icon Badge */}
      <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 ${isRead ? 'bg-black/50' : 'bg-primary-green/20'}`}>
        <IconComponent className={`w-[12px] h-[12px] ${isRead ? 'text-foreground' : 'text-primary-green'}`} />
      </div>
      
      {/* Notification Content */}
      <div className="flex flex-col gap-[8px] flex-1 min-w-0">
        <div className="flex flex-col gap-[2px]">
          <span className={`font-sans text-[14px] leading-[17px] ${isRead ? 'font-medium text-foreground/70' : 'font-bold text-foreground'}`}>
            {title}
          </span>
          <span className="font-sans font-normal text-[14px] leading-[17px] text-foreground/60 wrap-break-word">
            {message}
          </span>
        </div>
        
        {/* Timestamp */}
        <div className="flex items-center gap-[8px]">
          <span className="font-medium text-[12px] leading-[14px] text-foreground/40 font-sans">
            {formatRelativeTime(createdAt)}
          </span>
          {!isRead && (
            <div className="w-[6px] h-[6px] rounded-full bg-primary-green" />
          )}
        </div>
        
      </div>
    </div>
  );
}
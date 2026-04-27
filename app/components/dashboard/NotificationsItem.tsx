import React from 'react';
import { 
  FaHandshake, 
  FaCheck, 
  FaUserPlus, 
  FaMessage, 
  FaBell 
} from 'react-icons/fa6';

//Data structure
export interface NotificationItemProps {
  user?: string;
  action: string;
  target?: string;
  time: string;
  type?: string; 
  icon?: React.ElementType;
}

// Message icons
const getIconForType = (type?: string, FallbackIcon?: React.ElementType) => {
  if (FallbackIcon) return FallbackIcon;
  switch (type) {
    case 'message': return FaMessage;
    case 'check': return FaCheck;
    case 'userPlus': return FaUserPlus;
    case 'handshake': return FaHandshake;
    default: return FaBell;
  }
};

export default function NotificationItem({ user, action, target, time, type, icon }: NotificationItemProps) {
  const Icon = getIconForType(type, icon);

  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors cursor-pointer rounded-[20px] px-[16px] py-[12px] flex items-start gap-[12px] w-full border border-white/5">
      
      {/* Activity Icon Badge */}
      <div className="w-[32px] h-[32px] rounded-full bg-black/50 flex items-center justify-center shrink-0">
        <Icon className="text-foreground w-[12px] h-[12px]" />
      </div>
      
      {/* Notification Content */}
      <div className="flex flex-col gap-[8px] flex-1 min-w-0">
        <div className="text-[16px] leading-[19px] break-words font-sans">
          {user && <span className="font-bold text-foreground">{user} </span>}
          
          <span className={`${user ? "font-normal" : "font-semibold"} text-foreground`}>
            {action}
          </span>
          {target && <span className="font-medium text-foreground/60"> {target}</span>}
        </div>
        
        {/* Timestamp */}
        <span className="font-medium text-[12px] leading-[14px] text-foreground/40 font-sans">
          {time}
        </span>
        
      </div>
    </div>
  );
}
import React from 'react';

// 1. Strict Interface Definition
export interface NotificationItemProps {
  user?: string;
  action: string;
  target?: string;
  time: string;
  iconWrapperClass: string; 
  icon: React.ElementType;
}

export default function NotificationItem({ 
  user, 
  action, 
  target, 
  time, 
  iconWrapperClass,
  icon: Icon 
}: NotificationItemProps) {
  return (
    <div className="flex gap-3 items-start">
      
      {/* Activity Icon Badge */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconWrapperClass}`}
            >
              <Icon className="w-4 h-4 stroke-[2.5] fill-current" />
            </div>
      
      {/* Notification Content */}
      <div className="flex flex-col mt-0.5">
        <p className="text-[16px] leading-tight text-text-main">
          {user && <span className="font-bold">{user} </span>}
                    <span>{action}</span>
                    {target && <span className="text-black/60 font-medium"> {target}</span>}
                  </p>
        
        {/* Timestamp */}
        <span className="text-black/40 text-[12px] font-medium mt-1">
          {time}
        </span>
      </div>
      
    </div>
  );
}
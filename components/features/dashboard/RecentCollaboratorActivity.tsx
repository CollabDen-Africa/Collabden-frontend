import React from 'react';
import Avatar from '@/components/ui/Avatar';

//Activity Item structure
export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  time: string;
  avatarUrl?: string;
}


export default function RecentCollaboratorActivityPanel({ activities = [] }: { activities?: ActivityItem[] }) {
  return (
    <section className="w-full flex flex-col gap-8 bg-black/10 rounded-[30px] p-7 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
      <h2 className="font-semibold text-[18px] leading-5.25 text-foreground">
        Recent Collaborator Activity
      </h2>
      
      <div className="flex flex-col gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between w-full">
            {/* Avatar + Info */}
            <div className="flex items-center gap-3">
              <Avatar 
                name={activity.user} 
                src={activity.avatarUrl} 
                className="w-13.75 h-13.75 text-[18px] shrink-0" 
              />
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-[16px] leading-4.75 text-foreground">
                  {activity.user}
                </h4>
                <p className="font-medium text-[14px] leading-4 text-foreground/60">
                  {activity.action}
                </p>
              </div>
            </div>

            {/* Timestamp */}
            <span className="font-medium text-[14px] leading-4 text-foreground/60 shrink-0">
              {activity.time}
            </span>
            
          </div>
        ))}
        
        {/* Empty Array */}
        {activities.length === 0 && (
          <p className="text-foreground/40 text-sm text-center italic py-4">
            No recent activity to show.
          </p>
        )}
      </div>
      
    </section>
  );
}
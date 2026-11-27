import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';

//Activity Item structure
export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  avatarUrl?: string;
}

interface Props {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

export default function RecentCollaboratorActivityPanel({ activities = [], isLoading = false }: Props) {
  return (
    <section className="w-full flex flex-col gap-8 bg-black/10 rounded-[30px] p-7 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
      <h2 className="font-semibold text-[18px] leading-5.25 text-foreground">
        Recent Collaborator Activity
      </h2>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Skeleton className="w-13.75 h-13.75 rounded-full shrink-0" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
          ))
        ) : (
          <>
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
          </>
        )}
      </div>

    </section>
  );
}

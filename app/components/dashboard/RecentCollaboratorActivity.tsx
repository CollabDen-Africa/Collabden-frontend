import React from 'react';
import Image from 'next/image';
import Avatar from '../ui/Avatar';

export interface ActivityItem {
  id: number;
  name: string;
  action: string;
  time: string;
  avatarUrl?: string;
}

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 1, name: "Michael Awe", action: "Uploaded new track", time: "2h", avatarUrl: "/mock-profiles/Matt.png" },
  { id: 2, name: "Tayo Oni", action: "Completed mastering", time: "4h", avatarUrl: "/mock-profiles/Tayo.png" },
  { id: 3, name: "Sam Martin", action: "Added vocals", time: "6h", avatarUrl: "/mock-profiles/Sam.png" },
  { id: 4, name: "Chris Morgan", action: "Shared feedback", time: "6h", avatarUrl: "/mock-profiles/Chris.png" },
];

export default function RecentCollaboratorActivityPanel() {
  return (
    <section className="border border-gray-300 rounded-[30px] p-8 flex flex-col gap-8 bg-white">
      <h2 className="font-bold text-[20px] text-black">Recent Collaborator Activity</h2>
      
      <div className="flex flex-col gap-6">
        {RECENT_ACTIVITY.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            
            {/* Left Side: Avatar + Info */}
            <div className="flex gap-4 items-center">
              <Avatar name={item.name} src={item.avatarUrl} className="w-[55px] h-[55px] text-[18px]" />
              
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-[16px] text-black">{item.name}</h4>
                <p className="font-medium text-[14px] text-black/60">{item.action}</p>
              </div>
            </div>

            {/* Right Side: Timestamp */}
            <span className="font-medium text-[14px] text-black/60">{item.time}</span>
            
          </div>
        ))}
      </div>
    </section>
  );
}
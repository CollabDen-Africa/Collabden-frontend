import React from 'react';
import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import Avatar from '../ui/Avatar';
import { HiStar } from "react-icons/hi2";

export default function CollaboratorItem({ name, role, members, rating, avatarUrl }: any) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Avatar name={name} src={avatarUrl} className="w-[55px] h-[55px] text-[18px]" />
        
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-[16px] text-black">{name}</h4>
          <div className="flex items-center gap-2 text-[14px] text-black/60 font-medium">
            {role} <span className="w-1.5 h-1.5 bg-black/60 rounded-full" /> {members} members
          </div>
          <div className="flex items-center gap-1 mt-1">
             {[...Array(5)].map((_, i) => <HiStar key={i} className="w-3 h-3 text-black" />)}
             <span className="text-[12px] text-black/60 font-medium ml-1">{rating}</span>
          </div>
        </div>
      </div>
      <Button variant="primary" size="sm" className="rounded-full">
        Connect
      </Button>
    </div>
  );
}
import React from 'react';
import { LuHeadphones } from "react-icons/lu";

export default function SuggestedProjectItem({ title, needs, members, tags }: any) {
  return (
    <div className=" justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center shrink-0">
           <LuHeadphones className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-[16px] text-black">{title}</h4>
          <div className="flex items-center gap-2 text-[14px] text-black/60 font-medium mt-1">
            {needs} <span className="w-1.5 h-1.5 bg-black/60 rounded-full" /> {members} members
          </div>
          <div className="flex gap-3 mt-2">
            {tags.map((tag: string) => (
              <span key={tag} className="bg-gray-200 text-text-main px-4 py-1 rounded-full text-[10px] font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
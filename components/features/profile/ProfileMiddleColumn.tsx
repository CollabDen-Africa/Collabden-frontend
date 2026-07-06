"use client";
import { useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import { PORTFOLIO_ITEMS } from "@/lib/mockData";

export default function ProfileMiddleColumn() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      
      {/* About Section */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col relative backdrop-blur-md">
        <h2 className="font-raleway font-bold text-[18px] text-white mb-4">About</h2>
        <p className="font-raleway font-normal text-[14px] text-white/70 leading-5.75 flex-1">
         Award-winning Product Designer and Creative Strategist with 7+ years of experience crafting intuitive, human-centered digital experiences. I bridge the gap between product strategy and visual design, helping founders, agencies, and creators transform complex ideas into elegant, scalable products.  between product strategy and visual design, helping founders, agencies, and creators transform complex ideas into elegant, scalable products.
        </p>
        <div className="flex flex-row items-center gap-4 mt-4">
          <div className="flex-1 bg-white/5 rounded-[14px] p-4 flex flex-col justify-center">
            <span className="font-raleway font-normal text-[12px] text-white/40">Years of Experience</span>
            <span className="font-raleway font-bold text-[20px] text-white mt-1">7+</span>
          </div>
          <div className="flex-1 bg-white/5 rounded-[14px] p-4 flex flex-col justify-center">
            <span className="font-raleway font-normal text-[12px] text-white/40">Creative Philosophy</span>
            <span className="font-raleway font-medium text-[13px] text-white/80 leading-5 mt-1">
              &quot;Design is the silent ambassador of your brand.&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col backdrop-blur-md">
        
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-raleway font-bold text-[18px] text-white">Portfolio</h2>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-[14px]">
            
            {/* Grid Toggle Button */}
            <button 
              onClick={() => setViewMode('grid')}
              className={`rounded-[10px] w-7.75 h-7.75 flex items-center justify-center transition-all ${
                viewMode === 'grid' 
                  ? 'bg-primary-green/20 text-primary-green border border-primary-green' 
                  : 'text-white/40 hover:text-white border border-transparent'
              }`}
            >
              <FiGrid size={15} />
            </button>
            
            {/* List Toggle Button */}
            <button 
              onClick={() => setViewMode('list')}
              className={`rounded-[10px] w-7.75 h-7.75 flex items-center justify-center transition-all ${
                viewMode === 'list' 
                  ? 'bg-primary-green/20 text-primary-green border border-primary-green' 
                  : 'text-white/40 hover:text-white border border-transparent'
              }`}
            >
              <FiList size={15} />
            </button>

          </div>
        </div>

        {/* --- GRID VIEW LAYOUT --- */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
            {PORTFOLIO_ITEMS.map((item) => (
              <div key={item.id} className="h-45 border border-white/10 rounded-[14px] relative overflow-hidden group cursor-pointer">
                
                <div className="absolute inset-0 bg-zinc-800 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
                
                <div className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-[30px] shadow-sm z-20 ${item.isCompleted ? 'bg-primary-green' : 'bg-primary-blue'}`}>
                  <span className="font-raleway font-semibold text-[10px] text-white tracking-wide">
                    {item.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 flex flex-col z-20">
                  <span className="font-raleway font-bold text-[14px] text-white leading-5.25 wrap-break-word">
                    {item.title}
                  </span>
                  <span className="font-raleway font-normal text-[12px] text-white/60 leading-4.5 mt-1">
                    {item.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- LIST VIEW LAYOUT --- */}
        {viewMode === 'list' && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            {PORTFOLIO_ITEMS.map((item) => (
              <div key={item.id} className="flex flex-row items-center gap-4 p-2.5 border border-white/10 rounded-[14px] bg-black/20 hover:bg-white/5 transition-all cursor-pointer group">
                
                {/* Horizontal Image */}
                <div 
                  className="w-27.5 h-18.75 rounded-[10px] bg-zinc-800 bg-cover bg-center shrink-0 border border-white/5" 
                  style={{ backgroundImage: `url(${item.image})` }} 
                />
                
                {/* Text Content */}
                <div className="flex flex-col flex-1 justify-center min-w-0">
                  <span className="font-raleway font-bold text-[15px] text-white truncate">
                    {item.title}
                  </span>
                  <span className="font-raleway font-normal text-[13px] text-white/60 mt-1 truncate">
                    {item.role}
                  </span>
                </div>
                
                {/* Status Pill */}
                <div className={`px-3 py-1 rounded-[30px] shadow-sm shrink-0 mr-1.5 ${item.isCompleted ? 'bg-primary-green/10 text-primary-green border border-primary-green/20' : 'bg-primary-blue/20 text-secondary-blue border border-primary-blue/30'}`}>
                  <span className="font-raleway font-bold text-[10px] tracking-wide ">
                    {item.status}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
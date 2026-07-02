"use client";
import { FiActivity } from "react-icons/fi";
import { PORTFOLIO_ITEMS } from "@/lib/mockData";

export default function ProfileMiddleColumn() {
  return (
    <div className="flex flex-col gap-[24px] w-full h-full">
      {/* About Section */}
      <div className="w-full h-[351px] bg-white/5 border border-white/10 rounded-[35px] p-[24px] flex flex-col relative backdrop-blur-md">
        <h2 className="font-bold text-[18px] text-white mb-[16px]">About</h2>
        <p className="font-normal text-[14px] text-white/70 leading-[23px] flex-1">
          Award-winning Product Designer and Creative Strategist with a deep passion for blending technology and music. Currently focused on building intuitive digital workspaces for creators. I believe that seamless design can heavily influence how artists collaborate across continents.
        </p>
        <div className="flex flex-row items-center gap-[16px] mt-auto">
          <div className="flex-1 bg-white/5 rounded-[14px] p-[16px] flex flex-col justify-center">
            <span className="font-normal text-[12px] text-white/40">Years of Experience</span>
            <span className="font-bold text-[20px] text-white mt-[4px]">7+</span>
          </div>
          <div className="flex-1 bg-white/5 rounded-[14px] p-[16px] flex flex-col justify-center">
            <span className="font-normal text-[12px] text-white/40">Creative Philosophy</span>
            <span className="font-medium text-[13px] text-white/80 leading-[20px] mt-[4px]">
              &quot;Design is the silent ambassador of your brand.&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="w-full h-[449px] bg-white/5 border border-white/10 rounded-[35px] p-[24px] flex flex-col backdrop-blur-md">
        <div className="flex justify-between items-center mb-[20px]">
          <h2 className="font-bold text-[18px] text-white">Portfolio</h2>
          <div className="flex gap-[8px] bg-white/5 rounded-[14px] p-[4px]">
            <button className="bg-primary-green/20 border-[1.25px] border-primary-green rounded-[10px] w-[31px] h-[31px] flex items-center justify-center text-primary-green"><FiActivity size={14} /></button>
            <button className="border-[1.25px] border-white/40 rounded-[10px] w-[31px] h-[31px] flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-colors"><FiActivity size={14} /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[16px]">
          {PORTFOLIO_ITEMS.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-[14px] p-[1px] flex flex-col group cursor-pointer hover:border-white/20 transition-all">
              <div className="w-full h-[100px] rounded-t-[13px] relative overflow-hidden bg-black/40">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute right-[8px] top-[8px] px-[10px] py-[2px] rounded-[30px] shadow-sm z-20" style={{ backgroundColor: item.isCompleted ? '#73BF44' : '#204F99' }}>
                  <span className="font-semibold text-[10px] text-white">{item.status}</span>
                </div>
              </div>
              <div className="p-[12px] flex flex-col">
                <span className="font-bold text-[14px] text-white truncate">{item.title}</span>
                <span className="font-normal text-[11px] text-white/60 mt-[2px] truncate">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
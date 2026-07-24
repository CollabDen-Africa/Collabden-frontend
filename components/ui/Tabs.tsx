import React from "react";

export interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="px-6 md:px-8 border-b border-white/5 flex gap-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`py-4 text-sm font-medium border-b-2 transition-colors relative ${
            activeTab === tab
              ? "text-[#72c043] border-[#72c043]"
              : "text-white/40 border-transparent hover:text-white/80"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

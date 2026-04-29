"use client";

import React from "react";
import { HiOutlineCloudUpload, HiOutlineDocumentText } from "react-icons/hi";

// Mock data for the file list
const MOCK_FILES = [
  { name: "beat_v3.wav", size: "245mb", date: "Apr 20, 2026", version: "V3" },
  { name: "lyrics_draft.docx", size: "8.6mb", date: "Apr 12, 2026", version: "V1" },
  { name: "vocals_rough.mp3", size: "78mb", date: "Apr 02, 2026", version: "V2" },
  { name: "cover_art.png", size: "544kb", date: "Mar 26, 2026", version: "V1" },
];

export default function WorkspaceFilesPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full">
      
      {/* Upload Area (Drag and Drop) */}
      <section className="w-full bg-black/10 border border-dashed border-[#D9D9D9]/60 rounded-[30px] flex flex-col items-center justify-center p-8 md:p-[70px_32px] gap-4 cursor-pointer hover:bg-black/20 transition-colors">
        <HiOutlineCloudUpload className="text-white/60" size={32} />
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-sans font-medium text-[16px] leading-[19px] text-white/60">
            Drag and drop files here, or click to browse
          </span>
          <span className="font-sans font-medium text-[14px] leading-[16px] text-white/60">
            WAV, MP3, FLAC, MIDI, PDF up to 100MB
          </span>
        </div>
      </section>

      {/* File List Table */}
      <section className="w-full bg-black/10 rounded-[30px] p-6 lg:p-[40px_32px] flex flex-col gap-6 overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 w-full border-b border-white/5 pb-4">
          <div className="col-span-5 lg:col-span-6">
            <span className="font-sans font-medium text-[18px] text-white">Name</span>
          </div>
          <div className="col-span-2">
            <span className="font-sans font-medium text-[18px] text-white">Size</span>
          </div>
          <div className="col-span-3 lg:col-span-2">
            <span className="font-sans font-normal text-[18px] text-white">Date</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="font-sans font-normal text-[18px] text-white">Version</span>
          </div>
        </div>

        {/* File Rows */}
        <div className="flex flex-col gap-4 md:gap-6">
          {MOCK_FILES.map((file, idx) => (
            <div 
              key={idx} 
              className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 w-full items-start md:items-center py-2 md:py-0 border-b border-white/5 md:border-0 last:border-0 pb-4 md:pb-0"
            >
              
              {/* Name & Icon */}
              <div className="col-span-5 lg:col-span-6 flex items-center gap-3">
                <HiOutlineDocumentText className="text-primary-green shrink-0" size={20} />
                <span className="font-sans font-semibold text-[16px] leading-[19px] text-white truncate">
                  {file.name}
                </span>
              </div>

              {/* Size */}
              <div className="col-span-2 flex items-center">
                <span className="font-sans font-semibold text-[14px] text-white/60">
                  {file.size}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-3 lg:col-span-2 flex items-center">
                <span className="font-sans font-semibold text-[14px] text-white/60">
                  {file.date}
                </span>
              </div>

              {/* Version Pill */}
              <div className="col-span-2 flex items-center md:justify-end mt-2 md:mt-0">
                <div className="flex items-center justify-center px-4 py-1 bg-white/20 rounded-[20px]">
                  <span className="font-sans font-semibold text-[14px] text-white/60">
                    {file.version}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
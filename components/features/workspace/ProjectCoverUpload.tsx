"use client";

import React, { useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { useProjects } from "@/hooks/projects/useProjects";
import { getErrorMessage } from "@/lib/error-handler";
import Image from "next/image";

interface ProjectCoverUploadProps {
  projectId: string;
  currentCoverUrl?: string | null;
}

export function ProjectCoverUpload({ projectId, currentCoverUrl }: ProjectCoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { useUploadProjectCover } = useProjects();
  const uploadCover = useUploadProjectCover(projectId);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    
    // Remember: Add local file validation here (e.g., size < 5MB, type is image)
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setError(null);
    try {
      await uploadCover.mutateAsync(file);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <h3 className="font-sans font-medium text-[18px] text-white">Project Cover Image</h3>
      
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleUpload(e.dataTransfer.files[0]);
        }}
        className={`relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group ${
          isDragging ? "border-primary-green bg-primary-green/10" : "border-[#D9D9D9]/60 hover:bg-black/20 hover:border-primary-green"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />

        {currentCoverUrl && !uploadCover.isPending ? (
          <>
            <Image 
              src={currentCoverUrl} 
              alt="Project Cover" 
              fill
              className="object-cover opacity-80 group-hover:opacity-40 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <HiOutlinePhotograph className="text-white mb-2" size={32} />
              <span className="text-white font-medium">Click or drag to replace cover</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center z-10 px-4">
            <HiOutlinePhotograph className="text-white/60 mb-2" size={32} />
            <span className="font-sans font-medium text-[16px] text-white/60">
              {uploadCover.isPending ? "Uploading..." : "Drag and drop an image, or click to browse"}
            </span>
            <span className="font-sans text-[14px] text-white/40">16:9 aspect ratio recommended</span>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
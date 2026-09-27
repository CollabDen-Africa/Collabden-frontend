"use client";

import React, { useEffect, useRef, useState } from "react";
import { HiCheck, HiOutlineCloudUpload, HiOutlineDocumentText } from "react-icons/hi";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useProjects } from "@/hooks/projects/useProjects";
import { getErrorMessage } from "@/lib/error-handler";

const formatFileSize = (bytes?: number | null) => {
  if (bytes === null || bytes === undefined || bytes < 0) return "—";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  return `${value >= 10 || unitIndex === 0 ? Math.round(value) : value.toFixed(1)} ${units[unitIndex]}`;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function WorkspaceFilesPage() {
  const { projectDetails, activeProject, isLoading } = useWorkspace();
  const files = projectDetails?.files || activeProject?.files || [];
  const projectId = projectDetails?.id || activeProject?.id || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const { useUploadProjectFile } = useProjects();
  const uploadFile = useUploadProjectFile(projectId);

  useEffect(() => {
    if (!uploadSuccess) return;
    const timeout = window.setTimeout(() => setUploadSuccess(null), 4_000);
    return () => window.clearTimeout(timeout);
  }, [uploadSuccess]);

  const uploadFiles = async (fileList: FileList | File[]) => {
    const selectedFiles = Array.from(fileList);
    if (!projectId || selectedFiles.length === 0) return;

    setUploadError(null);
    setUploadSuccess(null);
    setUploadingCount(selectedFiles.length);
    try {
      await Promise.all(selectedFiles.map((file) => uploadFile.mutateAsync(file)));
      setUploadSuccess(
        `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} uploaded successfully.`,
      );
    } catch (error) {
      setUploadError(getErrorMessage(error));
    } finally {
      setUploadingCount(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full">
      
      {/* Upload Area (Drag and Drop) */}
      <section
        role="button"
        tabIndex={0}
        aria-label="Upload project files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void uploadFiles(event.dataTransfer.files);
        }}
        className={`w-full bg-black/10 border border-dashed rounded-[30px] flex flex-col items-center justify-center p-8 md:p-[70px_32px] gap-4 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green ${isDragging ? "border-primary-green bg-primary-green/10" : "border-[#D9D9D9]/60 hover:bg-black/20 hover:border-primary-green"}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="audio/wav,audio/x-wav,audio/mpeg,audio/flac,audio/x-flac,audio/midi,audio/x-midi,application/pdf"
          className="hidden"
          onChange={(event) => void uploadFiles(event.target.files || [])}
        />
        <HiOutlineCloudUpload className="text-white/60" size={32} />
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-sans font-medium text-[16px] leading-[19px] text-white/60">
            {uploadingCount > 0
              ? `Uploading ${uploadingCount} file${uploadingCount === 1 ? "" : "s"}…`
              : "Drag and drop files here, or click to browse"}
          </span>
          <span className="font-sans font-medium text-[14px] leading-[16px] text-white/60">
            WAV, MP3, FLAC, MIDI, PDF up to 50MB
          </span>
        </div>
      </section>

      {uploadError && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {uploadError}
        </p>
      )}

      {uploadSuccess && (
        <div
          role="status"
          className="fixed right-5 top-5 z-100 flex items-center gap-3 rounded-2xl border border-primary-green/40 bg-[#15251e] px-4 py-3 text-sm text-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-green text-[#15251e]">
            <HiCheck size={16} />
          </span>
          <span>{uploadSuccess}</span>
        </div>
      )}

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
          {isLoading && (
            <div className="py-6 text-center font-sans text-[14px] text-white/60">
              Loading project files…
            </div>
          )}

          {!isLoading && files.length === 0 && (
            <div className="py-6 text-center font-sans text-[14px] text-white/60">
              No files have been uploaded to this project yet.
            </div>
          )}

          {!isLoading && files.map((file) => (
            <div 
              key={file.id}
              className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 w-full items-start md:items-center py-2 md:py-0 border-b border-white/5 md:border-0 last:border-0 pb-4 md:pb-0"
            >
              
              {/* Name & Icon */}
              <div className="col-span-5 lg:col-span-6 flex items-center gap-3">
                <HiOutlineDocumentText className="text-primary-green shrink-0" size={20} />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans font-semibold text-[16px] leading-[19px] text-white truncate hover:text-primary-green transition-colors"
                >
                  {file.name}
                </a>
              </div>

              {/* Size */}
              <div className="col-span-2 flex items-center">
                <span className="font-sans font-semibold text-[14px] text-white/60">
                  {formatFileSize(file.size)}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-3 lg:col-span-2 flex items-center">
                <span className="font-sans font-semibold text-[14px] text-white/60">
                  {formatDate(file.createdAt)}
                </span>
              </div>

              {/* Version Pill */}
              <div className="col-span-2 flex items-center md:justify-end mt-2 md:mt-0">
                <div className="flex items-center justify-center px-4 py-1 bg-white/20 rounded-[20px]">
                  <span className="font-sans font-semibold text-[14px] text-white/60">
                    —
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

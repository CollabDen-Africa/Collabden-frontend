"use client";

import React, { useEffect, useRef, useState } from "react";
import { HiCheck, HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineTrash, HiOutlineDownload, HiOutlineBookmark } from "react-icons/hi";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useProjects } from "@/hooks/projects/useProjects";
import { useSaveFileToSpace } from "@/hooks/user/useUserSpace";
import { getErrorMessage } from "@/lib/error-handler";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

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
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string } | null>(null);
  const { useUploadProjectFile, useDeleteProjectFile } = useProjects();
  const uploadFile = useUploadProjectFile(projectId);
  const deleteFile = useDeleteProjectFile(projectId);
  const saveToSpace = useSaveFileToSpace();

  const handleSaveToSpace = async (fileId: string, name: string) => {
    setActionError(null);
    setSavingId(fileId);
    try {
      await saveToSpace.mutateAsync({ projectId, fileId });
      setActionSuccess(`"${name}" saved to My Space.`);
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setSavingId(null);
    }
  };

  useEffect(() => {
    if (!actionSuccess && !actionError) return;
    const timeout = window.setTimeout(() => {
      setActionSuccess(null);
      setActionError(null);
    }, 4_000);
    return () => window.clearTimeout(timeout);
  }, [actionSuccess, actionError]);

  const uploadFiles = async (fileList: FileList | File[]) => {
    const selectedFiles = Array.from(fileList);
    if (!projectId || selectedFiles.length === 0) return;

    setActionError(null);
    setActionSuccess(null);

    // Client-side file size validation (Limit: 50MB)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; 
      const validFiles = selectedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    
      if (validFiles.length < selectedFiles.length) {
        setActionError("Cannot upload: One or more files exceed the 50MB limit.");
          if (validFiles.length === 0) {
            if (inputRef.current) inputRef.current.value = "";
            return; // Halt if no files passed the size check
          }
    }
    
    setUploadingCount(validFiles.length);
    try {
      await Promise.all(validFiles.map((file) => uploadFile.mutateAsync(file)));
      setActionSuccess(
        `${validFiles.length} file${validFiles.length === 1 ? "" : "s"} uploaded successfully.`,
      );
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setUploadingCount(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const confirmDelete = async () => {
      if (!fileToDelete) return;
      
      setActionError(null);
      setDeletingId(fileToDelete.id);
      try {
        await deleteFile.mutateAsync(fileToDelete.id);
        setActionSuccess("File deleted successfully.");
      } catch (error) {
        setActionError(getErrorMessage(error));
      } finally {
        setDeletingId(null);
        setFileToDelete(null);
      }
    };
  
  const handleDownload = async (url: string, filename: string, fileId: string) => {
    setDownloadingId(fileId);
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        link.remove();
        window.URL.revokeObjectURL(objectUrl);
      } catch {
        setActionError("Failed to download file.");
      } finally {
        setDownloadingId(null);
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

      {actionError && (
        <div
          role="alert"
          className="fixed right-5 top-5 lg:top-20 z-100 flex items-center gap-3 rounded-2xl border border-red-400/40 bg-[#251515] px-4 py-3 text-sm text-red-200 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold">
            !
          </span>
          <span>{actionError}</span>
        </div>
       )}

      {actionSuccess && (
        <div
          role="status"
          className="fixed right-5 top-5 z-100 flex items-center gap-3 rounded-2xl border border-primary-green/40 bg-[#15251e] px-4 py-3 text-sm text-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-green text-[#15251e]">
            <HiCheck size={16} />
          </span>
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* File List Table */}
      <section className="w-full bg-black/10 rounded-[30px] p-6 lg:p-[40px_32px] flex flex-col gap-6 overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 w-full border-b border-white/5 pb-4">
          <div className="md:col-span-5">
            <span className="font-sans font-medium text-[18px] text-white">Name</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-sans font-medium text-[18px] text-white">Size</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-sans font-normal text-[18px] text-white">Date</span>
          </div>
          <div className="md:col-span-3 text-right">
            <span className="font-sans font-normal text-[18px] text-white">Version</span>
          </div>
        </div>

        {/* File Rows */}
        <div className="flex flex-col gap-4 md:gap-0">
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
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 w-full items-center py-4 border-b border-white/5 md:border-0 last:border-0 pb-4 md:pb-0"
            >
              
              {/* Name & Icon */}
              <div className="col-span-2 md:col-span-5 flex items-center gap-3">
                <HiOutlineDocumentText className="text-primary-green shrink-0" size={20} />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans font-semibold text-[16px] leading-4.75 text-white truncate hover:text-primary-green transition-colors"
                >
                  {file.name}
                </a>
              </div>

              {/* Size */}
              <div className="col-span-1 md:col-span-2 flex items-center">
                <span className="font-sans font-semibold text-[14px] text-white/60">
                  {formatFileSize(file.size)}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-end md:justify-start">
                <span className="font-sans font-semibold text-[14px] text-white/60">
                  {formatDate(file.createdAt)}
                </span>
              </div>

              {/* Version & Actions */}
              <div className="col-span-2 md:col-span-3 flex items-center justify-between md:justify-end gap-3 md:gap-4 pt-3 mt-1 border-t border-white/5 md:border-none md:pt-0 md:mt-0">
                {/* Version Button */}
                <button 
                  className="flex items-center justify-center px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
                  title="View file versions"
                >
                  <span className="font-sans font-semibold text-[12px] text-white/70">
                                 -
                  </span>
                </button>
             
                {/* Download / Delete Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(file.url, file.name, file.id)}
                    disabled={downloadingId === file.id}
                    className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 hover:text-primary-green rounded-full transition-colors text-white/60 disabled:opacity-50"
                    title="Download file"
                  >
                    <HiOutlineDownload size={18} />
                  </button>
                  <button
                    onClick={() => handleSaveToSpace(file.id, file.name)}
                    disabled={savingId === file.id}
                    className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 hover:text-primary-green rounded-full transition-colors text-white/60 disabled:opacity-50"
                    title="Save to My Space"
                  >
                    <HiOutlineBookmark size={18} />
                  </button>
                  <button
                    onClick={() => setFileToDelete({ id: file.id, name: file.name })}
                    disabled={deletingId === file.id}
                    className="flex items-center justify-center p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-white/60 disabled:opacity-50"
                    title="Delete file"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      <ConfirmationModal
              isOpen={Boolean(fileToDelete)}
              onClose={() => setFileToDelete(null)}
              onConfirm={confirmDelete}
              title="Delete File"
              description={
                <>
                  Are you sure you want to delete <span className="text-white font-semibold">{fileToDelete?.name}</span>? This action cannot be undone and it will be removed from the project workspace.
                </>
              }
              confirmText="Delete File"
              cancelText="Cancel"
              variant="danger"
              isLoading={deletingId !== null}
            />

    </div>
  );
}

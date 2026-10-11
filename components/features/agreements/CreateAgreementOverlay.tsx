"use client";

import React, { useState, useRef } from "react";
import { FiX, FiUploadCloud, FiFileText, FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface CreateAgreementOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isPending?: boolean;
}

export default function CreateAgreementOverlay({
  isOpen,
  onClose,
  onUpload,
  isPending = false,
}: CreateAgreementOverlayProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Cleanup/Reset when closing
  const handleClose = () => {
    setSelectedFile(null);
    setErrorMsg("");
    onClose();
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg("");
    // Check file type
    if (file.type !== "application/pdf") {
      setErrorMsg("Please upload a valid PDF document.");
      return;
    }
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size must be less than 10MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-5 animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-[#121A1F]/80 backdrop-blur-md" onClick={!isPending ? handleClose : undefined} />

      <div className="relative z-10 w-full max-w-150 bg-white/10 border border-white/20 rounded-[40px] p-8 md:p-10 shadow-2xl backdrop-blur-xl flex flex-col gap-6 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col gap-1">
            <h2 className="font-raleway font-semibold text-[20px] lg:text-[24px] text-white">
              Upload New Agreement
            </h2>
            <p className="font-raleway font-normal text-[14px] text-white/60">
              Upload a draft PDF for your collaborators to review and sign.
            </p>
          </div>
          <button 
            onClick={handleClose} 
            disabled={isPending}
            className="w-9 h-9 shrink-0 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <FiX className="text-white/60" size={18} />
          </button>
        </div>

        {/* Drag & Drop Area */}
        {!selectedFile ? (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-50 border-2 border-dashed rounded-6 transition-colors cursor-pointer ${
              isDragging ? "border-primary-green bg-primary-green/10" : "border-white/20 bg-black/20 hover:border-white/40"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUploadCloud className={`mb-4 ${isDragging ? "text-primary-green" : "text-white/40"}`} size={48} />
            <span className="font-raleway font-medium text-[16px] text-white/80">
              Drag & Drop your PDF here
            </span>
            <span className="font-raleway font-normal text-[13px] text-white/50 mt-2">
              or click to browse (Max 10MB)
            </span>
            <input 
              type="file" 
              accept="application/pdf"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          /* Selected File Preview */
          <div className="flex items-center justify-between w-full p-5 bg-white/5 border border-primary-green/30 rounded-[20px]">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 shrink-0 bg-primary-green/20 rounded-full flex items-center justify-center">
                <FiFileText className="text-primary-green" size={24} />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-raleway font-medium text-[15px] text-white truncate">
                  {selectedFile.name}
                </span>
                <span className="font-raleway font-normal text-[13px] text-white/60">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedFile(null)}
              disabled={isPending}
              className="w-9 h-9 rounded-full bg-accent-red/10 flex items-center justify-center hover:bg-accent-red/20 transition-colors disabled:opacity-50"
            >
              <FiTrash2 className="text-accent-red-alt" size={16} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <p className="font-raleway font-medium text-[13px] text-accent-red-alt text-center">
            {errorMsg}
          </p>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile || isPending}
          className={`w-full h-14 rounded-full mt-2 font-raleway font-semibold text-[16px] transition-all duration-300 ${
            !selectedFile 
              ? "bg-white/5 text-white/40 cursor-not-allowed border-transparent" 
              : "bg-primary-green text-white hover:bg-accent-green-success shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
          }`}
        >
          {isPending ? "Uploading Draft..." : "Upload Agreement"}
        </Button>

      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import {
  FiX,
  FiExternalLink,
  FiFileText,
  FiDownload,
  FiEye,
} from "react-icons/fi";

interface FileViewerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl?: string | null;
  title?: string;
  mimeType?: string | null;
  typeLabel?: string;
  onDownload?: () => void;
}

const isPdfLike = (mime?: string | null, url?: string | null) => {
  if (mime?.toLowerCase().includes("pdf")) return true;
  if (url?.split("?")[0].toLowerCase().endsWith(".pdf")) return true;
  return false;
};

const isImageLike = (mime?: string | null, url?: string | null) => {
  if (mime?.toLowerCase().startsWith("image/")) return true;
  const path = url?.split("?")[0].toLowerCase() || "";
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/.test(path);
};

export default function FileViewerOverlay({
  isOpen,
  onClose,
  fileUrl,
  title,
  mimeType,
  typeLabel,
  onDownload,
}: FileViewerOverlayProps) {
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (isOpen) setPreviewError(false);
  }, [isOpen, fileUrl]);

  if (!isOpen) return null;

  const canPreviewPdf = isPdfLike(mimeType, fileUrl);
  const canPreviewImage = isImageLike(mimeType, fileUrl);
  const canPreview = (canPreviewPdf || canPreviewImage) && !!fileUrl && !previewError;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-[#121A1F]/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] bg-white/10 border border-white/20 rounded-[40px] shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FiEye className="text-primary-green shrink-0" size={22} />
            <h2 className="font-raleway font-semibold text-[20px] text-white leading-7.5 truncate">
              {title || "File Preview"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors group shrink-0"
          >
            <FiX className="text-white/60 group-hover:text-white transition-colors" size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-8 pb-8 overflow-y-auto flex-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-raleway font-medium text-[14px] text-white/80">
                {typeLabel || "Document"}
              </span>
              <div className="flex items-center gap-4">
                {onDownload && (
                  <button
                    onClick={onDownload}
                    className="flex items-center gap-1.5 text-white/70 hover:text-primary-green transition-colors text-[13px] font-raleway font-medium"
                  >
                    <FiDownload size={14} />
                    Download
                  </button>
                )}
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary-green hover:text-accent-green-bright transition-colors text-[13px] font-raleway font-medium"
                  >
                    <FiExternalLink size={14} />
                    Open in new tab
                  </a>
                )}
              </div>
            </div>

            <div className="w-full rounded-[20px] overflow-hidden border border-white/10 bg-black/30 h-[60vh] flex items-center justify-center">
              {canPreview && canPreviewPdf && (
                <iframe
                  src={fileUrl!}
                  title={title || "File preview"}
                  className="w-full h-full"
                  onError={() => setPreviewError(true)}
                />
              )}

              {canPreview && canPreviewImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={fileUrl!}
                  alt={title || "File preview"}
                  className="max-w-full max-h-full object-contain"
                  onError={() => setPreviewError(true)}
                />
              )}

              {!canPreview && (
                <div className="flex flex-col items-center gap-3 text-white/40 p-6 text-center">
                  <FiFileText size={40} strokeWidth={1.5} />
                  <span className="font-raleway text-[14px]">
                    {!fileUrl
                      ? "No file available."
                      : previewError
                        ? "Unable to preview this file inline."
                        : "This file type can't be previewed inline."}
                  </span>
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary-green hover:text-accent-green-bright transition-colors text-[13px] font-medium mt-1"
                    >
                      <FiExternalLink size={13} />
                      Open to view
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

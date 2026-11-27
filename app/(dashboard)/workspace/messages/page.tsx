"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSend, FiMic, FiX, FiPaperclip } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import VoiceNotePlayer from "@/components/features/messages/VoiceNotePlayer";
import FileViewerOverlay from "@/components/features/my-space/FileViewerOverlay";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/hooks/projects/useProjects";
import { useVoiceRecorder } from "@/hooks/messaging/useVoiceRecorder";
import projectService from "@/services/project.service";
import { getErrorMessage } from "@/lib/error-handler";
import type { AttachmentInput } from "@/types/messaging.types";
import { MAX_PROJECT_ATTACHMENT_BYTES, MAX_PROJECT_ATTACHMENTS_PER_MESSAGE } from "@/types/projects.types";

const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
};

const formatClock = (secs: number) => {
  const s = Math.max(0, Math.floor(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type ViewerState = { url: string; name: string | null; mimeType: string | null } | null;

export default function MessagesPage() {
  const { projectDetails, activeProject, isLoading } = useWorkspace();
  const { user } = useAuth();
  const currentProject = projectDetails || activeProject;
  const projectId = currentProject?.id || "";

  const activeCollaborators = useMemo(() => {
    if (!currentProject) return [];
    const collaborators = currentProject.collaborators || [];
    const ownerId = currentProject.owner?.id || currentProject.ownerId;
    return collaborators.filter((c) => {
      const cUserId = c.user?.id || c.userId;
      return (c.isActive !== false) && cUserId !== ownerId;
    });
  }, [currentProject]);

  const hasActiveCollaborators = activeCollaborators.length > 0;
  const isSoloProject = !isLoading && !!currentProject && !hasActiveCollaborators;

  const messages = useMemo(
    () => [...(projectDetails?.messages || activeProject?.messages || [])]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [projectDetails?.messages, activeProject?.messages],
  );

  const [inputText, setInputText] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSendingVoice, setIsSendingVoice] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [viewer, setViewer] = useState<ViewerState>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { useSendProjectMessage } = useProjects();
  const sendMessage = useSendProjectMessage(projectId);
  const recorder = useVoiceRecorder();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (recorder.error) setSendError(recorder.error);
  }, [recorder.error]);

  const canSend = !!projectId && hasActiveCollaborators && !sendMessage.isPending && !isSendingVoice && !isUploadingAttachments;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const oversized = selected.filter((f) => f.size > MAX_PROJECT_ATTACHMENT_BYTES);
    if (oversized.length > 0) setAttachmentError("File exceeds the 50 MB limit.");
    const valid = selected.filter((f) => f.size <= MAX_PROJECT_ATTACHMENT_BYTES);
    setAttachmentFiles((prev) => [...prev, ...valid].slice(0, MAX_PROJECT_ATTACHMENTS_PER_MESSAGE));
    e.target.value = "";
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = inputText.trim();
    if (!content && attachmentFiles.length === 0) return;
    if (!canSend) return;

    setSendError(null);
    setAttachmentError(null);

    // Upload files first — keep chips visible (with spinner) during this phase
    let uploadedAttachments: AttachmentInput[] = [];
    if (attachmentFiles.length > 0) {
      setIsUploadingAttachments(true);
      try {
        const results = await Promise.all(
          attachmentFiles.map((file) => projectService.uploadProjectAttachment(projectId, file))
        );
        uploadedAttachments = results.map((r) => ({
          url: r.path,
          name: r.name,
          mimeType: r.mimeType,
          size: r.size,
        }));
        setAttachmentFiles([]); // clear only after upload succeeds
      } catch (error) {
        setAttachmentError(getErrorMessage(error));
        setIsUploadingAttachments(false);
        return;
      }
      setIsUploadingAttachments(false);
    }

    try {
      await sendMessage.mutateAsync({
        content: content || undefined,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      });
      setInputText("");
    } catch (error) {
      setSendError(getErrorMessage(error));
    }
  };

  const handleStartRecording = async () => {
    if (!canSend || !recorder.isSupported) return;
    setSendError(null);
    await recorder.start();
  };

  const handleStopRecording = async () => {
    await recorder.stop();
  };

  const handleDiscardRecording = () => {
    recorder.cancel();
    recorder.reset();
  };

  const handleSendRecording = async () => {
    if (!recorder.recording || !canSend) return;
    setSendError(null);
    setIsSendingVoice(true);
    try {
      const upload = await projectService.uploadProjectVoiceNote(
        projectId,
        recorder.recording.blob,
        recorder.recording.durationSeconds,
      );
      await sendMessage.mutateAsync({
        voiceUrl: upload.path,
        voiceDuration: upload.durationSeconds,
        voiceSize: upload.size,
      });
      recorder.reset();
    } catch (error) {
      setSendError(getErrorMessage(error));
    } finally {
      setIsSendingVoice(false);
    }
  };

  const renderInputBar = () => {
    if (recorder.state === "recording") {
      return (
        <div className="w-full h-[56px] bg-white rounded-full flex items-center pl-6 pr-1 shadow-xl">
          <button
            type="button"
            onClick={handleDiscardRecording}
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Discard recording"
          >
            <FiX size={18} />
          </button>
          <div className="flex-1 flex items-center justify-center gap-3 text-black/70">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" aria-hidden />
            <span className="font-mono text-sm font-semibold tabular-nums">
              {formatClock(recorder.elapsedSeconds)}
            </span>
            <span className="text-xs text-black/40">Recording…</span>
          </div>
          <button
            type="button"
            onClick={handleStopRecording}
            className="w-[54px] h-[54px] bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95 cursor-pointer"
            aria-label="Stop and preview"
          >
            <FiSend size={20} className="text-white relative right-[1px] top-[1px]" />
          </button>
        </div>
      );
    }

    if (recorder.state === "stopped" && recorder.recording) {
      return (
        <div className="w-full h-[56px] bg-white rounded-full flex items-center pl-2 pr-1 shadow-xl gap-2">
          <button
            type="button"
            onClick={handleDiscardRecording}
            disabled={isSendingVoice}
            className="w-10 h-10 shrink-0 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Discard recording"
          >
            <FiX size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <VoiceNotePlayer
              src={recorder.recording.objectUrl}
              durationSeconds={recorder.recording.durationSeconds}
              variant="light"
            />
          </div>
          <button
            type="button"
            onClick={handleSendRecording}
            disabled={isSendingVoice}
            className="w-[54px] h-[54px] shrink-0 bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Send voice note"
          >
            {isSendingVoice ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSend size={20} className="text-white relative right-[1px] top-[1px]" />
            )}
          </button>
        </div>
      );
    }

    const trimmed = inputText.trim();
    const showMic = trimmed.length === 0 && attachmentFiles.length === 0 && recorder.isSupported;

    return (
      <>
        {attachmentFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachmentFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/90 rounded-full px-3 py-1 shadow text-xs text-black/70 max-w-[180px]">
                {file.type.startsWith("image/") && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={URL.createObjectURL(file)} alt="" className="w-5 h-5 rounded object-cover shrink-0" />
                )}
                <span className="truncate">{file.name.length > 24 ? file.name.slice(0, 24) + "…" : file.name}</span>
                {isUploadingAttachments ? (
                  <div className="w-3 h-3 border border-black/30 border-t-primary-green rounded-full animate-spin shrink-0" />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAttachmentFiles((p) => p.filter((_, j) => j !== i))}
                    className="shrink-0 text-black/40 hover:text-red-500"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={!canSend}
        />
        <form
          onSubmit={handleSendMessage}
          className="w-full h-[56px] bg-white rounded-full flex items-center px-4 relative shadow-xl focus-within:outline-2 focus-within:outline-primary-green"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canSend}
            className="mr-2 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-black/40 hover:text-primary-green hover:bg-black/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Attach file"
          >
            <FiPaperclip size={16} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            disabled={!canSend}
            className="flex-1 h-full bg-transparent border-none outline-none font-sans font-medium text-[16px] text-black/80 disabled:cursor-not-allowed disabled:placeholder-black/40 pr-14"
            placeholder={
              !projectId
                ? "Select a project to message"
                : !hasActiveCollaborators
                ? "Invite collaborators to start chatting..."
                : "Message..."
            }
          />
          {showMic ? (
            <button
              type="button"
              onClick={handleStartRecording}
              disabled={!canSend}
              className="absolute right-0 w-[54px] h-[54px] bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Record voice note"
              title="Record voice note"
            >
              <FiMic size={20} className="text-white" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={(!trimmed && attachmentFiles.length === 0) || !canSend}
              className="absolute right-0 w-[54px] h-[54px] bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send message"
            >
              {sendMessage.isPending ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSend size={20} className="text-white relative right-[1px] top-[1px]" />
              )}
            </button>
          )}
        </form>
      </>
    );
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full max-w-[1224px] h-[638px] bg-white/5 border border-white/10 rounded-[30px] flex flex-col relative overflow-hidden backdrop-blur-md shadow-2xl">
        {isSoloProject && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 text-center text-amber-200 text-sm font-medium z-10">
            You are currently the only member in this project. Invite collaborators to start messaging in this workspace.
          </div>
        )}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-8 pb-[104px]">
          {isLoading && <p className="text-center text-sm text-white/60 py-8">Loading messages…</p>}
          {!isLoading && messages.length === 0 && (
            <p className="text-center text-sm text-white/60 py-8">
              {isSoloProject ? "No collaborators in this project yet." : "No messages in this project yet."}
            </p>
          )}
          {!isLoading && messages.map((message) => {
            const isMe = message.senderId === user?.id;
            const senderName = message.sender?.displayName || message.sender?.legalName || message.sender?.email?.split("@")[0] || "Project member";
            const isVoice = !!message.voiceUrl;
            const hasAttachments = Array.isArray(message.attachments) && message.attachments.length > 0;

            return (
              <div key={message.id} className={`flex items-end gap-3 w-full ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <div className="w-[45px] h-[45px] rounded-full border border-primary-green overflow-hidden shrink-0">
                  <Avatar name={senderName} src={message.sender?.avatarUrl || undefined} className="w-full h-full" />
                </div>
                <div className={`flex flex-col gap-2 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-5 py-4 shadow-sm font-poppins ${isMe ? "bg-primary-blue text-white rounded-msg-me" : "bg-white text-primary-blue/50 rounded-msg-them"}`}>
                    {isVoice ? (
                      <VoiceNotePlayer
                        src={message.voiceUrl!}
                        durationSeconds={message.voiceDuration ?? 0}
                        variant={isMe ? "dark" : "light"}
                      />
                    ) : (
                      message.content && (
                        <p className={`font-medium text-[16px] leading-[24px] whitespace-pre-wrap ${isMe ? "text-white" : "text-primary-blue/80"}`}>
                          {message.content}
                        </p>
                      )
                    )}

                    {hasAttachments && (
                      <div className={`flex flex-col gap-2 ${(isVoice || message.content) ? "mt-3" : ""}`}>
                        {message.attachments!.map((att, i) => {
                          const isImage = att.mimeType?.startsWith("image/");
                          return isImage ? (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setViewer({ url: att.url, name: att.name ?? null, mimeType: att.mimeType ?? null })}
                              className="rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-green/60"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={att.url}
                                alt={att.name || "image"}
                                className="max-w-[200px] max-h-48 rounded-xl object-cover hover:opacity-90 transition-opacity cursor-pointer"
                              />
                            </button>
                          ) : (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setViewer({ url: att.url, name: att.name ?? null, mimeType: att.mimeType ?? null })}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left w-full hover:opacity-80 transition-opacity cursor-pointer ${isMe ? "bg-white/15 text-white" : "bg-black/5 text-primary-blue"}`}
                            >
                              <FiPaperclip size={13} className="shrink-0" />
                              <span className="truncate max-w-[140px]">{att.name || "File"}</span>
                              {att.size != null && (
                                <span className="shrink-0 opacity-60 ml-auto">{formatFileSize(att.size)}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <span className="font-poppins font-light text-[13px] text-white/40 px-1">
                    {senderName} • {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-0 w-full px-6 z-20">
          {renderInputBar()}
          {sendError && <p className="mt-2 text-sm text-red-300">{sendError}</p>}
          {attachmentError && <p className="mt-1 text-sm text-red-300">{attachmentError}</p>}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <FileViewerOverlay
        isOpen={!!viewer}
        onClose={() => setViewer(null)}
        fileUrl={viewer?.url}
        title={viewer?.name || "Attachment"}
        mimeType={viewer?.mimeType}
        typeLabel={viewer?.mimeType || "File"}
        onDownload={viewer?.url ? async () => {
          try {
            const res = await fetch(viewer.url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = viewer.name || "attachment";
            a.click();
            URL.revokeObjectURL(blobUrl);
          } catch {
            window.open(viewer.url, "_blank");
          }
        } : undefined}
      />
    </div>
  );
}

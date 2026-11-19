"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSend, FiMic, FiX } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import VoiceNotePlayer from "@/components/features/messages/VoiceNotePlayer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/hooks/projects/useProjects";
import { useVoiceRecorder } from "@/hooks/messaging/useVoiceRecorder";
import projectService from "@/services/project.service";
import { getErrorMessage } from "@/lib/error-handler";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { useSendProjectMessage } = useProjects();
  const sendMessage = useSendProjectMessage(projectId);
  const recorder = useVoiceRecorder();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Surface recorder errors (mic permission denied, unsupported, etc.)
  useEffect(() => {
    if (recorder.error) setSendError(recorder.error);
  }, [recorder.error]);

  const canSend = !!projectId && hasActiveCollaborators && !sendMessage.isPending && !isSendingVoice;

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = inputText.trim();
    if (!content || !canSend) return;

    setSendError(null);
    try {
      await sendMessage.mutateAsync({ content });
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
    const showMic = trimmed.length === 0 && recorder.isSupported;

    return (
      <form
        onSubmit={handleSendMessage}
        className="w-full h-[56px] bg-white rounded-full flex items-center px-6 relative shadow-xl focus-within:outline-2 focus-within:outline-primary-green"
      >
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
            disabled={!trimmed || !canSend}
            className="absolute right-0 w-[54px] h-[54px] bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Send message"
          >
            <FiSend size={20} className="text-white relative right-[1px] top-[1px]" />
          </button>
        )}
      </form>
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
                      <p className={`font-medium text-[16px] leading-[24px] whitespace-pre-wrap ${isMe ? "text-white" : "text-primary-blue/80"}`}>{message.content}</p>
                    )}
                  </div>
                  <span className="font-poppins font-light text-[13px] text-white/40 px-1">{senderName} • {formatTime(message.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-0 w-full px-6 z-20">
          {renderInputBar()}
          {sendError && <p className="mt-2 text-sm text-red-300">{sendError}</p>}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

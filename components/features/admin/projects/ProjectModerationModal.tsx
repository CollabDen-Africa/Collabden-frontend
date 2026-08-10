import React, { useState } from "react";
import { HiOutlineArchive, HiOutlineTrash, HiOutlineExclamation, HiX } from "react-icons/hi";
import { useModerateProject } from "@/hooks/admin/useModerateProject";

export const ProjectModerationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  project: any;
}> = ({ isOpen, onClose, project }) => {
  const [actionType, setActionType] = useState<"ARCHIVE" | "REMOVE">("ARCHIVE");
  const [reason, setReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [notifyOwner, setNotifyOwner] = useState(true);
  
  const { mutate: moderateProject, isPending } = useModerateProject(project?.id);

  if (!isOpen || !project) return null;

  const handleSubmit = () => {
    if (!reason) return;
    
    moderateProject(
      { actionType, reason, additionalNotes, notifyOwner },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const ownerName = project.owner?.displayName || `${project.owner?.firstName || ''} ${project.owner?.lastName || ''}`.trim() || 'Unknown';
  const collabsCount = project._count?.collaborators || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#121415] rounded-3xl w-full max-w-[600px] flex flex-col border border-white/5 animate-in zoom-in-95 duration-200 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 md:px-8 md:py-6 flex items-start justify-between border-b border-white/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 text-yellow-500">
              <HiOutlineArchive size={24} />
            </div>
            <div className="flex flex-col gap-1 mt-0.5">
              <h2 className="text-xl font-bold text-white tracking-tight">Archive Project</h2>
              <p className="text-sm text-white/40 font-medium">This action will be recorded in the audit log</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <HiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Project Info Card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
              <span className="text-xl text-blue-500 font-bold">🎵</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">{project.name}</h3>
                {project._count?.reports > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">Reported</span>
                )}
              </div>
              <p className="text-xs text-white/40 mt-1 font-medium">
                PRJ-{project.id.substring(project.id.length - 4)} · Owner: {ownerName} · {collabsCount} Collaborators
              </p>
            </div>
          </div>

          {/* Moderation Action */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white">Moderation Action <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActionType("ARCHIVE")}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  actionType === "ARCHIVE" ? "border-yellow-500 bg-yellow-500/5 shadow-[0_0_0_1px_rgba(234,179,8,0.2)]" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className={`flex items-center gap-2 ${actionType === "ARCHIVE" ? "text-yellow-500" : "text-white"}`}>
                  <HiOutlineArchive size={18} />
                  <span className="font-bold text-sm">Archive</span>
                </div>
                <span className="text-xs text-white/40 font-medium">Hidden, recoverable</span>
              </button>

              <button 
                onClick={() => setActionType("REMOVE")}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  actionType === "REMOVE" ? "border-red-500 bg-red-500/5 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className={`flex items-center gap-2 ${actionType === "REMOVE" ? "text-red-500" : "text-white"}`}>
                  <HiOutlineTrash size={18} />
                  <span className="font-bold text-sm">Remove</span>
                </div>
                <span className="text-xs text-white/40 font-medium">Permanent deletion</span>
              </button>
            </div>
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white">Reason <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Copyright infringement"
              className="w-full bg-[#0a0a0c] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-white/20"
            />
          </div>

          {/* Additional Notes */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white">Additional Notes</label>
            <textarea 
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Samples used without clearance..."
              rows={3}
              className="w-full bg-[#0a0a0c] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all resize-none placeholder:text-white/20"
            />
          </div>

          {/* Notify Project Owner */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-white">Notify Project Owner</span>
              <span className="text-xs text-white/40 font-medium">{ownerName} will receive an email notification</span>
            </div>
            
            <button 
              onClick={() => setNotifyOwner(!notifyOwner)}
              className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${notifyOwner ? "bg-[#72c043]" : "bg-white/10"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifyOwner ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3">
            <HiOutlineExclamation size={20} className="text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-500/80 leading-relaxed font-medium">
              Archiving this project will make it invisible to all users including collaborators. The project owner and all collaborators will be notified. This action is logged in the audit trail.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 flex items-center justify-end gap-3 border-t border-white/5 bg-[#0a0a0c] rounded-b-3xl">
          <button 
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!reason || isPending}
            className={`px-6 py-2.5 rounded-xl text-black text-sm font-bold transition-all disabled:opacity-50 ${actionType === 'REMOVE' ? 'bg-red-500 hover:bg-red-400' : 'bg-yellow-500 hover:bg-yellow-400'}`}
          >
            {isPending ? "Confirming..." : actionType === 'REMOVE' ? "Confirm Remove" : "Confirm Archive"}
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from "react";
import { HiOutlineLockClosed, HiOutlineShieldCheck } from "react-icons/hi";
import { useProjectAuditHistory } from "@/hooks/admin/useProjectAuditHistory";
import { useProjectNotes, useAddProjectNote } from "@/hooks/admin/useProjectNotes";
import { Pagination } from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";

export const ProjectNotesAudit: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [auditPage, setAuditPage] = useState(1);
  const [notesPage, setNotesPage] = useState(1);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const { user } = useAuth();
  const { data: auditData, isLoading: isAuditLoading } = useProjectAuditHistory({ id: projectId, page: auditPage, limit: 10 });
  const { data: notesData, isLoading: isNotesLoading } = useProjectNotes({ id: projectId, page: notesPage, limit: 5 });
  const { mutateAsync: addNote } = useAddProjectNote(projectId);

  const handleAddNote = async () => {
    if (!newNoteContent.trim() || !user?.id) return;
    setIsAddingNote(true);
    try {
      await addNote({ content: newNoteContent });
      setNewNoteContent("");
      setNotesPage(1); // Go back to first page to see the new note
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const getAuditStyle = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("approv") || actionLower.includes("verif")) return "bg-green-500";
    if (actionLower.includes("warn")) return "bg-yellow-500";
    if (actionLower.includes("review") || actionLower.includes("report")) return "bg-blue-500";
    if (actionLower.includes("delet") || actionLower.includes("suspend") || actionLower.includes("ban")) return "bg-red-500";
    return "bg-gray-500";
  };

  const formatAdminInitials = (email: string) => {
    if (!email) return "AD";
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0].slice(0, 2)).toUpperCase();
  };

  const formatAdminName = (email: string) => {
    if (!email) return "Unknown Admin";
    return email.split('@')[0];
  };

  const formatRole = (role: string) => {
    if (!role) return "System";
    return role.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="p-6 md:p-8 bg-[#0a0a0c] grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      
      {/* Left Column: Admin Notes */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-green-500 rounded-full" />
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Admin Notes 
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-medium text-white/60">{notesData?.total || 0}</span>
            </h3>
          </div>
        </div>

        {/* New Internal Note Input */}
        <div className="bg-[#121415] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white/80">New Internal Note</h4>
          <textarea 
            placeholder="Write an internal note visible only to administrators..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 resize-none min-h-[100px]"
          />
          <div className="flex justify-end">
            <button 
              onClick={handleAddNote}
              disabled={isAddingNote || !newNoteContent.trim()}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-bold px-6 py-2 rounded-full transition-colors"
            >
              {isAddingNote ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex flex-col gap-4">
          {isNotesLoading ? (
            <div className="text-sm text-white/40 text-center py-4">Loading notes...</div>
          ) : notesData?.notes?.length === 0 ? (
            <div className="text-sm text-white/40 text-center py-4">No internal notes found.</div>
          ) : (
            notesData?.notes?.map((note: any) => {
              const noteDate = new Date(note.createdAt);
              const dateStr = noteDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const timeStr = noteDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
              const adminEmail = note.admin?.email || "unknown@admin.com";
              const adminRole = formatRole(note.admin?.role);
              const initials = formatAdminInitials(adminEmail);
              const name = formatAdminName(adminEmail);

              return (
                <div key={note.id} className="bg-[#121415] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{name}</span>
                      <span className="text-xs text-white/40">{adminRole} · {dateStr} · {timeStr}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                    <HiOutlineLockClosed size={14} />
                    Visible to administrators only
                  </div>
                </div>
              );
            })
          )}
          
          {notesData?.totalPages > 1 && (
            <div className="mt-2">
              <Pagination 
                currentPage={notesPage}
                totalPages={notesData.totalPages}
                onPageChange={setNotesPage}
                itemName="notes"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Audit History */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Audit History <span className="text-xs font-normal text-white/40">· Read-only</span>
          </h3>
        </div>

        <div className="bg-[#121415] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2 text-xs text-white/40">
            <HiOutlineShieldCheck size={14} />
            Records cannot be edited or deleted
          </div>
          
          <div className="flex flex-col">
            {isAuditLoading ? (
              <div className="p-8 text-center text-white/40">Loading audit history...</div>
            ) : auditData?.audits?.length === 0 ? (
              <div className="p-8 text-center text-white/40">No audit records found.</div>
            ) : (
              auditData?.audits?.map((audit: any, index: number) => {
                const date = new Date(audit.createdAt);
                const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                const dotColorClass = getAuditStyle(audit.action);
                const isLast = index === auditData.audits.length - 1;
                
                return (
                  <div key={audit.id} className={`p-5 ${!isLast ? 'border-b border-white/5' : ''} flex flex-col gap-3`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dotColorClass}`} />
                        <span className="text-sm font-bold text-white">{audit.action}</span>
                      </div>
                      <span className="text-xs text-white/40 flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full border border-white/20 inline-flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-white/40"></span>
                        </span>
                        {dateStr} · {timeStr}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {auditData?.totalPages > 1 && (
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
              <Pagination 
                currentPage={auditPage}
                totalPages={auditData.totalPages}
                onPageChange={setAuditPage}
                itemName="records"
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

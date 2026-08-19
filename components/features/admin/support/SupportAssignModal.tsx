"use client";

import React, { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { TicketStatus, SupportTicketDetail } from "@/services/admin/support.service";

interface SupportAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicketDetail;
  onAssign: (adminId: string, adminName: string) => Promise<boolean>;
  onUpdateStatus: (status: TicketStatus) => Promise<boolean>;
}

const ADMIN_OPTIONS = [
  { id: "admin-001", name: "Support Admin" },
  { id: "admin-002", name: "Dev Support" },
  { id: "admin-003", name: "Verification Team" },
  { id: "admin-004", name: "Finance Team" },
  { id: "admin-005", name: "Legal Team" },
];

const STATUS_OPTIONS: TicketStatus[] = ["Open", "In Progress", "Resolved", "Closed"];

const CATEGORY_OPTIONS = [
  "Payment Issue",
  "Escrow Dispute",
  "Account Access",
  "Verification",
  "Platform Bug",
  "General Inquiry",
];

export const SupportAssignModal: React.FC<SupportAssignModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onAssign,
  onUpdateStatus,
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState(ticket.assignedTo || "");
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status);
  const [selectedCategory] = useState(ticket.category);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedAdmin) return;
    setIsAssigning(true);
    const adminOption = ADMIN_OPTIONS.find((a) => a.id === selectedAdmin);
    if (adminOption) {
      await onAssign(adminOption.id, adminOption.name);
    }
    setIsAssigning(false);
  };

  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    await onUpdateStatus(selectedStatus);
    setIsUpdatingStatus(false);
    onClose();
  };

  const createdDate = new Date(ticket.createdAt);
  const now = new Date();
  const hoursElapsed = Math.round((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl bg-[#1a1d1f] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-sm font-bold text-white">{ticket.ticketId} — {ticket.subject}</h2>
            <p className="text-xs text-text-muted mt-0.5">Manage assignment and ticket status</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Assignment Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Assignment</h3>
            <div className="grid grid-cols-2 gap-3">
              {ADMIN_OPTIONS.map((admin) => (
                <button
                  key={admin.id}
                  onClick={() => setSelectedAdmin(admin.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                    selectedAdmin === admin.id
                      ? "bg-primary-green/10 border-primary-green/30 text-primary-green"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {admin.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleAssign}
              disabled={!selectedAdmin || isAssigning}
              className="w-full py-2.5 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigning ? "Assigning..." : "Assign Ticket"}
            </button>
          </div>

          {/* Update Status Section */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Update Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-primary-green/40 cursor-pointer appearance-none"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status} className="bg-[#1a1d1f]">
                  {status}
                </option>
              ))}
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={isUpdatingStatus}
              className="w-full py-2.5 rounded-xl bg-accent-yellow text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </button>
          </div>

          {/* Category Section */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Category</h3>
            <select
              value={selectedCategory}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-primary-green/40 cursor-pointer appearance-none"
              disabled
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1a1d1f]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Response & SLA Tracking */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Response & SLA Tracking</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Elapsed</span>
                <span className="text-sm font-bold text-white font-mono">{hoursElapsed}h</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">SLA Target</span>
                <span className="text-sm font-bold text-accent-yellow font-mono">
                  {ticket.priority === "Critical" ? "2h" : ticket.priority === "High" ? "4h" : "24h"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAssignModal;

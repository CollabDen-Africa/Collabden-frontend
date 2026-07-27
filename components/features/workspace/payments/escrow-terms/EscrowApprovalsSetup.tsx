"use client";
import { useState } from "react";
import {
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiClock,
  FiEdit3,
  FiMoreHorizontal,
  FiTrash2,
  FiMessageSquare,
  FiBell,
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

interface ApprovalCollaborator {
  id: number;
  name: string;
  role: string;
  status: "approved" | "pending";
  amount: number;
}

interface EscrowApprovalsSetupProps {
  onBack?: () => void;
  onContinueToFunding?: () => void;
  collaborators?: ApprovalCollaborator[];
  currencySymbol?: string;
}

const DEFAULT_COLLABORATORS: ApprovalCollaborator[] = [
  {
    id: 1,
    name: "Oyinda",
    role: "Lead Vocalist & Arranger",
    status: "approved",
    amount: 800000,
  },
  {
    id: 2,
    name: "Chinedu Okafor",
    role: "Beat Producer",
    status: "approved",
    amount: 1200000,
  },
  {
    id: 3,
    name: "Amara Nwosu",
    role: "Session Guitarist",
    status: "pending",
    amount: 600000,
  },
  {
    id: 4,
    name: "Tunde Adeyemi",
    role: "Mix & Mastering Engineer",
    status: "pending",
    amount: 950000,
  },
];

export default function EscrowApprovalsSetup({
  onBack,
  onContinueToFunding,
  collaborators = DEFAULT_COLLABORATORS,
}: EscrowApprovalsSetupProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [requestChangesId, setRequestChangesId] = useState<number | null>(null);
  const [changeNote, setChangeNote] = useState("");

  const totalCount = collaborators.length;
  const approvedCount = collaborators.filter(
    (c) => c.status === "approved",
  ).length;
  const progressPercent =
    totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;

  // Handle clicking outside logic or toggling menus
  const toggleDropdown = (id: number) => {
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  const handleSendRequest = () => {
    // API logic (when added)
    setRequestChangesId(null);
    setChangeNote("");
  };

  return (
    <div className="w-full flex flex-col">
      {/* Section Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="font-raleway font-extrabold text-[20px] md:text-[24px] text-white tracking-[-0.6px]">
          Collaborator Approvals
        </h2>
        <p className="font-raleway font-normal text-[13px] md:text-[14px] text-text-muted/90">
          All collaborators must approve the terms before escrow is funded and
          activated.
        </p>
      </div>

      {/* Approval Progress Banner */}
      <div className="w-full bg-black/15 border border-white/5 rounded-[30px] p-5 md:p-6 mb-6 flex flex-col justify-center backdrop-blur-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-raleway font-bold text-[13px] md:text-[14px] text-white">
            Approval Progress
          </h3>
          <span className="font-raleway font-bold text-[13px] md:text-[14px] text-text-muted">
            {approvedCount} of {totalCount} approved
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-primary-green rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="font-raleway font-normal text-[12px] md:text-[13px] text-text-muted/90">
          {approvedCount === totalCount
            ? "All collaborators have approved."
            : `Waiting for ${totalCount - approvedCount} collaborators to review.`}
        </p>
      </div>

      {/* Collaborators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 w-full items-start">
        {collaborators.map((collab) => {
          const isApproved = collab.status === "approved";
          const isRequestingChanges = requestChangesId === collab.id;
          const isDropdownOpen = activeDropdownId === collab.id;

          return (
            <div
              key={collab.id}
              className={`bg-black/15 border border-white/5 rounded-6 md:rounded-[30px] p-5 md:p-6 flex flex-col backdrop-blur-md ${isDropdownOpen ? 'z-50' : 'z-10'}`}
            >
              {/* Top Row: Info & Status */}
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  {/* Avatar Container */}
                  <div className="relative">
                    <Avatar
                      name={collab.name}
                      className="w-10 h-10 rounded-xl text-[12px]"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[1.1px] border-black/30 flex items-center justify-center ${isApproved ? "bg-primary-green" : "bg-white/15"}`}
                    >
                      {isApproved ? (
                        <FiCheck
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      ) : (
                        <FiClock size={10} className="text-white/80" />
                      )}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="flex flex-col">
                    <h4 className="font-raleway font-bold text-[14px] text-white">
                      {collab.name}
                    </h4>
                    <span className="font-raleway font-normal text-[12px] text-text-muted/90">
                      {collab.role}
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                <div
                  className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 border-[1.1px] ${
                    isApproved
                      ? "bg-primary-green/10 border-primary-green/20 text-primary-green"
                      : "bg-accent-yellow/10 border-accent-yellow/20 text-accent-yellow"
                  }`}
                >
                  {isApproved ? <FiCheck size={12} /> : <FiClock size={12} />}
                  <span className="font-raleway font-semibold text-[11px] md:text-[12px] capitalize">
                    {collab.status}
                  </span>
                </div>
              </div>

              {/* Dynamic Actions / Request Changes Form */}
              <div className="mt-auto pt-4">
                {isRequestingChanges ? (
                  // Request Changes Form 
                  <div className="flex flex-col gap-3 animate-fade-in bg-black/15 border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="font-raleway font-bold text-[11px] text-text-muted uppercase tracking-[0.5px]">
                        Request Revisions
                      </span>
                    </div>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors resize-none h-[80px]"
                      placeholder={`Detail your changes here...`}
                      value={changeNote}
                      onChange={(e) => setChangeNote(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setRequestChangesId(null)}
                        className="h-8 px-4 text-[12px] rounded-[10px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSendRequest}
                        className="h-8 px-4 text-[12px] rounded-[10px]"
                      >
                        Send Request
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Default Action Buttons
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                    <button
                      className={`flex-1 flex min-w-25 items-center justify-center gap-1.5 h-9 rounded-[14px] transition-colors ${
                        isApproved
                          ? "bg-primary-green hover:bg-primary-green/90"
                          : "bg-primary-green/10 border border-primary-green/20 hover:bg-primary-green/20"
                      }`}
                    >
                      <FiCheck
                        size={14}
                        className={
                          isApproved ? "text-white" : "text-primary-green"
                        }
                      />
                      <span
                        className={`font-raleway font-bold text-[12px] ${isApproved ? "text-white" : "text-primary-green"}`}
                      >
                        Approve
                      </span>
                    </button>

                    <button
                      onClick={() => setRequestChangesId(collab.id)}
                      className="flex-1 flex min-w-35 items-center justify-center gap-1.5 h-9 rounded-[14px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <FiEdit3 size={14} className="text-white/50" />
                      <span className="font-raleway font-bold text-[12px] text-white/50">
                        Request Changes
                      </span>
                    </button>

                    {/* Functional Dropdown Menu */}
                    <div className="relative shrink-0">
                      <button
                        onClick={() => toggleDropdown(collab.id)}
                        className={`w-10 h-9 rounded-[14px] border flex items-center justify-center transition-colors ${
                          isDropdownOpen
                            ? "bg-white/15 border-white/30"
                            : "border-white/25 hover:bg-white/5"
                        }`}
                      >
                        <FiMoreHorizontal
                          size={16}
                          className={
                            isDropdownOpen ? "text-white" : "text-white/40"
                          }
                        />
                      </button>

                      {/* Dropdown Menu Modal */}
                      {isDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40 bg-black/15 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
                            onClick={() => setActiveDropdownId(null)}
                          />
                          {/* Menu Container */}
                          <div className="fixed bottom-0 left-0 right-0 z-999 flex flex-col bg-black/80 border-t md:border border-white/10 rounded-t-6 md:rounded-xl pb-6 md:pb-0 pt-2 md:pt-0 shadow-2xl md:absolute md:right-0 md:top-full md:bottom-auto md:left-auto md:mt-2 md:w-52.5 animate-slide-up md:animate-fade-in md:backdrop-blur-xl">
                            {/* Mobile Drag Indicator */}
                            <div className="w-9 h-1 bg-white/10 rounded-full mx-auto my-3 md:hidden" />
                            <button
                              className="w-full flex items-center gap-2.5 px-4 py-3.5 text-[13px] text-white/70 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5"
                              onClick={() => {
                                /* View Notes Logic */ setActiveDropdownId(
                                  null,
                                );
                              }}
                            >
                              <FiMessageSquare size={14} />
                              <span className="font-raleway font-medium">
                                View Request Notes
                              </span>
                            </button>

                            {!isApproved && (
                              <button
                                className="w-full flex items-center gap-2.5 px-4 py-3.5 text-[13px] text-white/70 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5"
                                onClick={() => {
                                  /* Send Reminder Logic */ setActiveDropdownId(
                                    null,
                                  );
                                }}
                              >
                                <FiBell size={14} />
                                <span className="font-raleway font-medium">
                                  Send Reminder
                                </span>
                              </button>
                            )}

                            <button
                              className="w-full flex items-center gap-2.5 px-4 py-3.5 text-[13px] text-accent-pink/80 hover:bg-accent-pink/10 hover:text-accent-pink transition-colors"
                              onClick={() => {
                                /* Remove Collaborator Logic */ setActiveDropdownId(
                                  null,
                                );
                              }}
                            >
                              <FiTrash2 size={14} />
                              <span className="font-raleway font-medium">
                                Remove Collaborator
                              </span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0 mt-12 pt-6 border-t border-white/5">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full sm:w-auto opacity-50 hover:opacity-100 hover:bg-white/10"
          icon={FiArrowLeft}
          iconPosition="left"
        >
          Back
        </Button>

        <Button
          variant="primary"
          onClick={onContinueToFunding}
          className="w-full sm:w-auto rounded-full shadow-btn-primary"
          icon={FiArrowRight}
          iconPosition="right"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

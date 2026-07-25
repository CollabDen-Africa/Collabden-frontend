"use client";

import React from "react";
import { HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  documentType: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface VerificationTableProps {
  requests: VerificationRequest[];
  isLoading: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const VerificationTable: React.FC<VerificationTableProps> = ({
  requests,
  isLoading,
  onApprove,
  onReject,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60 text-sm font-medium tracking-wide">Loading identity verification requests...</p>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="w-full py-16 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-center px-6">
        <HiClock size={36} className="text-white/30" />
        <h3 className="text-lg font-bold text-white">No Verification Requests</h3>
        <p className="text-white/40 text-sm max-w-sm">There are no pending identity verification documents to review at this time.</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden shadow-lg">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left text-sm text-white/80">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-white/40 text-xs font-semibold uppercase tracking-wider text-nowrap">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Document Type</th>
              <th className="px-6 py-4">Submitted Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">{req.userName}</span>
                    <span className="text-white/40 text-xs">{req.userEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/70 font-mono text-xs uppercase">{req.documentType}</td>
                <td className="px-6 py-4 text-white/50 text-xs text-nowrap">
                  {new Date(req.submittedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    req.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                    req.status === "REJECTED" ? "bg-red-500/10 text-red-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onApprove && (
                      <button
                        onClick={() => onApprove(req.id)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                        title="Approve verification"
                      >
                        <HiCheckCircle size={18} />
                      </button>
                    )}
                    {onReject && (
                      <button
                        onClick={() => onReject(req.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Reject verification"
                      >
                        <HiXCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerificationTable;

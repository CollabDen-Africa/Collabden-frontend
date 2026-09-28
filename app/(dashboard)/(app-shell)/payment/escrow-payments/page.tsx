"use client";
import React from "react";
import { FiLock } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import { useEscrow } from "@/hooks/escrow/useEscrow"; 

export default function EscrowPaymentsPage() {
  // Fetch live escrow data
  const { usePersonalEscrowPayments } = useEscrow();
  const { data: escrowData, isLoading } = usePersonalEscrowPayments();
  
  // Extract data safely 
  const escrowProjects = escrowData?.data || escrowData || [];

  // Format currency dynamically
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Status-based styling for the milestone indicator dots
  const getDotStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAYMENT_RELEASED":
      case "APPROVED":
        return "bg-primary-green shadow-[0_0_8px_rgba(115,191,68,0.4)]";
      case "IN_PROGRESS":
      case "SUBMITTED":
      case "AWAITING_REVIEW":
        return "bg-primary-blue shadow-[0_0_8px_rgba(32,79,153,0.4)]";
      case "DISPUTED":
        return "bg-accent-red-alt shadow-[0_0_8px_rgba(212,24,61,0.4)]";
      case "PENDING":
      default:
        return "bg-white/80 border border-primary-blue/20";
    }
  };

  // Formatted label mapping
  const formatStatusLabel = (status: string) => {
    return status?.replace(/_/g, " ").toLowerCase() || "pending";
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-5 lg:px-0">
      {/* Escrow Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7.5 w-full pb-10">
        {escrowProjects.length === 0 ? (
          <div className="xl:col-span-2">
            <EmptyState
              icon={<FiLock size={32} strokeWidth={1.5} />}
              title="No Escrow Payments"
              description="You currently have no active escrow milestones or projects."
            />
          </div>
        ) : (
          escrowProjects.map((project: any) => {
            // Using releasedAmount and totalAmount
            const progressPercent = project.totalAmount > 0 
              ? Math.round(((project.releasedAmount || 0) / project.totalAmount) * 100) 
              : 0;

            return (
              <div
                key={project.id}
                className="flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[50px] p-6 lg:p-10 shadow-xl shadow-primary-blue/5 transition-transform hover:-translate-y-1 duration-300"
              >
                {/* Card Header */}
                <div className="flex flex-col gap-1 mb-7.5">
                  <h2 className="font-raleway font-semibold text-[20px] lg:text-[24px] leading-8.25 text-white">
                    {project.title || `Project #${project.projectId?.slice(-4)}`}
                  </h2>
                  <p className="font-raleway font-normal text-[15px] lg:text-[16px] leading-6 text-white/60">
                    Client: {project.clientName || "Unknown Client"}
                  </p>
                </div>

                {/* Progress Section */}
                <div className="flex flex-col w-full mb-10">
                  <div className="flex justify-between items-center w-full mb-2.5">
                    <span className="font-raleway font-normal text-[15px] lg:text-[16px] text-white/60">
                      Progress
                    </span>
                    <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                      {formatCurrency(project.releasedAmount || 0)} <span className="font-medium text-white/80">/ {formatCurrency(project.totalAmount)}</span>
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full h-2.5 bg-white/30 rounded-full overflow-hidden shadow-inner border border-white/30 mb-2.5">
                    {/* Progress Bar Fill */}
                    <div
                      className="h-full bg-primary-green rounded-full transition-all duration-1000 ease-in-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Progress Percentage */}
                  <span className="font-raleway font-medium text-[13px] lg:text-[14px] text-white/60">
                    {progressPercent}% completed
                  </span>
                </div>

                {/* Milestones List */}
                <div className="flex flex-col w-full">
                  <h3 className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white/90 mb-4">
                    Milestones
                  </h3>

                  <div className="flex flex-col gap-3 w-full">
                    {project.milestones?.map((milestone: any) => (
                      <div
                        key={milestone.id}
                        className="flex items-center justify-between w-full bg-black/10 backdrop-blur-md border border-white/30 rounded-[20px] lg:rounded-[30px] p-4 lg:p-5 hover:bg-white/10 transition-colors"
                      >
                        {/* Left: Dot & Info */}
                        <div className="flex items-center gap-[16px]">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotStyle(milestone.status)}`} />

                          <div className="flex flex-col gap-0.5">
                            <span className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/80">
                              {milestone.title}
                            </span>
                            <span className="font-raleway font-medium text-[13px] lg:text-[14px] text-white/50 capitalize">
                              {formatStatusLabel(milestone.status)}
                            </span>
                          </div>
                        </div>

                        {/* Right: Amount */}
                        <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                          {formatCurrency(milestone.amount)}
                        </span>
                      </div>
                    ))}
                    
                    {(!project.milestones || project.milestones.length === 0) && (
                      <span className="font-raleway text-[14px] text-white/50">No milestones configured yet.</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
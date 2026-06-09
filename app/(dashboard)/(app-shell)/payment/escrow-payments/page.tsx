"use client";

import React from "react";

// --- MOCK DATA ---
const MOCK_ESCROW_PROJECTS: any[] = [
  {
    id: "escrow-001",
    title: "Brand Identity Design",
    client: "Marcus Chen",
    totalAmount: 5000,
    paidAmount: 2500,
    milestones: [
      { id: "m1", title: "Initial Concepts", status: "released", amount: 1250 },
      { id: "m2", title: "Refinements", status: "released", amount: 1250 },
      { id: "m3", title: "Final Delivery", status: "pending", amount: 2500 },
    ],
  },
  {
    id: "escrow-002",
    title: "Website Redesign",
    client: "Sarah Williams",
    totalAmount: 8000,
    paidAmount: 4000,
    milestones: [
      { id: "m4", title: "Wireframes", status: "released", amount: 2000 },
      { id: "m5", title: "Design System", status: "released", amount: 2000 },
      { id: "m6", title: "Page Designs", status: "processing", amount: 2000 },
      { id: "m7", title: "Development Support", status: "pending", amount: 2000 },
    ],
  },
];

export default function EscrowPaymentsPage() {
  
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
    switch (status.toLowerCase()) {
      case "released":
        return "bg-primary-green shadow-[0_0_8px_rgba(115,191,68,0.4)]";
      case "processing":
        return "bg-primary-blue shadow-[0_0_8px_rgba(32,79,153,0.4)]";
      case "pending":
      default:
        return "bg-white/80 border border-primary-blue/20";
    }
  };

  return (
    <div className="flex flex-col w-full px-[20px] lg:px-0">
      
      {/* Escrow Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[30px] w-full pb-[40px]">
        {MOCK_ESCROW_PROJECTS.map((project) => {
          const progressPercent = Math.round((project.paidAmount / project.totalAmount) * 100);

          return (
            <div 
              key={project.id}
              className="flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[50px] p-[24px] lg:p-[40px] shadow-xl shadow-primary-blue/5 transition-transform hover:-translate-y-1 duration-300"
            >
              
              {/* Card Header */}
              <div className="flex flex-col gap-[4px] mb-[30px]">
                <h2 className="font-raleway font-semibold text-[20px] lg:text-[24px] leading-[33px] text-white">
                  {project.title}
                </h2>
                <p className="font-raleway font-normal text-[15px] lg:text-[16px] leading-[24px] text-white/60">
                  Client: {project.client}
                </p>
              </div>

              {/* Progress Section */}
              <div className="flex flex-col w-full mb-[40px]">
                
                {/* Progress Text */}
                <div className="flex justify-between items-center w-full mb-[10px]">
                  <span className="font-raleway font-normal text-[15px] lg:text-[16px] text-white/60">
                    Progress
                  </span>
                  <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                    {formatCurrency(project.paidAmount)} <span className="font-medium text-white/80">/ {formatCurrency(project.totalAmount)}</span>
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-[10px] bg-white/30 rounded-full overflow-hidden shadow-inner border border-white/30 mb-[10px]">
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
                <h3 className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white/90 mb-[16px]">
                  Milestones
                </h3>
                
                <div className="flex flex-col gap-[12px] w-full">
                  {project.milestones.map((milestone) => (
                    <div 
                      key={milestone.id}
                      className="flex items-center justify-between w-full bg-black/10 backdrop-blur-md border border-white/30 rounded-[20px] lg:rounded-[30px] p-[16px] lg:p-[20px] hover:bg-accent-green-bright/20 transition-colors"
                    >
                      
                      {/* Left: Dot & Info */}
                      <div className="flex items-center gap-[16px]">
                        <div className={`w-[10px] h-[10px] rounded-full shrink-0 ${getDotStyle(milestone.status)}`} />
                        
                        <div className="flex flex-col gap-[2px]">
                          <span className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/80">
                            {milestone.title}
                          </span>
                          <span className="font-raleway font-medium text-[13px] lg:text-[14px] text-white/50 capitalize">
                            {milestone.status}
                          </span>
                        </div>
                      </div>

                      {/* Right: Amount */}
                      <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                        {formatCurrency(milestone.amount)}
                      </span>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
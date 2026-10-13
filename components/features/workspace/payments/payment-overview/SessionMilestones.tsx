"use client";
import { FiCheckCircle, FiClock, FiLock } from "react-icons/fi";

interface SessionMilestonesProps {
  currencySymbol?: string;
  milestones?: any[];
}


export default function SessionMilestones({ currencySymbol = "₦", milestones = [] }: SessionMilestonesProps) {
  const formatAmount = (val: number) => `${currencySymbol}${val.toLocaleString()}`;

  const getStatusConfig = (status: string) => {
      switch (status) {
        case "PAYMENT_RELEASED":
          return { label: "Funds Released", colorClass: "text-primary-green", bgClass: "bg-primary-green", icon: FiCheckCircle, bgBadge: "bg-primary-green/10", borderBadge: "border-primary-green/20" };
        case "AWAITING_REVIEW":
        case "SUBMITTED":
          return { label: "Awaiting Sign-off", colorClass: "text-accent-yellow", bgClass: "bg-accent-yellow", icon: FiClock, bgBadge: "bg-accent-yellow/10", borderBadge: "border-accent-yellow/20" };
        default:
          return { label: "Locked in Escrow", colorClass: "text-white/60", bgClass: "bg-white/60", icon: FiLock, bgBadge: "bg-white/5", borderBadge: "border-white/10" };
      }
    };
  
    if (!milestones.length) return null;

  return (
    <div className="w-full flex flex-col gap-4 mt-10">
      <div>
        <h2 className="font-raleway font-semibold text-[20px] text-white">Session Milestones</h2>
        <p className="font-raleway text-[16px] text-text-muted">Track production milestones and escrow release status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {milestones.map((milestone) => {
          const config = getStatusConfig(milestone.status);
          const Icon = config.icon;
          const formattedDate = milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD";

          return (
            <div key={milestone.id} className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col gap-5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${milestone.bgClass}`} />
                <h4 className="font-raleway font-semibold text-[17px] text-white">{milestone.title}</h4>
              </div>

              <div className={`mt-auto w-max px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${config.bgBadge} ${config.borderBadge}`}>
                <Icon size={12} className={config.colorClass} />
                <span className={`font-raleway font-medium text-[13px] ${config.colorClass}`}>
                 {config.label}
                </span>
              </div>
            
              <div className="flex flex-col gap-2">
                <span className="font-raleway font-bold text-[25px] text-white">{formatAmount(milestone.amount)}</span>
                <span className="font-raleway text-[13px] text-white/60">Deadline: {formattedDate}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
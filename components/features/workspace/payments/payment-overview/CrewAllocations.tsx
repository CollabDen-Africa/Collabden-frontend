"use client";
import Avatar from "@/components/ui/Avatar";

interface CrewAllocationsProps {
  currencySymbol?: string;
}

const CREW = [
  { 
    id: 1, 
    name: "Samuel Okeke", 
    role: "Lead Vocalist & Arranger", 
    status: "Partial Payout", 
    allocated: 800000, 
    paid: 400000, 
    progress: 50, 
    statusColorClass: "text-secondary-blue", 
    bgBadge: "bg-primary-blue/10", 
    borderBadge: "border-primary-blue/20" 
  },
  { 
    id: 2, 
    name: "Chinedu Okafor", 
    role: "Beat Producer", 
    status: "Fully Paid Out", 
    allocated: 1200000, 
    paid: 1200000, 
    progress: 100, 
    statusColorClass: "text-primary-green", 
    bgBadge: "bg-primary-green/10", 
    borderBadge: "border-primary-green/20" 
  },
  { 
    id: 3, 
    name: "Amara Nwosu", 
    role: "Session Guitarist", 
    status: "Fully Paid Out", 
    allocated: 600000, 
    paid: 600000, 
    progress: 100, 
    statusColorClass: "text-primary-green", 
    bgBadge: "bg-primary-green/10", 
    borderBadge: "border-primary-green/20" 
  },
  { 
    id: 4, 
    name: "Tunde Adeyemi", 
    role: "Mix & Mastering Engineer", 
    status: "Payout Pending", 
    allocated: 950000, 
    paid: 0, 
    progress: 0, 
    statusColorClass: "text-white/60", 
    bgBadge: "bg-white/5", 
    borderBadge: "border-white/10" 
  },
];

export default function CrewAllocations({ currencySymbol = "₦" }: CrewAllocationsProps) {
  const formatAmount = (val: number) => `${currencySymbol}${val.toLocaleString()}`;

  return (
    <div className="w-full flex flex-col gap-4 mt-10 mb-15">
      <div>
        <h2 className="font-raleway font-semibold text-[20px] text-white">Artist & Crew Allocations</h2>
        <p className="font-raleway text-[16px] text-text-muted">Royalty splits and payout status for each collaborator.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                {CREW.map((member) => (
                  <div key={member.id} className="bg-black/15 border border-white/5 rounded-6 md:rounded-[30px] p-5 md:p-6 flex flex-col gap-5 backdrop-blur-md">
                    
                    {/* Avatar, Info & Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Profile */}
                      <div className="flex items-center gap-3.5">
                        <Avatar name={member.name} className="w-11.5 h-11.5 md:w-12.5 md:h-12.5 shrink-0 text-[14px] md:text-[16px]" />
                        <div className="flex flex-col">
                          <h4 className="font-raleway font-bold text-[15px] md:text-[17px] text-white leading-snug">{member.name}</h4>
                          <span className="font-raleway text-[13px] md:text-[14px] text-white/60">{member.role}</span>
                        </div>
                      </div>
      
                      {/* Status Badge */}
                      <div className={`w-max px-3 py-1.5 rounded-full border flex items-center justify-center shrink-0 ${member.bgBadge} ${member.borderBadge}`}>
                         <span className={`font-raleway font-bold text-[10px] md:text-[11px] uppercase tracking-[0.5px] ${member.statusColorClass}`}>
                           {member.status}
                         </span>
                      </div>
                    </div>
      
                    {/* Bottom Row: Enclosed Stats & Progress */}
                    <div className="bg-black/20 border border-white/5 rounded-[20px] p-4 md:p-5 flex flex-col mt-auto">
                      
                      {/* Financial Numbers */}
                      <div className="flex flex-col gap-3 mb-5">
                        <div className="flex justify-between items-center w-full pb-2.5 border-b border-white/5">
                          <span className="font-raleway font-medium text-[13px] md:text-[14px] text-text-muted">Allocated Budget</span>
                          <span className="font-raleway font-bold text-[14px] md:text-[15px] text-white">{formatAmount(member.allocated)}</span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="font-raleway font-medium text-[13px] md:text-[14px] text-text-muted">Amount Paid</span>
                          <span className={`font-raleway font-bold text-[14px] md:text-[15px] ${member.progress > 0 ? 'text-primary-green' : 'text-white/60'}`}>
                            {formatAmount(member.paid)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-raleway font-bold text-[10px] text-text-muted/50 uppercase tracking-[1px]">Payout Progress</span>
                          <span className="font-raleway font-bold text-[12px] text-white/70">{member.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${member.progress === 100 ? 'bg-primary-green' : member.progress > 0 ? 'bg-secondary-blue' : 'bg-transparent'}`}
                            style={{ width: `${member.progress}%` }} 
                          />
                        </div>
                      </div>
      
                    </div>
      
                  </div>
                ))}
              </div>
          </div>
        );
      }
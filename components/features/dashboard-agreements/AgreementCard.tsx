import React from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { FiClock, FiFileText, FiDownload, FiEye } from "react-icons/fi";

export type AgreementStatus = "pending" | "signed" | "expired";

export interface AgreementData {
  id: string;
  title: string;
  project: string;
  createdDate: string;
  lastUpdated: string;
  collaboratorsCount: number;
  collaborators: { id: string; name: string; image?: string }[];
  status: AgreementStatus;
  completedSignatures: number;
  totalSignatures: number;
}

interface AgreementCardProps {
  agreement: AgreementData;
  onTriggerSign?: (agreement: AgreementData) => void;
  onDownload?: (agreement: AgreementData) => void;
  onView?: (agreement: AgreementData) => void;
}

const AgreementCard: React.FC<AgreementCardProps> = ({
  agreement,
  onTriggerSign,
  onDownload,
  onView
}) => {
 
  const progressPercent = agreement.totalSignatures === 0 
    ? 0 
    : Math.round((agreement.completedSignatures / agreement.totalSignatures) * 100);

  // Dynamic Status Styles for Dashboard feature mapping
  const statusStyles = {
    pending: {
      container: "bg-accent-yellow/20 border-accent-yellow",
      text: "text-accent-yellow",
      label: "Pending Signature",
    },
    signed: {
      container: "bg-primary-green/20 border-primary-green",
      text: "text-primary-green",
      label: "Signed",
    },
    expired: {
      container: "bg-accent-red/20 border-accent-red",
      text: "text-accent-red",
      label: "Expired",
    },
  };

  const currentStyle = statusStyles[agreement.status];

  return (
    <div className="flex flex-col w-full bg-black/10 border border-white/10 rounded-[30px] px-8 py-6 backdrop-blur-md transition-all duration-300">
      
      {/* TOP ROW: Title & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-4">
        
        {/* Left: Title & Info */}
        <div className="flex flex-col gap-2 mb-3 xl:mb-0">
          <div className="flex items-center gap-1 lg:gap-2 mb-2 xl:mb-1">
            <div className="bg-black/20 p-2.5 rounded-sm">
              <FiFileText size={20} />
            </div>
          <h2 className="font-raleway font-bold text-[20px] lg:text-[24px] text-white leading-tight">
            {agreement.title}
            </h2>
          </div>
          <div className="flex lg:flex-col sm:flex-row sm:items-center lg:items-start gap-1 sm:gap-4 mb-3.5 lg:mb-5 lg:ml-12.5">
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Project: <span className="text-white">{agreement.project}</span>
            </span>
            <span className="lg:hidden sm:block text-white/30">•</span>
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Created: <span className="text-white">{agreement.createdDate}</span>
            </span>
          </div>
          
          {/* Avatar Group & Sign Button Row */}
          <div className="flex flex-wrap items-start gap-4 lg:gap-8 lg:ml-11 mb-2 xl:mb-0">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {agreement.collaborators.slice(0, 3).map((collab) => (
                  <div key={collab.id} className="relative w-7 h-7 rounded-full border-2 border-primary-green overflow-hidden z-1">
                    <Avatar name={collab.name} src={collab.image} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="font-raleway font-medium text-[14px] lg:text-[16px] text-white/60 ml-1">
                {agreement.collaboratorsCount} collaborators
              </span>
            </div>

            {/* Sign Now Button */}
            {agreement.status === "pending" && onTriggerSign && (
              <Button 
                onClick={() => onTriggerSign(agreement)}
                className="bg-primary-green hover:bg-accent-green-success transition-colors px-[12px] py-[5px] rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
              >
                <span className="font-raleway font-semibold text-[14px] text-white">
                  Sign Now
                </span>
              </Button>
            )}

            {/* Signed State Actions */}
             {agreement.status === "signed" && (
               <div className="flex items-center gap-3">
                  {onView && (
                    <Button 
                      onClick={() => onView(agreement)}
                      className=" px-[12px] py-[5px] rounded-full flex items-center gap-1.5"
                              >
                                <FiEye size={14} className="text-white" />
                                <span className="font-raleway font-semibold text-[14px] text-white">
                                  View
                                </span>
                              </Button>
                            )}
                            {onDownload && (
                              <Button 
                                onClick={() => onDownload(agreement)}
                                className="px-[12px] py-[5px] rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)] flex items-center gap-1.5"
                              >
                                <FiDownload size={14} className="text-white" />
                                <span className="font-raleway font-semibold text-[14px] text-white">
                                  Download
                                </span>
                              </Button>
                            )}
                          </div>
                        )}
          </div>
        </div>

        {/* Right: Status Pill */}
        <div className="flex flex-wrap items-start gap-4 lg:gap-8">
          <div className={`flex items-center justify-start border px-9 py-4 rounded-full shrink-0 lg:-mt-18.75 ${currentStyle.container}`}>
            <span className={`font-inter font-medium text-[10px] lg:text-[11px] tracking-wider leading-none mt-px ${currentStyle.text}`}>
              {currentStyle.label}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col w-full gap-2 mb-8">
        <div className="flex justify-between items-center w-full">
          <span className="font-raleway font-medium text-[14px] text-text-muted">
            Signatories
          </span>
          <div className="flex items-center gap-3">
            <span className="font-raleway font-semibold text-[14px] text-white">
              {agreement.completedSignatures} of {agreement.totalSignatures} Completed
            </span>
          </div>
        </div>

        <div className="w-full h-1.75 bg-white/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-green transition-all duration-1000 ease-in-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-text-muted px-2 py-1.25">
          <FiClock size={12} />
          <span className="font-raleway font-medium text-[12px]">
            Updated {agreement.lastUpdated}
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default AgreementCard;
import React from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { FiClock, FiFileText, FiDownload, FiEye } from "react-icons/fi";
import { LegalAgreement } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects"; 

interface AgreementCardProps {
  agreement: LegalAgreement;
  onTriggerSign?: (agreement: LegalAgreement) => void;
  onDownload?: (agreement: LegalAgreement) => void;
  onView?: (agreement: LegalAgreement) => void;
}

const AgreementCard: React.FC<AgreementCardProps> = ({
  agreement,
  onTriggerSign,
  onDownload,
  onView
}) => {
  const { useProjectDetail } = useProjects();
  const { data: projectData } = useProjectDetail(agreement.projectId);
  
  const project = projectData || { collaborators: [], name: "Loading..." };

  const signatures = agreement.signatures || [];
  const completedSignatures = signatures.length;
  // If the project data is loaded, we can use the actual collaborator count for the total
  const totalSignatures = project.collaborators?.length > 0 ? project.collaborators.length : Math.max(completedSignatures, 2); 
  const progressPercent = Math.round((completedSignatures / totalSignatures) * 100);

  const createdDate = new Date(agreement.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const lastUpdated = new Date(agreement.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const statusStyles: Record<string, { container: string; text: string; label: string }> = {
    DRAFT: {
      container: "bg-white/10 border-white/20",
      text: "text-white/60",
      label: "Draft",
    },
    PENDING_SIGNATURE: {
      container: "bg-accent-yellow/20 border-accent-yellow",
      text: "text-accent-yellow",
      label: "Pending Signature",
    },
    SIGNED: {
      container: "bg-primary-green/20 border-primary-green",
      text: "text-primary-green",
      label: "Signed",
    },
  };

  const currentStyle = statusStyles[agreement.status] || statusStyles.DRAFT;

  return (
    <div className="flex flex-col w-full bg-black/10 border border-white/10 rounded-[30px] px-8 py-6 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-4">
        
        <div className="flex flex-col gap-2 mb-3 xl:mb-0">
          <div className="flex items-center gap-1 lg:gap-2 mb-2 xl:mb-1">
            <div className="bg-black/20 p-2.5 rounded-sm">
              <FiFileText size={20} />
            </div>
            <h2 className="font-raleway font-bold text-[20px] lg:text-[24px] text-white leading-tight">
              {agreement.title || "Untitled Agreement"}
            </h2>
          </div>
          <div className="flex lg:flex-col sm:flex-row sm:items-center lg:items-start gap-1 sm:gap-4 mb-3.5 lg:mb-5 lg:ml-12.5">
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Project: <span className="text-white">{project.name || agreement.projectId.slice(-6).toUpperCase()}</span>
            </span>
            <span className="lg:hidden sm:block text-white/30">•</span>
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Created: <span className="text-white">{createdDate}</span>
            </span>
          </div>
          
          <div className="flex flex-wrap items-start gap-4 lg:gap-8 lg:ml-11 mb-2 xl:mb-0">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {signatures.slice(0, 3).map((sig) => {
                  // Cross-reference the signature userId with the project collaborators to get the avatar
                  const matchedCollaborator = project.collaborators?.find((c: any) => c.userId === sig.userId);
                  const avatarUrl = matchedCollaborator?.user?.avatarUrl;

                  return (
                    <div key={sig.id} className="relative w-7 h-7 rounded-full border-2 border-primary-green overflow-hidden z-1 bg-primary-blue flex items-center justify-center">
                      {avatarUrl ? (
                        <Avatar 
                          name={sig.legalName} 
                          src={avatarUrl} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-white">
                          {sig.legalName?.slice(0, 2).toUpperCase() || "??"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="font-raleway font-medium text-[14px] lg:text-[16px] text-white/60 ml-1">
                {completedSignatures} of {totalSignatures} signed
              </span>
            </div>

            {agreement.status === "PENDING_SIGNATURE" && onTriggerSign && (
              <Button 
                onClick={() => onTriggerSign(agreement)}
                className="bg-primary-green hover:bg-accent-green-success transition-colors px-3 py-1.25 rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
              >
                <span className="font-raleway font-semibold text-[14px] text-white">Sign Now</span>
              </Button>
            )}

            {agreement.status === "SIGNED" && (
              <div className="flex items-center gap-3">
                {onView && (
                  <Button 
                    onClick={() => onView(agreement)}
                    className="px-3 py-1.25 rounded-full flex items-center gap-1.5"
                  >
                    <FiEye size={14} className="text-white" />
                    <span className="font-raleway font-semibold text-[14px] text-white">View</span>
                  </Button>
                )}
                {onDownload && agreement.fileUrl && (
                  <Button 
                    onClick={() => onDownload(agreement)}
                    className="px-3 py-1.25 rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)] flex items-center gap-1.5 bg-white/10"
                  >
                    <FiDownload size={14} className="text-white" />
                    <span className="font-raleway font-semibold text-[14px] text-white">Download</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-4 lg:gap-8">
          <div className={`flex items-center justify-start border px-9 py-4 rounded-full shrink-0 lg:-mt-18.75 ${currentStyle.container}`}>
            <span className={`font-inter font-medium text-[10px] lg:text-[11px] tracking-wider leading-none mt-px ${currentStyle.text}`}>
              {currentStyle.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-2 mb-8">
        <div className="flex justify-between items-center w-full">
          <span className="font-raleway font-medium text-[14px] text-white/50">Signatories</span>
          <div className="flex items-center gap-3">
            <span className="font-raleway font-semibold text-[14px] text-white">
              {completedSignatures} of {totalSignatures} Completed
            </span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-green transition-all duration-1000 ease-in-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-white/50 px-2 mt-1">
          <FiClock size={12} />
          <span className="font-raleway font-medium text-[12px]">Updated {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default AgreementCard;
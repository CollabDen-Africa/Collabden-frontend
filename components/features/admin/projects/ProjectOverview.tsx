import React from "react";
import { InfoCard, InfoRow } from "../users/UserOverview";

export const ProjectOverview: React.FC<{ project: any }> = ({ project }) => {
  const ownerName = project.owner?.displayName || `${project.owner?.firstName || ''} ${project.owner?.lastName || ''}`.trim() || 'Unknown';
  
  return (
    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0a0a0c]">
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <InfoCard title="PROJECT DETAILS">
          <InfoRow label="Project ID" value={`PRJ-${project.id.substring(project.id.length - 4)}`} />
          <InfoRow label="Genre" value={project.genre} />
          <InfoRow label="Visibility" value={project.visibility} />
          <InfoRow label="Date Created" value={new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
          <InfoRow label="Last Updated" value={new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
          <InfoRow label="Track Count" value={`${project._count?.tasks || 0} tracks`} />
        </InfoCard>

        <InfoCard title="OWNER">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-sm">
              {ownerName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">{ownerName}</span>
              <span className="text-white/40 text-xs mt-0.5">USR-{project.owner?.id?.substring(project.owner.id.length - 4)} · Verified</span>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Column 2 */}
      <InfoCard title={`COLLABORATORS (${project.collaborators?.length || 0})`}>
        {project.collaborators && project.collaborators.length > 0 ? (
          project.collaborators.map((collab: any, index: number) => {
            const collabName = collab.user?.displayName || `${collab.user?.firstName || ''} ${collab.user?.lastName || ''}`.trim() || 'Unknown';
            const role = collab.contributionRole || 'Collaborator';
            
            // Map roles to colors
            const getRoleColor = (r: string) => {
              const lower = r.toLowerCase();
              if (lower.includes('produc')) return 'bg-blue-500/10 text-blue-500';
              if (lower.includes('vocal')) return 'bg-purple-500/10 text-purple-400';
              if (lower.includes('engin')) return 'bg-emerald-500/10 text-emerald-500';
              if (lower.includes('song')) return 'bg-yellow-500/10 text-yellow-500';
              return 'bg-white/5 text-white/60';
            };

            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 font-bold text-[10px]">
                    {collabName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-white font-medium text-sm">{collabName}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getRoleColor(role)}`}>
                  {role}
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-white/40 text-sm">No active collaborators.</span>
        )}
      </InfoCard>

      {/* Column 3 */}
      <div className="flex flex-col gap-6">
        <InfoCard title="PAYMENT STATUS">
          <InfoRow label="Escrow Total" value="$0" valueClassName="text-emerald-500 font-bold" />
          <InfoRow label="Released" value="$0" valueClassName="text-emerald-500 font-bold" />
          <InfoRow label="Pending" value="$0" valueClassName="text-yellow-500 font-bold" />
          <InfoRow label="Payment Status" value="N/A" valueClassName="text-white font-medium" />
          <InfoRow label="Agreements" value={`${project._count?.agreements || 0} Signed`} valueClassName="text-[#72c043] font-medium" />
        </InfoCard>

        <InfoCard title="TIMELINE">
          <InfoRow label="Start Date" value={new Date(project.startDate || project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
          <InfoRow label="Target End" value={project.endDate ? new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : 'TBD'} />
          <InfoRow label="Duration" value="-" />
        </InfoCard>
      </div>
    </div>
  );
};

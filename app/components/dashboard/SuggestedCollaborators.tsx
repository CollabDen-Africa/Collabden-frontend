import React from 'react';
import CollaboratorItem from './CollaboratorItem';

// Data structure
export interface SuggestedCollaborator {
  id: number;
  name: string;
  role: string;
  members: number;
  rating: string;
  avatarUrl?: string;
}


export default function SuggestedCollaboratorsPanel({ collaborators = [] }: { collaborators?: SuggestedCollaborator[] }) {
  return (
    <section className="w-full bg-black/10 rounded-[30px] p-[28px] xl:p-[32px] flex flex-col gap-[32px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
      <h2 className="font-semibold text-[18px] leading-[21px] text-foreground">
        Suggested Collaborators
      </h2>
      
      <div className="flex flex-col gap-[32px]">
        {collaborators.map((collab) => (
          <CollaboratorItem key={collab.id} {...collab} />
        ))}

        {/* Empty array */}
        {collaborators.length === 0 && (
          <p className="text-foreground/40 text-sm italic text-center">
            No suggested collaborators at this time.
          </p>
        )}
      </div>
      
    </section>
  );
}
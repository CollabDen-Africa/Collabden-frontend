import React from 'react';
import CollaboratorItem from './CollaboratorItem';
import Skeleton from '@/components/ui/Skeleton';

// Data structure
export interface SuggestedCollaborator {
  id: string | number;
  userId?: string;
  name: string;
  role: string;
  members?: number;
  rating?: string;
  avatarUrl?: string;
}

interface Props {
  collaborators?: SuggestedCollaborator[];
  isLoading?: boolean;
}

export default function SuggestedCollaboratorsPanel({ collaborators = [], isLoading = false }: Props) {
  return (
    <section className="w-full bg-black/10 rounded-[30px] p-[28px] xl:p-[32px] flex flex-col gap-[32px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
      <h2 className="font-semibold text-[18px] leading-[21px] text-foreground">
        Suggested Collaborators
      </h2>

      <div className="flex flex-col gap-[32px]">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-13.75 h-13.75 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))
        ) : (
          <>
            {collaborators.map((collab) => (
              <CollaboratorItem key={collab.id} {...collab} />
            ))}

            {/* Empty array */}
            {collaborators.length === 0 && (
              <p className="text-foreground/40 text-sm italic text-center">
                No suggested collaborators at this time.
              </p>
            )}
          </>
        )}
      </div>

    </section>
  );
}

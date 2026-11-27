import React from 'react';
import { useRouter } from 'next/navigation';
import SuggestedProjectItem from './SuggestedProjectsItem';
import Skeleton from '@/components/ui/Skeleton';

// Data structure
export interface SuggestedProject {
  id: string | number;
  title: string;
  needs: string;
  members: number;
  tags: string[];
}

interface Props {
  projects?: SuggestedProject[];
  isLoading?: boolean;
}

export default function SuggestedProjectsPanel({ projects = [], isLoading = false }: Props) {
  const router = useRouter();
  const handleProjectClick = (projectId: string | number) => {
      // Pushes to the marketplace and passes the ID in the URL so the marketplace knows what to open
      router.push(`/marketplace?tab=projects&projectId=${projectId}`);
    };


  return (
    <section className="flex flex-col gap-[32px] md:gap-[48px] w-full max-w-[615px] bg-black/10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md rounded-[30px] p-[28px] xl:p-[32px]">
      <h2 className="font-semibold text-[18px] leading-[21px] text-foreground">
        Suggested Projects
      </h2>

      <div className="flex flex-col gap-[32px] md:gap-[48px]">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          <>
            {projects.map((project) => (
              <SuggestedProjectItem
                key={project.id}
                title={project.title}
                needs={project.needs}
                members={project.members}
                tags={project.tags}
                onClick={() => handleProjectClick(project.id)}
              />
            ))}

            {/* Empty Array */}
            {projects.length === 0 && (
              <p className="text-foreground/40 text-sm italic">
                No suggested projects at this time.
              </p>
            )}
          </>
        )}
      </div>

    </section>
  );
}

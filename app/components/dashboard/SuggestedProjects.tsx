import React from 'react';
import SuggestedProjectItem from './SuggestedProjectsItem';

export interface SuggestedProject {
  id: number;
  title: string;
  needs: string;
  members: number;
  tags: string[];
}

const SUGGESTED_PROJECTS: SuggestedProject[] = [
  { id: 1, title: "Jazz Fusion Album", needs: "Looking for bass player", members: 3, tags: ["Jazz", "Fusion"] },
  { id: 2, title: "Lo-Fi Beats Collection", needs: "Need mixing engineer", members: 5, tags: ["Lo-fi", "Chill"] },
];

export default function SuggestedProjectsPanel() {
  return (
    <section className="flex flex-col gap-6 border border-gray-300 rounded-[30px] p-8 bg-white">
      <h2 className="font-bold text-[20px] text-black">Suggested Projects</h2>
      <div className="flex flex-col gap-8">
        {SUGGESTED_PROJECTS.map((project) => (
          <SuggestedProjectItem key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}
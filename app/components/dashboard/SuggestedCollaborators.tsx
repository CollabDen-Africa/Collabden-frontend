import React from 'react';
import CollaboratorItem from './CollaboratorItem';

export interface SuggestedCollaborator {
  id: number;
  name: string;
  role: string;
  members: number;
  rating: string;
  avatarUrl?: string;
}

const SUGGESTED_COLLABORATORS: SuggestedCollaborator[] = [
  { id: 1, name: "David Chen", role: "Mixing Engineer", members: 15, rating: "5.0", avatarUrl: "/mock-profiles/David.png" },
  { id: 2, name: "Emma Wilson", role: "Vocalist", members: 10, rating: "4.8", avatarUrl: "/mock-profiles/Tayo.png" },
  { id: 3, name: "Lizz Torres", role: "Producer", members: 8, rating: "4.8", avatarUrl: "/mock-profiles/Tayo.png" },
];

export default function SuggestedCollaboratorsPanel() {
  return (
    <section className="border border-gray-300 rounded-[30px] p-8 flex flex-col gap-8 bg-white">
      <h2 className="font-bold text-[20px] text-black">Suggested Collaborators</h2>
      <div className="flex flex-col gap-6">
        {SUGGESTED_COLLABORATORS.map((collab) => (
          <CollaboratorItem key={collab.id} {...collab} />
        ))}
      </div>
    </section>
  );
}
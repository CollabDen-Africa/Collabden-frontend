import React from 'react';

interface GenreFiltersProps {
  selectedGenre: string;
  onSelect: (g: string) => void;
}

export const GenreFilters: React.FC<GenreFiltersProps> = ({ selectedGenre, onSelect }) => {
  const genres = [
    'All Genres', 'R&B', 'Electronic', 'Hip-Hop', 'Jazz', 'Folk', 'Ambient', 'Pop', 'Classical', 'Cinematic', 'Rock'
  ];

  return (
    <div className="flex space-x-3 overflow-x-auto pb-4 custom-scrollbar lg:max-w-238.75 xl:max-w-300">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            selectedGenre === genre
              ? 'bg-primary-green text-white shadow-lg shadow-primary-green/20' 
              : 'bg-white/15 text-text-muted hover:bg-black/15 hover:text-white border border-border-muted'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};
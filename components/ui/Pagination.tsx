import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentItemsCount?: number;
  totalItems?: number;
  itemName?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  currentItemsCount,
  totalItems,
  itemName = 'items'
}) => {
  return (
    <div className="py-4 px-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01]">
      <span className="text-sm text-white/40">
        {totalItems !== undefined && currentItemsCount !== undefined ? (
          <>Showing {currentItemsCount} of {totalItems.toLocaleString()} {itemName}</>
        ) : (
          <>Page {currentPage} of {totalPages}</>
        )}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            Prev
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#72c043] text-[#0d0f10] text-sm font-bold">
            {currentPage}
          </button>
          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

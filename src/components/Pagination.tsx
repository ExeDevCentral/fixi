import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
  const visiblePages = pages.slice(start, start + 5);

  const baseClass =
    'min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all';

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-8 flex-wrap"
      aria-label="Paginación"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${baseClass} bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={`${baseClass} bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700`}>
            1
          </button>
          {visiblePages[0] > 2 && <span className="text-slate-500 text-xs px-1">…</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`${baseClass} ${
            page === currentPage
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="text-slate-500 text-xs px-1">…</span>
          )}
          <button onClick={() => onPageChange(totalPages)} className={`${baseClass} bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700`}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${baseClass} bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
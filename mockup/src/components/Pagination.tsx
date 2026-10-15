import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function pageWindow(page: number, totalPages: number): (number | "ellipsis")[] {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const items: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (prev && p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
}

export function Pagination({ page, totalPages, onPageChange, className = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = pageWindow(page, totalPages);
  const navBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors";

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Paginación">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={navBtn}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-stadio-gray dark:text-white/40">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors ${
              item === page
                ? "bg-stadio-red text-white"
                : "text-stadio-gray-dark hover:bg-stadio-gray-light dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={navBtn}
        aria-label="Página siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

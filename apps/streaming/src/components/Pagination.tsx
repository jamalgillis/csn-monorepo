"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = totalPages > 1 ? getPageNumbers() : [1];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-800">
      {/* Results info */}
      <div className="text-sm text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNumber, index) => (
            <div key={index}>
              {pageNumber === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(pageNumber as number)}
                  className={`px-3 py-2 text-sm font-medium border transition-colors ${
                    currentPage === pageNumber
                      ? "bg-red-600 text-white border-red-600"
                      : "text-gray-400 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                  }`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
          aria-label="Next page"
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
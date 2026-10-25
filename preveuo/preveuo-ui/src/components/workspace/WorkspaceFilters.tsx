import React from 'react';
import { SearchInput } from '@/components/ui';

interface WorkspaceFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const WorkspaceFilters: React.FC<WorkspaceFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-brand-purple text-white shadow-xs'
                  : 'bg-white text-body hover:text-heading border border-border-default hover:border-border-input'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="w-full md:w-72">
        <SearchInput
          placeholder="Search interactive demos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          size="sm"
        />
      </div>
    </div>
  );
};

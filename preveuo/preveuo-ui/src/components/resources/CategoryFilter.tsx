import React from 'react';
import { ResourceCategoryTab } from '@/types/resources';

interface CategoryFilterProps {
  categories: ResourceCategoryTab[];
  selectedCategory: ResourceCategoryTab;
  onSelectCategory: (cat: ResourceCategoryTab) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`
              px-4 py-2 rounded-xl text-[13.5px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer
              ${
                isSelected
                  ? 'bg-[#5B5CE2] text-white shadow-sm'
                  : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:border-[#5B5CE2] hover:text-[#5B5CE2]'
              }
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

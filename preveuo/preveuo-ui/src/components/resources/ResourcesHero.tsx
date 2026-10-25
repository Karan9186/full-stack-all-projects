import React from 'react';
import { SearchInput } from '@/components/ui';

interface ResourcesHeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const ResourcesHero: React.FC<ResourcesHeroProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="pt-16 pb-12 px-6 text-center">
      <div className="max-w-[760px] mx-auto">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-purple mb-4">
          RESOURCES & PLAYBOOKS
        </p>
        <h1 className="text-[42px] sm:text-[56px] font-extrabold tracking-[-0.035em] text-heading leading-[1.08] mb-5">
          Level up your product<br />
          storytelling.
        </h1>
        <p className="text-[16px] sm:text-[17px] text-body leading-relaxed max-w-[580px] mx-auto mb-10">
          Playbooks, tear-downs, and frameworks from product leaders using interactive demos to drive pipeline and adoption.
        </p>

        {/* Reusable SearchInput from @/components/ui */}
        <div className="max-w-md mx-auto">
          <SearchInput
            placeholder="Search articles, topics, and playbooks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            shortcut="/"
          />
        </div>
      </div>
    </section>
  );
};

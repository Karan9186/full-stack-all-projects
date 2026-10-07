import React from 'react';

const companies = [
  { letter: 'N', name: 'NORTHSTAR' },
  { letter: 'P', name: 'PULSE' },
  { letter: 'A', name: 'APERTURE' },
  { letter: 'M', name: 'MOMENTUM' },
  { letter: 'V', name: 'VERTEX' },
  { letter: 'A', name: 'ARCSTONE' },
];

export default function SocialProof() {
  return (
    <section className="py-12 bg-white border-t border-[#f0f0f4]">
      <div className="max-w-[1000px] mx-auto px-6">
        <p className="text-center text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#9ca3af] mb-7">
          Powering product stories at ambitious teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {companies.map((co) => (
            <div
              key={co.name}
              className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-lg hover:border-[#d1d5db] transition-colors group"
            >
              <div className="w-6 h-6 border border-[#d1d5db] rounded text-[10px] font-bold text-[#374151] flex items-center justify-center bg-white group-hover:border-[#9ca3af] transition-colors">
                {co.letter}
              </div>
              <span className="text-[11.5px] font-bold tracking-[0.1em] text-[#374151]">
                {co.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

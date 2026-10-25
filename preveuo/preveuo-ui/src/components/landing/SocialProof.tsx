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
    <section className="py-12 bg-white border-t border-border-light">
      <div className="max-w-[1000px] mx-auto px-6">
        <p className="text-center text-[10.5px] font-bold uppercase tracking-[0.15em] text-muted mb-7">
          Powering product stories at ambitious teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {companies.map((co) => (
            <div
              key={co.name}
              className="flex items-center gap-2 px-4 py-2 border border-border-default rounded-lg hover:border-border-input transition-colors group"
            >
              <div className="w-6 h-6 border border-border-input rounded text-[10px] font-bold text-gray-700 flex items-center justify-center bg-white group-hover:border-muted transition-colors">
                {co.letter}
              </div>
              <span className="text-[11.5px] font-bold tracking-[0.1em] text-gray-700">
                {co.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

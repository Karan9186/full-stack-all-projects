import React from 'react';

const stats = [
  {
    value: '3.2×',
    bold: 'more buyer engagement',
    sub: 'than static sales content',
  },
  {
    value: '42%',
    bold: 'faster sales cycles',
    sub: 'with self-guided demos',
  },
  {
    value: '18h',
    bold: 'saved every month',
    sub: 'per solutions engineer',
  },
  {
    value: '+27%',
    bold: 'demo-to-opportunity',
    sub: 'conversion lift',
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-white border-t border-border-light">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: label + heading + subtext */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-purple mb-4">
              Measurable Impact
            </p>
            <h2 className="text-[38px] sm:text-[46px] font-extrabold tracking-[-0.03em] text-heading leading-[1.12] mb-4">
              Built for outcomes,<br />
              not vanity metrics.
            </h2>
            <p className="text-[15px] text-body leading-relaxed max-w-[340px]">
              Connect product engagement to pipeline and turn buyer intent into your
              team's next best action.
            </p>
          </div>

          {/* Right: 2x2 stat grid with border dividers */}
          <div className="grid grid-cols-2 border border-border-default rounded-2xl overflow-hidden">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`p-7 ${
                  i === 0 ? 'border-b border-r border-border-default' :
                  i === 1 ? 'border-b border-border-default' :
                  i === 2 ? 'border-r border-border-default' : ''
                }`}
              >
                <div className="text-[42px] sm:text-[48px] font-extrabold tracking-[-0.02em] text-brand-purple leading-none mb-2">
                  {stat.value}
                </div>
                <div className="text-[13px] font-bold text-heading mb-1">
                  {stat.bold}
                </div>
                <div className="text-[12px] text-body">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

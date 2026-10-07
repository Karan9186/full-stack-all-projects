import React from 'react';
import { HotspotPoint } from '@/types/demo';

interface DemoHotspotProps {
  point: HotspotPoint;
  onClick: () => void;
}

export const DemoHotspot: React.FC<DemoHotspotProps> = ({ point, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer focus:outline-none"
      aria-label={point.title || 'Interactive Hotspot'}
    >
      {/* Outer ripple ring */}
      <span className="absolute -inset-3 rounded-full bg-[#5B5CE2]/30 animate-ping opacity-75" />

      {/* Second pulsing aura */}
      <span className="absolute -inset-1.5 rounded-full bg-[#5B5CE2]/40 animate-pulse" />

      {/* Inner core button */}
      <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#5B5CE2] text-white shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-200">
        <span className="w-2.5 h-2.5 rounded-full bg-white" />
      </span>
    </button>
  );
};

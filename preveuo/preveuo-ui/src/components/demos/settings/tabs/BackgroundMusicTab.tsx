'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DemoSettings, DemoMusicSettings } from '@/types/demo';
import { Music, Play, Pause, Volume2, Upload, AlertCircle } from 'lucide-react';

interface BackgroundMusicTabProps {
  settings: DemoSettings;
  onChange: (updates: Partial<DemoSettings>) => void;
}

const PRESET_TRACKS = [
  { id: 'calm', name: 'Calm Focus (Ambient)', url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3' },
  { id: 'momentum', name: 'Corporate Momentum', url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3' },
  { id: 'lofi', name: 'Lo-Fi Chill Work', url: 'https://assets.mixkit.co/music/preview/mixkit-chill-bro-494.mp3' },
  { id: 'upbeat', name: 'Upbeat SaaS Product Tour', url: 'https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3' },
];

export const BackgroundMusicTab: React.FC<BackgroundMusicTabProps> = ({
  settings,
  onChange,
}) => {
  const music: DemoMusicSettings = settings.music || {
    enabled: false,
    trackName: 'Calm Focus (Ambient)',
    trackUrl: PRESET_TRACKS[0].url,
    volume: 50,
    loop: true,
  };

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpdateMusic = (patch: Partial<DemoMusicSettings>) => {
    onChange({
      music: {
        ...music,
        ...patch,
      },
    });
  };

  const toggleAudioPreview = () => {
    if (!audioRef.current) {
      const audio = new Audio(music.trackUrl || PRESET_TRACKS[0].url);
      audio.volume = (music.volume ?? 50) / 100;
      audio.onended = () => setIsPlayingPreview(false);
      audioRef.current = audio;
    }

    if (isPlayingPreview) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioRef.current.src = music.trackUrl || PRESET_TRACKS[0].url;
      audioRef.current.volume = (music.volume ?? 50) / 100;
      audioRef.current.play().then(() => setIsPlayingPreview(true)).catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6 text-heading animate-fade-in max-w-2xl">
      {/* 1. Header & Enable Toggle */}
      <div className="flex items-start justify-between pb-5 border-b border-border-light">
        <div>
          <h4 className="text-sm font-bold text-heading">Background Music</h4>
          <p className="text-xs text-body mt-0.5 leading-relaxed">
            The selected background music will play in a loop as viewers interact with this demo.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={music.enabled ?? false}
            onChange={(e) => handleUpdateMusic({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple" />
        </label>
      </div>

      <div className={`space-y-5 transition-opacity duration-200 ${music.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        {/* 2. Track Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700">Select Background Music</label>
          <div className="flex items-center gap-2">
            <select
              value={music.trackUrl || PRESET_TRACKS[0].url}
              onChange={(e) => {
                const selected = PRESET_TRACKS.find((t) => t.url === e.target.value);
                handleUpdateMusic({
                  trackUrl: e.target.value,
                  trackName: selected?.name || 'Custom Track',
                });
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlayingPreview(false);
                }
              }}
              className="flex-1 text-xs py-2 px-3 rounded-xl border border-border-input bg-white text-heading focus:outline-none focus:border-brand-purple font-semibold"
            >
              {PRESET_TRACKS.map((t) => (
                <option key={t.id} value={t.url}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Test Audio Preview Button */}
            <button
              type="button"
              onClick={toggleAudioPreview}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isPlayingPreview
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-white border border-border-input text-heading hover:border-brand-purple'
              }`}
            >
              {isPlayingPreview ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-brand-purple" />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. Controls & Volume Slider */}
        <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-heading">
              <Volume2 className="w-4 h-4 text-brand-purple" />
              <span>Volume Controls</span>
            </div>
            <span className="text-xs font-mono font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md">
              {music.volume ?? 50}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={music.volume ?? 50}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleUpdateMusic({ volume: val });
              if (audioRef.current) {
                audioRef.current.volume = val / 100;
              }
            }}
            className="w-full h-1.5 bg-border-default rounded-lg appearance-none cursor-pointer accent-brand-purple"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={music.loop !== false}
                onChange={(e) => handleUpdateMusic({ loop: e.target.checked })}
                className="w-4 h-4 accent-brand-purple rounded"
              />
              <span>Loop audio continuously during demo</span>
            </label>
            <span className="text-[10px] text-muted">Auto-ducks on voiceovers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

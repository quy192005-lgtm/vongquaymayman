'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sliders, Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  activeSliceCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  activeSliceCount,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20 border border-white/20">
          <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 uppercase">
            Lucky Wheel
          </h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
            Spin the wheel of fortune & win prizes
          </p>
        </div>
      </div>

      {/* Header Quick Controls */}
      <div className="flex items-center gap-2">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
          title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-sm active:scale-95 hidden sm:flex"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-amber-400" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Settings Drawer Button */}
        <button
          onClick={onOpenSettings}
          className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-750 hover:from-slate-750 hover:to-slate-700 border border-slate-750 text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 group"
        >
          <Sliders className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
          <span>Customize</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            {activeSliceCount}
          </span>
        </button>
      </div>
    </header>
  );
};


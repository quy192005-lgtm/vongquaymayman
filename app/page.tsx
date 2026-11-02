'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WheelSlice, WheelSettings, SpinHistoryItem, PresetTemplate } from '@/types/wheel';
import { DEFAULT_SLICES, PRESET_TEMPLATES } from '@/data/presets';
import { getContrastTextColor } from '@/lib/colors';
import { Header } from '@/components/Header';
import { LuckyWheel } from '@/components/LuckyWheel';
import { WinnerModal } from '@/components/WinnerModal';
import { WheelSettingsDrawer } from '@/components/WheelSettingsDrawer';
import { Sparkles, Trophy, RotateCcw, Shuffle, Gift, Utensils, HelpCircle, Hash, PartyPopper } from 'lucide-react';

const DEFAULT_SETTINGS: WheelSettings = {
  spinDuration: 4.5,
  useWeights: false,
  soundEnabled: true,
  confettiEnabled: true,
  autoRemoveWinner: false,
};

export default function Home() {
  const [slices, setSlices] = useState<WheelSlice[]>(DEFAULT_SLICES);
  const [settings, setSettings] = useState<WheelSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<SpinHistoryItem[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<WheelSlice | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedSlices = localStorage.getItem('lucky_wheel_slices');
      if (savedSlices) {
        const parsed = JSON.parse(savedSlices);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setSlices(parsed);
        }
      }

      const savedSettings = localStorage.getItem('lucky_wheel_settings');
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }

      const savedHistory = localStorage.getItem('lucky_wheel_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Fallback to defaults if parsing fails
    }
  }, []);

  // Save slices whenever modified
  const updateSlices = (newSlices: WheelSlice[]) => {
    setSlices(newSlices);
    try {
      localStorage.setItem('lucky_wheel_slices', JSON.stringify(newSlices));
    } catch {}
  };

  // Save settings whenever modified
  const updateSettings = (newSettings: Partial<WheelSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('lucky_wheel_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Save history
  const addHistoryItem = (item: SpinHistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 50); // Keep last 50
      try {
        localStorage.setItem('lucky_wheel_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('lucky_wheel_history');
    } catch {}
  };

  // Handle spin callbacks
  const handleSpinStart = () => {
    setIsSpinning(true);
    setIsWinnerModalOpen(false);
  };

  const handleSpinEnd = (winningSlice: WheelSlice) => {
    setIsSpinning(false);
    setWinner(winningSlice);
    setIsWinnerModalOpen(true);

    addHistoryItem({
      id: `history-${Date.now()}`,
      sliceId: winningSlice.id,
      label: winningSlice.label,
      color: winningSlice.color,
      timestamp: Date.now(),
    });
  };

  // Handle removing winner from wheel
  const handleRemoveWinner = (sliceId: string) => {
    if (slices.length <= 2) {
      alert('Cannot remove item: minimum 2 slices required!');
      return;
    }
    const updated = slices.filter((s) => s.id !== sliceId);
    updateSlices(updated);
  };

  // Shuffle slices order
  const handleShuffleSlices = () => {
    if (isSpinning) return;
    const shuffled = [...slices].sort(() => Math.random() - 0.5);
    updateSlices(shuffled);
  };

  // Quick preset loader
  const handleQuickPreset = (preset: PresetTemplate) => {
    if (isSpinning) return;
    const newSlices: WheelSlice[] = preset.slices.map((s, idx) => ({
      ...s,
      id: `slice-${Date.now()}-${idx}`,
      textColor: s.textColor || getContrastTextColor(s.color),
    }));
    updateSlices(newSlices);
  };

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or modal/drawer is open
      if (
        e.code === 'Space' &&
        !isSpinning &&
        !isWinnerModalOpen &&
        !isSettingsOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        // Trigger center button or spin action
        const spinBtn = document.querySelector('button[aria-label="Spin the wheel"]') as HTMLButtonElement | null;
        if (spinBtn) {
          spinBtn.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, isWinnerModalOpen, isSettingsOpen]);

  const activeSliceCount = slices.filter((s) => s.enabled).length;

  // Preset icon helper
  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gift':
        return <Gift className="w-3.5 h-3.5" />;
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'HelpCircle':
        return <HelpCircle className="w-3.5 h-3.5" />;
      case 'Hash':
        return <Hash className="w-3.5 h-3.5" />;
      case 'PartyPopper':
        return <PartyPopper className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background visual ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-rose-900/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-900/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Navigation */}
        <Header
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          onOpenSettings={() => setIsSettingsOpen(true)}
          activeSliceCount={activeSliceCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4">
          {/* Quick Presets Pills */}
          <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline-block">
                Presets:
              </span>
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  disabled={isSpinning}
                  onClick={() => handleQuickPreset(tmpl)}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95 shadow-sm"
                >
                  {getPresetIcon(tmpl.iconName)}
                  <span>{tmpl.name}</span>
                </button>
              ))}

              <button
                disabled={isSpinning}
                onClick={handleShuffleSlices}
                title="Shuffle slice order"
                className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-50 active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Wheel */}
          <LuckyWheel
            slices={slices}
            settings={settings}
            isSpinning={isSpinning}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
          />

          {/* Winning Announcement Banner (when modal is closed but winner exists) */}
          {winner && !isSpinning && (
            <div className="mt-4 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-md animate-in fade-in">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400">Last Winner: </span>
                <span className="font-bold text-white">{winner.label}</span>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-slate-500 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Lucky Wheel • 100% Static Next.js App • Vercel Ready</p>
          <div className="flex items-center gap-4">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700 text-[10px]">Space</kbd> to spin</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-amber-400/80 hover:text-amber-400 transition-colors"
            >
              Configure Prizes
            </button>
          </div>
        </footer>
      </div>

      {/* Winner Celebration Modal */}
      <WinnerModal
        winner={winner}
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        onSpinAgain={() => {
          setIsWinnerModalOpen(false);
          const spinBtn = document.querySelector('button[aria-label="Spin the wheel"]') as HTMLButtonElement | null;
          if (spinBtn) {
            setTimeout(() => spinBtn.click(), 200);
          }
        }}
        onRemoveWinner={handleRemoveWinner}
        soundEnabled={settings.soundEnabled}
        confettiEnabled={settings.confettiEnabled}
      />

      {/* Settings & Customization Drawer */}
      <WheelSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        slices={slices}
        onUpdateSlices={updateSlices}
        settings={settings}
        onUpdateSettings={updateSettings}
        history={history}
        onClearHistory={clearHistory}
      />
    </div>
  );
}

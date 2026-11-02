'use client';

import React, { useState } from 'react';
import { WheelSlice, WheelSettings, PresetTemplate, SpinHistoryItem } from '@/types/wheel';
import { PRESET_TEMPLATES, DEFAULT_SLICES } from '@/data/presets';
import { getContrastTextColor, getPaletteColor, SLICE_PALETTE } from '@/lib/colors';
import {
  X,
  Plus,
  Trash2,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  List,
  History,
  FileText,
  Percent,
  Timer,
  Check,
  Palette,
  Eye,
  EyeOff,
} from 'lucide-react';

interface WheelSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slices: WheelSlice[];
  onUpdateSlices: (newSlices: WheelSlice[]) => void;
  settings: WheelSettings;
  onUpdateSettings: (newSettings: Partial<WheelSettings>) => void;
  history: SpinHistoryItem[];
  onClearHistory: () => void;
}

export const WheelSettingsDrawer: React.FC<WheelSettingsDrawerProps> = ({
  isOpen,
  onClose,
  slices,
  onUpdateSlices,
  settings,
  onUpdateSettings,
  history,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'slices' | 'settings' | 'history'>('slices');
  const [bulkText, setBulkText] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [presetFeedback, setPresetFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Probability percentage helper
  const totalWeight = slices
    .filter((s) => s.enabled)
    .reduce((sum, s) => sum + (settings.useWeights ? s.weight || 1 : 1), 0);

  const calculateOdds = (slice: WheelSlice) => {
    if (!slice.enabled || totalWeight === 0) return '0%';
    const w = settings.useWeights ? slice.weight || 1 : 1;
    const pct = ((w / totalWeight) * 100).toFixed(1);
    return `${pct}%`;
  };

  // Slices manipulation
  const handleAddSlice = () => {
    const nextColor = getPaletteColor(slices.length);
    const newSlice: WheelSlice = {
      id: `slice-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: `New Prize ${slices.length + 1}`,
      color: nextColor,
      textColor: getContrastTextColor(nextColor),
      weight: 1,
      enabled: true,
    };
    onUpdateSlices([...slices, newSlice]);
  };

  const handleUpdateSlice = (id: string, updates: Partial<WheelSlice>) => {
    const updated = slices.map((s) => {
      if (s.id !== id) return s;
      const merged = { ...s, ...updates };
      if (updates.color && !updates.textColor) {
        merged.textColor = getContrastTextColor(updates.color);
      }
      return merged;
    });
    onUpdateSlices(updated);
  };

  const handleDeleteSlice = (id: string) => {
    if (slices.length <= 2) {
      alert('The wheel needs at least 2 slices!');
      return;
    }
    onUpdateSlices(slices.filter((s) => s.id !== id));
  };

  const handleResetToDefault = () => {
    if (confirm('Reset all wheel slices to default prizes?')) {
      onUpdateSlices(DEFAULT_SLICES);
    }
  };

  const handleApplyPreset = (preset: PresetTemplate) => {
    const newSlices: WheelSlice[] = preset.slices.map((s, idx) => ({
      ...s,
      id: `slice-${Date.now()}-${idx}`,
      textColor: s.textColor || getContrastTextColor(s.color),
    }));
    onUpdateSlices(newSlices);
    setPresetFeedback(`Applied "${preset.name}"!`);
    setTimeout(() => setPresetFeedback(null), 2500);
  };

  const handleBulkAdd = () => {
    const lines = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setShowBulkInput(false);
      return;
    }

    const newSlices: WheelSlice[] = lines.map((line, idx) => {
      const color = getPaletteColor(idx);
      return {
        id: `slice-bulk-${Date.now()}-${idx}`,
        label: line,
        color,
        textColor: getContrastTextColor(color),
        weight: 1,
        enabled: true,
      };
    });

    onUpdateSlices(newSlices);
    setBulkText('');
    setShowBulkInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Wheel Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('slices')}
            className={`py-3 px-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'slices'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Slices ({slices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Options</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History ({history.length})</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {presetFeedback && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{presetFeedback}</span>
            </div>
          )}

          {/* TAB 1: SLICES MANAGER */}
          {activeTab === 'slices' && (
            <div className="space-y-4">
              {/* Presets Quick Switch */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Load Preset Templates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_TEMPLATES.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className="p-2.5 text-left rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/50 transition-all group"
                    >
                      <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 truncate">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {preset.slices.length} items
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Add, Bulk, Reset */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddSlice}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Slice</span>
                </button>
                <button
                  onClick={() => setShowBulkInput(!showBulkInput)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Bulk Paste</span>
                </button>
                <button
                  onClick={handleResetToDefault}
                  title="Reset to default items"
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bulk Add Input Area */}
              {showBulkInput && (
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Paste items (one item per line):
                  </label>
                  <textarea
                    rows={4}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Alice&#10;Bob&#10;Charlie&#10;David"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowBulkInput(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkAdd}
                      className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-400"
                    >
                      Replace Slices
                    </button>
                  </div>
                </div>
              )}

              {/* Slices List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
                  <span>Prize Label & Color</span>
                  <span>Odds / Actions</span>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {slices.map((slice, index) => (
                    <div
                      key={slice.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        slice.enabled
                          ? 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600'
                          : 'bg-slate-900/50 border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Slice color picker */}
                        <div className="relative">
                          <input
                            type="color"
                            value={slice.color}
                            onChange={(e) => handleUpdateSlice(slice.id, { color: e.target.value })}
                            className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                            title="Change slice color"
                          />
                        </div>

                        {/* Label text input */}
                        <input
                          type="text"
                          value={slice.label}
                          onChange={(e) => handleUpdateSlice(slice.id, { label: e.target.value })}
                          className="flex-1 bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
                          placeholder="Prize name"
                        />

                        {/* Odds Badge */}
                        <span className="text-[11px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 whitespace-nowrap">
                          {calculateOdds(slice)}
                        </span>

                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => handleUpdateSlice(slice.id, { enabled: !slice.enabled })}
                          className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                          title={slice.enabled ? 'Disable slice' : 'Enable slice'}
                        >
                          {slice.enabled ? (
                            <Eye className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteSlice(slice.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                          title="Delete slice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Weight Slider (if weights are enabled) */}
                      {settings.useWeights && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">Weight:</span>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={slice.weight || 1}
                            onChange={(e) =>
                              handleUpdateSlice(slice.id, { weight: parseInt(e.target.value, 10) })
                            }
                            className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                          />
                          <span className="text-[11px] font-mono text-slate-300 w-5 text-right">
                            {slice.weight || 1}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* Weight Distribution Toggle */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Weighted Probabilities</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.useWeights}
                    onChange={(e) => onUpdateSettings({ useWeights: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {settings.useWeights
                    ? 'Individual slice weights determine slice size and winning odds.'
                    : 'Equal distribution: every slice has the exact same probability of winning.'}
                </p>
              </div>

              {/* Spin Duration Slider */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Spin Duration</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {settings.spinDuration}s
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={settings.spinDuration}
                  onChange={(e) => onUpdateSettings({ spinDuration: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Fast (2s)</span>
                  <span>Normal (4.5s)</span>
                  <span>Long Suspense (8s)</span>
                </div>
              </div>

              {/* Sound Effects Toggle */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-500" />
                  )}
                  <div>
                    <span className="text-sm font-semibold text-white block">Sound Effects</span>
                    <span className="text-xs text-slate-400">
                      Mechanical ticks & victory fanfare
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
              </div>

              {/* Confetti Explosion Toggle */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-sm font-semibold text-white block">Confetti Effects</span>
                    <span className="text-xs text-slate-400">Confetti cannons on winning</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.confettiEnabled}
                  onChange={(e) => onUpdateSettings({ confettiEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SPIN HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Wins ({history.length})
                </span>
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No spins yet! Spin the wheel to record winning results.
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-bold text-white">{item.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


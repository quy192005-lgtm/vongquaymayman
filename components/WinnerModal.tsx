'use client';

import React, { useEffect, useState } from 'react';
import { WheelSlice } from '@/types/wheel';
import { fireWinnerConfetti } from '@/lib/confetti';
import { soundEngine } from '@/lib/audio';
import { Trophy, RotateCw, Trash2, Share2, Check, X } from 'lucide-react';

interface WinnerModalProps {
  winner: WheelSlice | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
  onRemoveWinner?: (sliceId: string) => void;
  soundEnabled: boolean;
  confettiEnabled: boolean;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  isOpen,
  onClose,
  onSpinAgain,
  onRemoveWinner,
  soundEnabled,
  confettiEnabled,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && winner) {
      if (soundEnabled) {
        soundEngine.setMuted(false);
        soundEngine.playWinFanfare();
      }
      if (confettiEnabled) {
        fireWinnerConfetti();
      }
    }
  }, [isOpen, winner, soundEnabled, confettiEnabled]);

  if (!isOpen || !winner) return null;

  const handleShare = async () => {
    const text = `🎉 I spun the Lucky Wheel and won: "${winner.label}"!`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemove = () => {
    if (onRemoveWinner) {
      onRemoveWinner(winner.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(234,179,8,0.25)] text-center transform transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon with glowing ring */}
        <div className="relative mx-auto mb-4 w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg border border-yellow-200/50">
            <Trophy className="w-9 h-9 text-slate-950" />
          </div>
        </div>

        {/* Celebration Title */}
        <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-1">
          Congratulations!
        </h3>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
          WE HAVE A WINNER!
        </h2>

        {/* Winning Prize Card */}
        <div
          className="p-5 rounded-2xl shadow-xl border-2 mb-6 transition-transform transform hover:scale-[1.02]"
          style={{
            backgroundColor: winner.color,
            borderColor: 'rgba(255,255,255,0.3)',
            boxShadow: `0 10px 30px ${winner.color}40`,
          }}
        >
          <span
            className="block text-xl sm:text-2xl font-black tracking-wide break-words"
            style={{ color: winner.textColor || '#ffffff' }}
          >
            {winner.label}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <button
            onClick={() => {
              onClose();
              onSpinAgain();
            }}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RotateCw className="w-5 h-5" />
            <span>Spin Again</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            {onRemoveWinner && (
              <button
                onClick={handleRemove}
                title="Remove this slice so it won't be picked again"
                className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Prize</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


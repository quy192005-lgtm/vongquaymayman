'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { WheelSlice, WheelSettings } from '@/types/wheel';
import { soundEngine } from '@/lib/audio';

interface LuckyWheelProps {
  slices: WheelSlice[];
  settings: WheelSettings;
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winningSlice: WheelSlice) => void;
}

export const LuckyWheel: React.FC<LuckyWheelProps> = ({
  slices,
  settings,
  isSpinning,
  onSpinStart,
  onSpinEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Wheel physics state stored in refs to avoid re-renders during 60fps animation
  const currentRotationRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastPegIndexRef = useRef<number>(-1);

  // Indicator flapper bounce angle in degrees
  const flapperAngleRef = useRef<number>(0);
  const [flapperVisualAngle, setFlapperVisualAngle] = useState<number>(0);

  // Responsive canvas size
  const [canvasSize, setCanvasSize] = useState<number>(480);

  // Filter only enabled slices (minimum 2 slices needed to spin)
  const activeSlices = slices.filter((s) => s.enabled);
  const effectiveSlices = activeSlices.length >= 2 ? activeSlices : slices;

  // Handle responsive resizing
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      // Cap between 280px (small phones) and 520px (large screens)
      const size = Math.min(Math.max(width - 24, 280), 520);
      setCanvasSize(size);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute slice angles (handles both weighted and equal distribution)
  const getSliceAngles = useCallback(() => {
    const count = effectiveSlices.length;
    if (count === 0) return [];

    let totalWeight = 0;
    if (settings.useWeights) {
      totalWeight = effectiveSlices.reduce((sum, s) => sum + (s.weight || 1), 0);
    } else {
      totalWeight = count;
    }

    const angles: { slice: WheelSlice; start: number; end: number; arc: number }[] = [];
    let currentAngle = 0;

    for (let i = 0; i < count; i++) {
      const slice = effectiveSlices[i];
      const weight = settings.useWeights ? slice.weight || 1 : 1;
      const arc = (weight / totalWeight) * (Math.PI * 2);
      angles.push({
        slice,
        start: currentAngle,
        end: currentAngle + arc,
        arc,
      });
      currentAngle += arc;
    }

    return angles;
  }, [effectiveSlices, settings.useWeights]);

  // Main canvas draw routine
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const size = canvasSize;
    const center = size / 2;
    const radius = center - 16; // Outer boundary margin

    // Ensure backing store matches DPR
    if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const sliceAngles = getSliceAngles();
    const rotation = currentRotationRef.current;

    // --- 1. Outer Bezel & Shadow ---
    ctx.save();
    ctx.translate(center, center);

    // Deep drop shadow for the whole wheel
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;

    // Outer ring metallic gradient
    const outerRingGrad = ctx.createLinearGradient(-center, -center, center, center);
    outerRingGrad.addColorStop(0, '#334155'); // slate-700
    outerRingGrad.addColorStop(0.5, '#1e293b'); // slate-800
    outerRingGrad.addColorStop(1, '#0f172a'); // slate-900

    ctx.beginPath();
    ctx.arc(0, 0, radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = outerRingGrad;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Golden accent border
    const goldGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.3, '#eab308');
    goldGrad.addColorStop(0.7, '#ca8a04');
    goldGrad.addColorStop(1, '#a16207');

    ctx.lineWidth = 4;
    ctx.strokeStyle = goldGrad;
    ctx.stroke();

    ctx.restore();

    // --- 2. Wheel Slices (Rotated) ---
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    sliceAngles.forEach(({ slice, start, end, arc }) => {
      ctx.save();

      // Sector slice fill
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Sector dividing lines
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();

      // Slice inner 3D depth gradient
      const innerShade = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      innerShade.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      innerShade.addColorStop(0.8, 'rgba(0, 0, 0, 0.0)');
      innerShade.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
      ctx.fillStyle = innerShade;
      ctx.fill();

      // --- Draw Slice Label Text ---
      ctx.save();
      const midAngle = start + arc / 2;
      ctx.rotate(midAngle);

      // Positioning text along the radius
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const textColor = slice.textColor || '#ffffff';
      ctx.fillStyle = textColor;

      // Dynamic font size depending on number of slices and screen size
      const sliceCount = sliceAngles.length;
      let fontSize = Math.floor(size * 0.038);
      if (sliceCount > 10) fontSize = Math.floor(size * 0.032);
      if (sliceCount > 16) fontSize = Math.floor(size * 0.026);
      fontSize = Math.max(11, Math.min(fontSize, 18));

      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;

      // Text subtle shadow for high contrast
      ctx.shadowColor = textColor === '#ffffff' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 4;

      // Smart truncate label
      const textRadius = radius - 24;
      let label = slice.label;
      const maxChars = sliceCount > 12 ? 14 : 20;
      if (label.length > maxChars) {
        label = label.substring(0, maxChars - 1) + '…';
      }

      ctx.fillText(label, textRadius, 0);
      ctx.restore();

      ctx.restore();
    });

    // --- 3. Metallic Border Pegs (Pins) ---
    // Place a pin at every sector boundary
    sliceAngles.forEach(({ start }) => {
      ctx.save();
      const pinDistance = radius + 4;
      const px = Math.cos(start) * pinDistance;
      const py = Math.sin(start) * pinDistance;

      // Pin shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;

      // Pin body (metallic silver/gold)
      const pinGrad = ctx.createRadialGradient(px - 1, py - 1, 1, px, py, 4);
      pinGrad.addColorStop(0, '#ffffff');
      pinGrad.addColorStop(0.4, '#e2e8f0');
      pinGrad.addColorStop(1, '#64748b');

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = pinGrad;
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore(); // end wheel rotation

    // --- 4. Center Hub (Stationary Over Wheel) ---
    ctx.save();
    ctx.translate(center, center);

    const hubRadius = Math.max(size * 0.16, 42);

    // Hub outer shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;

    // Hub outer chrome/gold ring
    const hubRingGrad = ctx.createLinearGradient(-hubRadius, -hubRadius, hubRadius, hubRadius);
    hubRingGrad.addColorStop(0, '#fef08a');
    hubRingGrad.addColorStop(0.5, '#ca8a04');
    hubRingGrad.addColorStop(1, '#854d0e');

    ctx.beginPath();
    ctx.arc(0, 0, hubRadius, 0, Math.PI * 2);
    ctx.fillStyle = hubRingGrad;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Hub inner dark surface
    const hubInnerGrad = ctx.createRadialGradient(0, -hubRadius * 0.3, hubRadius * 0.1, 0, 0, hubRadius - 6);
    hubInnerGrad.addColorStop(0, '#334155');
    hubInnerGrad.addColorStop(0.7, '#1e293b');
    hubInnerGrad.addColorStop(1, '#0f172a');

    ctx.beginPath();
    ctx.arc(0, 0, hubRadius - 5, 0, Math.PI * 2);
    ctx.fillStyle = hubInnerGrad;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    ctx.restore();

    ctx.restore(); // end main canvas
  }, [canvasSize, getSliceAngles]);

  // Render wheel continuously or when rotation updates
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Main Spin Physics Runner
  const startSpin = useCallback(() => {
    if (isSpinning || effectiveSlices.length < 2) return;

    soundEngine.setMuted(!settings.soundEnabled);
    soundEngine.playSpinStart();
    onSpinStart();

    const sliceAngles = getSliceAngles();
    const count = sliceAngles.length;

    // Pick winner according to weights or uniform
    let winningIndex = 0;
    if (settings.useWeights) {
      const totalWeight = effectiveSlices.reduce((sum, s) => sum + (s.weight || 1), 0);
      let rand = Math.random() * totalWeight;
      for (let i = 0; i < count; i++) {
        const w = effectiveSlices[i].weight || 1;
        if (rand < w) {
          winningIndex = i;
          break;
        }
        rand -= w;
      }
    } else {
      winningIndex = Math.floor(Math.random() * count);
    }

    const winnerAngleData = sliceAngles[winningIndex];

    // Safe random target angle inside the winning sector (between 20% and 80% to avoid edges)
    const paddingArc = winnerAngleData.arc * 0.2;
    const targetSectorAngle =
      winnerAngleData.start + paddingArc + Math.random() * (winnerAngleData.arc - paddingArc * 2);

    // The indicator is fixed at 12 o'clock: 3*PI/2 (270 degrees)
    const pointerAngle = (3 * Math.PI) / 2;

    // Target rotation where: (pointerAngle - finalRotation) % 2PI == targetSectorAngle
    const startRot = currentRotationRef.current;
    const twoPi = Math.PI * 2;

    const normalizedTarget = (pointerAngle - targetSectorAngle) % twoPi;
    const positiveTarget = (normalizedTarget + twoPi) % twoPi;

    const normalizedCurrent = (startRot % twoPi + twoPi) % twoPi;
    let angleDiff = positiveTarget - normalizedCurrent;
    if (angleDiff < 0) {
      angleDiff += twoPi;
    }

    // Spin 6 to 9 full rotations for suspense
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const totalRotationDelta = fullSpins * twoPi + angleDiff;

    startRotationRef.current = startRot;
    targetRotationRef.current = startRot + totalRotationDelta;
    startTimeRef.current = performance.now();
    lastPegIndexRef.current = -1;

    const durationMs = (settings.spinDuration || 4.5) * 1000;

    // Realistic Quintic Ease-Out curve for dramatic deceleration
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 4.5);

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutQuint(progress);

      const newRotation = startRotationRef.current + totalRotationDelta * easedProgress;
      currentRotationRef.current = newRotation;

      // Check pin/peg strike for ticker sound and indicator bounce
      const currentWheelAngleAtPointer = ((pointerAngle - newRotation) % twoPi + twoPi) % twoPi;
      let currentPegIndex = -1;
      for (let i = 0; i < count; i++) {
        if (
          currentWheelAngleAtPointer >= sliceAngles[i].start &&
          currentWheelAngleAtPointer < sliceAngles[i].end
        ) {
          currentPegIndex = i;
          break;
        }
      }

      if (currentPegIndex !== -1 && currentPegIndex !== lastPegIndexRef.current) {
        lastPegIndexRef.current = currentPegIndex;
        // Remaining speed ratio (1.0 down to 0.05)
        const speedRatio = 1 - progress;
        soundEngine.playTick(speedRatio);

        // Flapper bounces backwards
        flapperAngleRef.current = -18 * Math.max(speedRatio, 0.35);
        setFlapperVisualAngle(flapperAngleRef.current);
      } else {
        // Return flapper smoothly towards 0
        if (flapperAngleRef.current < 0) {
          flapperAngleRef.current += 3.5;
          if (flapperAngleRef.current > 0) flapperAngleRef.current = 0;
          setFlapperVisualAngle(flapperAngleRef.current);
        }
      }

      drawWheel();

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished
        flapperAngleRef.current = 0;
        setFlapperVisualAngle(0);
        drawWheel();
        onSpinEnd(winnerAngleData.slice);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  }, [
    isSpinning,
    effectiveSlices,
    settings.soundEnabled,
    settings.spinDuration,
    settings.useWeights,
    onSpinStart,
    getSliceAngles,
    drawWheel,
    onSpinEnd,
  ]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-[540px] mx-auto select-none py-2"
    >
      {/* Outer ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none transform scale-90" />

      {/* Main Wheel Container */}
      <div className="relative flex items-center justify-center">
        {/* Top Indicator / Pointer */}
        <div
          className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{
            transform: `translateX(-50%) rotate(${flapperVisualAngle}deg)`,
            transformOrigin: '50% 15%',
            left: '50%',
          }}
        >
          {/* Stylized 3D Arrow Needle */}
          <div className="relative filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            <svg
              width="44"
              height="52"
              viewBox="0 0 44 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="pointerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#eab308" />
                  <stop offset="70%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="needleShine" x1="0%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              {/* Outer flapper shape */}
              <path
                d="M22 50 L7 12 C5 7 8 2 13 2 L31 2 C36 2 39 7 37 12 L22 50 Z"
                fill="url(#pointerGrad)"
                stroke="#450a0a"
                strokeWidth="2.5"
              />
              {/* Top rivet/hinge */}
              <circle cx="22" cy="11" r="5" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
              {/* Highlight shine */}
              <path
                d="M14 4 L28 4 C31 4 33 6 32 9 L22 38 L18 10 C17 6 15 5 14 4 Z"
                fill="url(#needleShine)"
              />
            </svg>
          </div>
        </div>

        {/* HTML5 Canvas Wheel */}
        <canvas
          ref={canvasRef}
          style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
          className="rounded-full shadow-2xl transition-shadow duration-300"
        />

        {/* Center SPIN Button (Clickable directly on hub!) */}
        <button
          onClick={startSpin}
          disabled={isSpinning || effectiveSlices.length < 2}
          aria-label="Spin the wheel"
          className={`absolute z-20 rounded-full flex flex-col items-center justify-center font-black tracking-wider transition-all duration-200 shadow-xl ${
            isSpinning
              ? 'cursor-not-allowed opacity-90 scale-95'
              : 'hover:scale-105 active:scale-95 cursor-pointer hover:shadow-amber-500/40'
          }`}
          style={{
            width: `${Math.max(canvasSize * 0.22, 60)}px`,
            height: `${Math.max(canvasSize * 0.22, 60)}px`,
            background: 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 60%, #92400e 100%)',
            boxShadow:
              '0 8px 25px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(0,0,0,0.5)',
            border: '3px solid #fef08a',
          }}
        >
          <span
            className="text-slate-950 font-black drop-shadow-sm uppercase"
            style={{
              fontSize: `${Math.max(canvasSize * 0.042, 13)}px`,
              lineHeight: 1.1,
            }}
          >
            {isSpinning ? '...' : 'SPIN'}
          </span>
          <span
            className="text-amber-950 font-semibold tracking-normal opacity-80"
            style={{
              fontSize: `${Math.max(canvasSize * 0.022, 8)}px`,
            }}
          >
            {isSpinning ? 'LUCK' : 'WIN'}
          </span>
        </button>
      </div>

      {/* Prominent Below-Wheel Spin Action Bar */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          onClick={startSpin}
          disabled={isSpinning || effectiveSlices.length < 2}
          className={`group relative px-8 py-3.5 rounded-2xl font-bold text-lg tracking-wide text-white transition-all duration-300 shadow-lg ${
            isSpinning || effectiveSlices.length < 2
              ? 'bg-slate-700/60 cursor-not-allowed text-slate-400'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:via-rose-400 hover:to-purple-500 hover:shadow-rose-500/30 hover:shadow-2xl active:scale-[0.98]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl animate-pulse">✨</span>
            <span>{isSpinning ? 'Spinning Wheel...' : 'SPIN THE WHEEL'}</span>
            <kbd className="hidden sm:inline-block ml-1 px-2 py-0.5 text-xs font-semibold bg-black/30 border border-white/20 rounded text-slate-200">
              SPACE
            </kbd>
          </div>
        </button>

        {effectiveSlices.length < 2 && (
          <p className="text-xs text-rose-400 font-medium animate-pulse">
            Please enable or add at least 2 slices to spin!
          </p>
        )}
      </div>
    </div>
  );
};


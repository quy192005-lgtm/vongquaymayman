# 🎡 Lucky Wheel (Spin the Wheel of Fortune)

A modern, responsive, and visually stunning Lucky Wheel (Wheel of Fortune / Spin the Wheel) web application built with **Next.js (App Router)**, **Tailwind CSS**, **Lucide React**, and **canvas-confetti**.

Zero backend database required — 100% static, client-side, and production-ready for instantaneous deployment on **Vercel**, Netlify, or GitHub Pages.

---

## ✨ Features & Highlights

### 1. 🎨 Visual & UI Design
- **High-DPI HTML5 Canvas Rendering**: Crisp, 60fps wheel rendering with radial text, glowing rim, metallic bezel, and boundary pins.
- **Physical Bouncing Indicator / Flapper**: Realistic flapper that snaps and recoils every time a sector peg strikes it.
- **Responsive & Touch Friendly**: Seamlessly scales from mobile screens (320px) to ultra-wide displays (4K).
- **Gamified Dark Theme**: Sleek slate/violet dark gradient backdrop with ambient neon glow.

### 2. ⚙️ Realistic Physics & Core Mechanics
- **Quintic Ease-Out Deceleration**: Natural physics simulation with 4–8 seconds duration and multiple full rotations before stopping.
- **Synthesized Web Audio Effects**: 100% client-side mechanical ticking sounds that slow down with the wheel, plus celebratory victory fanfares (zero external audio files that could fail to load).
- **Dual-Cannon Confetti Explosions**: Integrated `canvas-confetti` celebration on winning.
- **Winner Celebration Modal**: Displays the winning prize card, odds percentage, with quick actions to "Spin Again", "Share Result", or "Remove Prize from Wheel".
- **Hotkeys**: Press <kbd>Space</kbd> anytime to spin!

### 3. 🛠️ Wheel Customization & Settings Panel
- **Slices Manager**:
  - Add, edit, or delete prizes.
  - Custom color picker with automated high-contrast text color calculations.
  - Weighted probabilities support: toggle between equal distribution vs. customizable slice weights with live probability percentage computation.
  - Enable/Disable slices without deleting them.
  - Bulk Paste: Import a multi-line list of names/items directly.
- **1-Click Preset Templates**:
  - 🎁 *Lucky Prizes & Rewards*
  - 🍕 *What to Eat for Lunch?*
  - 🤔 *Decision Maker*
  - 🎲 *Lucky Numbers 1 - 8*
  - 🎉 *Party Dare & Fun*
- **Persistent Storage**: Slices, custom options, and spin history are automatically saved to browser `localStorage`.
- **History Log**: Keeps track of recent winning spins with timestamps and quick clear options.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+

### Installation & Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build static production bundle
npm run build

# Start production server locally
npm run start
```

---

## 🌐 Deploy to Vercel

Since this project has **zero database or server dependencies**, deployment to Vercel takes under 1 minute:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel automatically detects Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **Deploy**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Confetti**: `canvas-confetti`
- **Audio**: Web Audio API (Synthesizer)

import { PresetTemplate, WheelSlice } from '@/types/wheel';
import { getContrastTextColor } from '@/lib/colors';

export const DEFAULT_SLICES: WheelSlice[] = [
  { id: 'slice-1', label: '$100 Cash Prize', color: '#10b981', textColor: '#ffffff', weight: 1, enabled: true },
  { id: 'slice-2', label: 'Free Coffee ☕', color: '#f59e0b', textColor: '#0f172a', weight: 2, enabled: true },
  { id: 'slice-3', label: 'Mystery Gift Box 🎁', color: '#8b5cf6', textColor: '#ffffff', weight: 1, enabled: true },
  { id: 'slice-4', label: 'Try Again Next Time', color: '#64748b', textColor: '#ffffff', weight: 3, enabled: true },
  { id: 'slice-5', label: '20% Discount Code', color: '#06b6d4', textColor: '#0f172a', weight: 2, enabled: true },
  { id: 'slice-6', label: 'Jackpot $500! 🏆', color: '#f43f5e', textColor: '#ffffff', weight: 1, enabled: true },
  { id: 'slice-7', label: 'Double Spin Token', color: '#f97316', textColor: '#ffffff', weight: 2, enabled: true },
  { id: 'slice-8', label: 'Movie Ticket 🎟️', color: '#ec4899', textColor: '#ffffff', weight: 2, enabled: true },
];

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'prizes',
    name: 'Lucky Prizes & Rewards',
    description: 'Classic wheel of fortune with cash, mystery boxes & discounts',
    iconName: 'Gift',
    slices: [
      { label: '$100 Cash Prize', color: '#10b981', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Free Coffee ☕', color: '#f59e0b', textColor: '#0f172a', weight: 2, enabled: true },
      { label: 'Mystery Gift 🎁', color: '#8b5cf6', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Try Again', color: '#64748b', textColor: '#ffffff', weight: 3, enabled: true },
      { label: '20% Discount Code', color: '#06b6d4', textColor: '#0f172a', weight: 2, enabled: true },
      { label: 'Jackpot $500! 🏆', color: '#f43f5e', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Free Movie Ticket', color: '#ec4899', textColor: '#ffffff', weight: 2, enabled: true },
      { label: 'Special Merch 👕', color: '#3b82f6', textColor: '#ffffff', weight: 2, enabled: true },
    ],
  },
  {
    id: 'food',
    name: "What to Eat for Lunch?",
    description: 'Solve the daily lunch dilemma in seconds!',
    iconName: 'Utensils',
    slices: [
      { label: 'Pizza 🍕', color: '#f43f5e', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Sushi & Sashimi 🍣', color: '#06b6d4', textColor: '#0f172a', weight: 1, enabled: true },
      { label: 'Burger & Fries 🍔', color: '#f59e0b', textColor: '#0f172a', weight: 1, enabled: true },
      { label: 'Vietnamese Pho 🍜', color: '#10b981', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Mexican Tacos 🌮', color: '#f97316', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Italian Pasta 🍝', color: '#8b5cf6', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Healthy Salad 🥗', color: '#84cc16', textColor: '#0f172a', weight: 1, enabled: true },
      { label: 'Korean BBQ 🥩', color: '#ec4899', textColor: '#ffffff', weight: 1, enabled: true },
    ],
  },
  {
    id: 'decision',
    name: 'Decision Maker',
    description: 'Help make quick decisions when you are stuck',
    iconName: 'HelpCircle',
    slices: [
      { label: 'Definitely YES! ✨', color: '#10b981', textColor: '#ffffff', weight: 2, enabled: true },
      { label: 'No Way ❌', color: '#f43f5e', textColor: '#ffffff', weight: 2, enabled: true },
      { label: 'Maybe Later 🤔', color: '#f59e0b', textColor: '#0f172a', weight: 1, enabled: true },
      { label: 'Ask a Friend 👥', color: '#3b82f6', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Go For It! 🚀', color: '#8b5cf6', textColor: '#ffffff', weight: 2, enabled: true },
      { label: 'Sleep On It 🌙', color: '#64748b', textColor: '#ffffff', weight: 1, enabled: true },
    ],
  },
  {
    id: 'numbers',
    name: 'Lucky Numbers 1 - 8',
    description: 'Pick a random winner or select lucky numbers',
    iconName: 'Hash',
    slices: [
      { label: 'Number 1', color: '#f43f5e', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Number 2', color: '#3b82f6', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Number 3', color: '#10b981', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Number 4', color: '#f59e0b', textColor: '#0f172a', weight: 1, enabled: true },
      { label: 'Number 5', color: '#8b5cf6', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Number 6', color: '#06b6d4', textColor: '#0f172a', weight: 1, enabled: true },
      { label: 'Number 7 🍀', color: '#f97316', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Number 8 💎', color: '#ec4899', textColor: '#ffffff', weight: 1, enabled: true },
    ],
  },
  {
    id: 'party',
    name: 'Party Dare & Fun',
    description: 'Fun icebreakers and party challenges',
    iconName: 'PartyPopper',
    slices: [
      { label: 'Sing a Song 🎤', color: '#f43f5e', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Tell a Funny Joke 😄', color: '#3b82f6', textColor: '#ffffff', weight: 1, enabled: true },
      { label: '10 Pushups 💪', color: '#f59e0b', textColor: '#0f172a', weight: 1, enabled: true },
      { label: 'Dance for 15s 💃', color: '#10b981', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Free Pass! 🛡️', color: '#8b5cf6', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Imitate an Animal 🦁', color: '#f97316', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Truth or Dare? 🔮', color: '#ec4899', textColor: '#ffffff', weight: 1, enabled: true },
      { label: 'Speak in Accent 🗣️', color: '#06b6d4', textColor: '#0f172a', weight: 1, enabled: true },
    ],
  },
];


export interface WheelSlice {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  weight: number; // For probability calculation (e.g., 1 to 100)
  enabled: boolean;
}

export interface WheelSettings {
  spinDuration: number; // in seconds (e.g. 4.5)
  useWeights: boolean; // false = equal distribution, true = slice.weight
  soundEnabled: boolean;
  confettiEnabled: boolean;
  autoRemoveWinner: boolean;
}

export interface SpinHistoryItem {
  id: string;
  sliceId: string;
  label: string;
  color: string;
  timestamp: number;
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  iconName: string;
  slices: Omit<WheelSlice, 'id'>[];
}


// Type for components that require to look at specifically a singular Emotion Interval
export interface EmotionInterval {
  start: number
  end: number
  dominant_emotion: string
  confidence?: { [emotion: string]: number}
}

// Model JSON Response for all emotions captured per defined Emotion Interval
export interface EmotionData {
  duration: number;
  stats: {
    total_frames: number;
    fps: number;
  };
  title: string;
  emotion_intervals: EmotionInterval[];
}

// Video Player Props for Custom Video Controller  / Emotion Sync
export interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  emotionIntervals: EmotionInterval[];
  selectedEmotions: string[];
  duration: number;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

// Icon props for reusability across Emotionmap
export interface IconProps {
  size?: number;      // Width/height in pixels
  color?: string;     // Fill color
}

// Props being passed to EmotionSelector which handle video rerendering for only selected emotions
export interface EmotionSelectorProps {
  emotions: string[]
  selectedEmotions: string[]
  onToggle: (emotion: string) => void;
}

// EmotionVideoBar props to handle emotion UI display for selected emotions
export type EmotionVideoBarProps = Pick<
  VideoPlayerProps,
  'emotionIntervals' | 'selectedEmotions' | 'duration' | 'currentTime'
>;

// Handle controlling the Custom Video Player 
export interface CustomControlVideoPlayerProps {
  isPlaying: boolean;
  handlePlayPause: () => void;
  currentTime: number;
  duration: number;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  volume: number;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMute: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Props for handeling resetting video state or downloading video
export interface ActionButtonsProps {
	onDownload: () => void;
	onReset: () => void;
	isDownloading: boolean;
}
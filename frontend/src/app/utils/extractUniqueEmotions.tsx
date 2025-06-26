import { EmotionData } from "../types";

export function extractUniqueEmotions(data: EmotionData): string[] {
  return Array.from(
    new Set(data.emotion_intervals.map(e => e.dominant_emotion))
  );
}
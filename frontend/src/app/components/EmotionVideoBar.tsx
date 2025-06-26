import { useState, useMemo } from "react"
import { emotionColors } from "../constants"
import { EmotionVideoBarProps} from "../types"


export default function EmotionVideoBar ({emotionIntervals, selectedEmotions, duration, currentTime} : EmotionVideoBarProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  // Leveraging useMemo to avoid recalculations on every render
  const filteredIntervals = useMemo(() => {
    if (!duration) return [];
    return emotionIntervals
      .filter((interval) => selectedEmotions.includes(interval.dominant_emotion))
      .map((interval, index) => {
        const width = ((interval.end - interval.start) / duration) * 100;
        const left = (interval.start / duration) * 100;
        return { ...interval, width, left, index };
      });
  }, [emotionIntervals, selectedEmotions, duration]);

  if (!duration) return null;

  return (
    <div className="relative md:w-3/4 h-2 mt-2 md:ml-37">
      {filteredIntervals.map(({ width, left, dominant_emotion, start, end, confidence }, index) => {
        const isActive =
        currentTime !== undefined &&
        currentTime >= start &&
        currentTime < end;

        return (
          <div
            key={index}
            className="absolute h-full"
            style={{
              width: `${width}%`,
              left: `${left}%`,
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            //title={dominant_emotion}
          >
            {/* Tooltip */}
            {hovered === index && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 text-white border-2 border-white rounded-lg bg-[#5d1283] text-sm whitespace-nowrap z-50 pointer-events-none">
                {dominant_emotion}
                {confidence && confidence[dominant_emotion] !== undefined && (
                  <span className="block">
                    Emotion Confidence: {(confidence[dominant_emotion] * 100).toFixed(1)}%
                  </span>)}
              </div>
            )}
            {/* Colored Bar */}
            <div
              className={`h-full rounded-sm transition-all duration-200 ${
                isActive ? "ring-2 ring-white z-10" : ""
              }`}
              style={{
                backgroundColor: emotionColors[dominant_emotion] || "#888",
                opacity: 0.8,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
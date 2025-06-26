import { emotionColors, emotionIcons } from "../constants";
import { EmotionSelectorProps } from "../types";

export default function EmotionSelector ({ emotions,  selectedEmotions, onToggle }: EmotionSelectorProps) {
  return (
    <div className="bg-[#5d1283] rounded-lg p-3 h-full mb-4 border-2 border-black/30">
      <div className="flex justify-center">
        <h2 className="text-xl font-semibold mb-4 fade-right">Select Emotions</h2>
      </div>
      <div className="flex flex-col space-y-2">
        {emotions.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion);
          return (
            <div key={emotion} className="flex space-x-2 w-full items-center">
              <button
                onClick={() => onToggle(emotion)}
                className="w-9 h-9 border-2 border-white/30 rounded transition-all duration-300 transform hover:scale-105 active:scale-95 ease-in-out cursor-pointer fade-right-delay"
                style={{
                  backgroundColor: isSelected ? emotionColors[emotion] || "#fff" : "transparent",
                }}
              />
              <button
                onClick={() => onToggle(emotion)}
                className={`flex items-center flex-1 gap-x-4 px-4 py-1 border-2 border-white rounded transition-colors duration-300 fade-right-delay-more
                  ${isSelected ? "bg-white text-[#5d1283]" : "bg-transparent text-white"}`}
              >
                {emotionIcons[emotion]}
                {emotion}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
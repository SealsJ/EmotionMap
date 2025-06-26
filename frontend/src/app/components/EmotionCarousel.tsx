"use client";
import { useState, useEffect, RefObject } from "react";
import { AngryIcon, FearIcon, HappyIcon, NeutralIcon, SadIcon, SurpriseIcon } from "./icons";

const emotions = [
  { icon: <HappyIcon size={76} color="#e3e3e3"/>, label: "Happy" },
  { icon: <AngryIcon size={76} color="#e3e3e3"/>, label: "Anger" },
  { icon: <SadIcon size={76} color="#e3e3e3"/>, label: "Sadness" },
  { icon: <NeutralIcon size={76} color="#e3e3e3"/>, label: "Neutral" },
  { icon: <FearIcon size={76} color="#e3e3e3"/>, label: "Fearful" },
  { icon: <SurpriseIcon size={76} color="#e3e3e3"/>, label: "Surprised" },
];

interface EmotionCarouselProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

const EmotionCarousel = ({ videoRef }: EmotionCarouselProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = videoRef.current?.currentTime ?? 0;
      const newIndex = Math.floor(time / 5) % emotions.length;
      setIndex(newIndex);
    }, 100); // check often for smoother updates

    return () => clearInterval(interval);
  }, [videoRef]);

  return (
      <div className="relative h-35 w-50 flex items-center justify-center overflow-hidden text-center">
        {emotions.map((emotion, i) => (
          <div
            key={i}
            className={`absolute transition-opacity duration-2000 flex flex-col items-center ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {emotion.icon}
            <span className="text-md font-semibold tracking-widest uppercase text-white/80 pt-2">{emotion.label}</span>
          </div>
        ))}
      </div>
  )
};

export default EmotionCarousel;
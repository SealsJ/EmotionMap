import { useRef, useState, useCallback, useEffect } from "react";
import { VideoPlayerProps } from "../types";

export function useEmotionVideoPlayer({
  emotionIntervals,
  selectedEmotions,
  duration,
  setCurrentTime,
}: Pick<VideoPlayerProps, 'emotionIntervals' | 'selectedEmotions' | 'duration' | 'currentTime' | 'setCurrentTime'>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const findNextVisibleTime = useCallback(
    (time: number): number | null => {
      const valid = emotionIntervals
        .filter(
          (int) =>
            selectedEmotions.includes(int.dominant_emotion) && int.end > time
        )
        .sort((a, b) => a.start - b.start);

      if (!valid.length) return null;
      for (const int of valid) {
        if (time >= int.start && time < int.end) return null;
      }

      return valid[0].start;
    },
    [emotionIntervals, selectedEmotions]
  );

  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const time = e.currentTarget.currentTime;
      setCurrentTime(time);

      const isInInterval = emotionIntervals.some(
        (int) =>
          selectedEmotions.includes(int.dominant_emotion) &&
          time >= int.start &&
          time < int.end
      );

      const nextTime = findNextVisibleTime(time);
      if (!isInInterval && nextTime === null && videoRef.current) {
        videoRef.current.currentTime = duration;
        videoRef.current.pause();
        setIsPlaying(false);
        return;
      }

      if (!isInInterval && nextTime !== null && videoRef.current) {
        if (Math.abs(nextTime - time) > 0.01) {
          videoRef.current.currentTime = nextTime;
        }
      }
    },
    [emotionIntervals, selectedEmotions, findNextVisibleTime, setCurrentTime, duration]
  );

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    const vid = videoRef.current;

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      const time = vid.currentTime;
      const next = findNextVisibleTime(time);
      if (next !== null && next !== time) {
        vid.currentTime = next;
      }
      vid.play();
      setIsPlaying(true);
    }
  }, [isPlaying, findNextVisibleTime]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSeek = (time: number) => {
  if (videoRef.current) {
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }
};

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
    }
  };

  const toggleMute = () => {
    const newVol = volume > 0 ? 0 : 1;
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
    setVolume(newVol);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [emotionIntervals]);

  useEffect(() => {
  if (videoRef.current) {
    videoRef.current.volume = volume;
  }
}, [volume]);

  return {
    videoRef,
    isPlaying,
    volume,
    handlePlayPause,
    handleTimeUpdate,
    handleSeekChange,
    handleVolumeChange,
    toggleMute,
    handleSeek
  };
}
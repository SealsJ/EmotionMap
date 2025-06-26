import { CustomControlVideoPlayerProps } from "../types";
import { PlayButton, PauseButton, VolumeIcon, MuteIcon } from "./icons";

export default function CustomVideoPlayer ({ isPlaying, handlePlayPause, currentTime, duration, handleSeek, volume, handleVolumeChange, toggleMute,
  onMouseEnter, onMouseLeave
  }: CustomControlVideoPlayerProps) {
    const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-1 lg:px-4 pb-1 lg:pb-3 bg-transparent flex items-center space-x-2"
      style={{ userSelect: "none" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Play/Pause */}
      <button
        onClick={handlePlayPause}
        className="text-white text-2xl select-none cursor-pointer"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? <PauseButton /> : <PlayButton />}
      </button>

      {/* Time Indicator */}
      <div className="text-white select-none text-xs md:text-sm font-mono w-24 text-center whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Progress Bar */}
      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={handleSeek}
        className="flex-1 rounded-full h-2 cursor-pointer accent-[#9c21c9]"
        role="slider"
        aria-label="Seek video"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
      />

      {/* Volume */}
      <div className="flex items-center space-x-1 select-none">
        <button
          onClick={toggleMute}
          className="text-white text-xl cursor-pointer"
          aria-label={volume > 0 ? "Mute volume" : "Unmute volume"}
        >
          {volume > 0 ? <VolumeIcon /> : <MuteIcon />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-8 md:w-20 rounded-full cursor-pointer accent-[#9c21c9]"
          role="slider"
          aria-label="Volume control"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={volume}
        />
      </div>
    </div>
  );
};
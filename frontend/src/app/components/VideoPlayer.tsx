import { useEmotionVideoPlayer } from "../hooks/useEmotionVideoPlayer";
import { useControlsVisibility } from "../hooks/useControlsVisibility";
import CustomVideoPlayer from "./CustomVideoPlayer";
import EmotionVideoBar from "./EmotionVideoBar";
import { VideoPlayerProps } from "../types";

export default function VideoPlayer ({ videoUrl, title, emotionIntervals, selectedEmotions, duration, currentTime, setCurrentTime }: VideoPlayerProps) 
  {
  // Manage <video> element + playback
  const {
    videoRef,
    isPlaying,
    volume,
    handlePlayPause,
    handleTimeUpdate,
    handleSeekChange,
    handleVolumeChange,
    toggleMute,
    handleSeek
  } = useEmotionVideoPlayer({
    emotionIntervals,
    selectedEmotions,
    duration,
    currentTime,
    setCurrentTime,
  });

  // Handle UI of Video Player when 'active'
  const { 
    showControls,
    showControlsHandler,
    onControlsMouseEnter,
    onControlsMouseLeave,
  } = useControlsVisibility( videoRef, handlePlayPause, handleSeek)

  return (
    <div
      className="bg-[#5d1283] border-2 border-black/30 rounded-lg p-4 relative focus:outline-none"
      onMouseMove={showControlsHandler}
      onMouseLeave={onControlsMouseLeave}
      style={{ userSelect: "none" }}
    >
      <div className="absolute w-[100%] h-[100%] bg-[#9c21c9] rounded-xl blur-2xl z-[-1] top-[-1%] left-[-.5%]" />
      <div className="relative z-10">
        <h1 className="lg:text-2xl font-semibold pb-2 pl-1 truncate overflow-hidden no whitespace-nowrap" title={`${title}'s EmotionMap Results`}>
          {title}&apos;s EmotionMap Results
        </h1>

        <div className="relative w-full overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full rounded-lg"
            controls={false}
            onTimeUpdate={handleTimeUpdate}
            onClick={handlePlayPause}
          />

          {/* Custom Video Player Controls */}
          {showControls && (
            <CustomVideoPlayer
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              currentTime={currentTime}
              duration={duration}
              handleSeek={handleSeekChange}
              volume={volume}
              handleVolumeChange={handleVolumeChange}
              toggleMute={toggleMute}
              onMouseEnter={onControlsMouseEnter}
              onMouseLeave={onControlsMouseLeave}
            />
          )}
        </div>

        { /* Renders Emotion Interval Bars Below the Video for UI Indicator of what emotion was determined by the model for that scene */}
        <EmotionVideoBar
          emotionIntervals={emotionIntervals}
          selectedEmotions={selectedEmotions}
          duration={duration}
          currentTime={currentTime}
        />
      </div>
    </div>
  );
};
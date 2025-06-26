import { useCallback, useRef, useState, useEffect } from "react";

export function useControlsVisibility ( 
  videoRef?: React.RefObject<HTMLVideoElement | null>,
  handlePlayPause?: () => void,
  handleSeek?: (time: number) => void
) {
	const [showControls, setShowControls] = useState(false);
	const hideControlsTimeout = useRef<number | null>(null);

	const showControlsHandler = useCallback(() => {
		setShowControls(true);
		if (hideControlsTimeout.current) 
			clearTimeout(hideControlsTimeout.current);
			hideControlsTimeout.current = window.setTimeout(() => setShowControls(false), 1500);
  }, []);

  const onControlsMouseEnter = () => {
    if (hideControlsTimeout.current) 
			clearTimeout(hideControlsTimeout.current);
  };

  const onControlsMouseLeave = () => {
    hideControlsTimeout.current = window.setTimeout(() => setShowControls(false), 1500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef?.current) return;

      switch (e.key) {
        case " ":
          e.preventDefault(); // prevent spacebar scrolling
          handlePlayPause?.();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeek?.(videoRef.current.currentTime + 5);
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeek?.(videoRef.current.currentTime - 5);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [videoRef, handlePlayPause, handleSeek]);

  return {
    showControls,
    showControlsHandler,
    onControlsMouseEnter,
    onControlsMouseLeave,
  };
}
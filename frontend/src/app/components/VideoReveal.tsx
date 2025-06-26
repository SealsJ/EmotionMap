"use client";

import axios from 'axios';
import BlurText from "./BlurText";
import VideoPlayer from "./VideoPlayer";
import UploadIcon from "./icons/UploadIcon";
import ActionButtons from "./ActionButtions";
import EmotionSelector from "./EmotionSelector";
import EmotionStatistics from "./EmotionStatistics";
import { useState } from "react";
import { EmotionData, EmotionInterval } from "../types"
import { validateVideoFile } from "../utils/validateVideoFile";
import { extractUniqueEmotions } from "../utils/extractUniqueEmotions";

import { useToast } from '../toast/ToastProvider';

export default function VideoReveal () {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [uniqueEmotions, setUniqueEmotions] = useState<string[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const { showToast } = useToast()

  // Remove or Add Emotions from the video, influences EmotionSelector to update EmotionVideoOverlay & rerender video
  const handleSelectedEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => 
      prev.includes(emotion) ? prev.filter((e => e !== emotion)) : [...prev, emotion])
  };

  // Uploads Video to backend for Emotional Processing
  const handleVideoUpload = async (file: File) => {
    try {
      console.log('Starting upload for file:', file.name);
      const formData = new FormData();
      formData.append('video', file);

      // Send to FastAPI backend
      const response = await axios.post(
        'http://localhost:8000/process_video',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      
      //If any error in respone, prevent user from continuing to next phase of Reveal Page
      if (response.data.status === 'error') {
        throw new Error(response.data.message);
      }

      console.log('Response from backend:', response.data);
      setEmotionData(response.data);
      setVideoUrl(URL.createObjectURL(file));
      setUploadedFile(file)
      const emotions = extractUniqueEmotions(response.data)
      setUniqueEmotions(emotions)
      setSelectedEmotions(emotions)
    } catch (error) {
      console.error('Full error:', error);
      //alert('Failed to process video.')
      showToast('Failed to process uploaded video. Please try again.', "error");
    } 
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const { valid, error } = validateVideoFile(file)
    // Use validateVideoFile util, if it fails abort function early to not process video
    if (!valid) { 
      //alert(error)
      showToast(error ?? "An unknown error occurred", "error")
      return;
    }

    try {
      setIsUploading(true);
      await handleVideoUpload(file!); // We can use a non-null assertion since it passed our validateVideoFile util
    } catch (error) {
      console.error('Error Uploading File:', error);
      showToast("Failed to upload video. Please try again.", "error")
      //alert('Failed to upload video. Please try again.')
    } finally {
      setIsUploading(false);
    }
  };

  // Function for Download & Share button, downloads selected emotional segments for sharing!
  const handleVideoDownload = async (
    file: File,
    emotionIntervals: EmotionInterval[],
    selectedEmotions: string[]
  ) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    try {
      setDownloading(true)
      const formData = new FormData();
      formData.append("video", file);
      formData.append("emotion_intervals", JSON.stringify(emotionIntervals));
      formData.append("selected_emotions", JSON.stringify(selectedEmotions));

      const response = await axios.post(
        `${API_BASE_URL}/export_emotion_video`,
        formData,
        {
          responseType: "blob", // important for binary download
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Create download link for the video blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "emotion_highlights.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading emotion video:", error);
      //alert("Failed to download video.");
      showToast("Failed to Download Emotion Highlights. Double Check an Emotion is Selected and Try Again.", "error")
    } finally {
      setDownloading(false)
    }
  };

  // Resets all the states to ensure if a user uploads multiple videos previous states don't carry over
  const handleVideoReset = () => {
    setVideoUrl(null);
    setEmotionData(null);
    setSelectedEmotions([]);
    setUniqueEmotions([]);
    setUploadedFile(null)
    setCurrentTime(0)
  };

  return (
    <div className="flex flex-col items-center h-[90vh] md:h-[100vh] overflow-y-auto lg:overflow-hidden">
      <div className="w-4/5 flex flex-col items-center text-white">
        {!videoUrl ? (
          <div className="flex flex-col items-center w-full">
            <BlurText
              text="Bring Hidden Emotions to Center Stage"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-2xl lg:text-5xl font-bold pt-4 lg:pt-16 lg:pb-24 pb-8"
            />
            <div className="w-full lg:w-1/2 h-[200px] rounded-lg shadow-2xl bg-transparent
              border-2 border-dashed border-white fade-up-1">
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <input 
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileChange} 
                  className="hidden"
                />
                <div className="flex items-center justify-center ">
                  {isUploading ? (
                      <p className="text-2xl lg:text-4xl font-semibold text-white animate-pulse">
                        Processing Emotions<span className="inline-block w-[1.5ch] ml-1 animate-dots text-white">.</span>
                      </p>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <UploadIcon />
                      <span className="text-2xl lg:text-4xl font-semibold">Upload Video</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full py-4">
            <div className="flex flex-col md:flex-row w-full space-x-6">
              {/* LEFT SIDE: VIDEO PLAYER + METADATA */}
              <div className="flex flex-col flex-1 w-full md:w-3/4 pb-4 md:pb-0">
                <VideoPlayer
                  videoUrl={videoUrl}
                  title={emotionData?.title}
                  emotionIntervals={emotionData?.emotion_intervals ?? []}
                  selectedEmotions={selectedEmotions}
                  duration={emotionData?.duration ?? 0}
                  currentTime={currentTime}
                  setCurrentTime={setCurrentTime}
                />
                {emotionData && ( 
                  <EmotionStatistics
                    duration = {emotionData.duration}
                    stats = {emotionData.stats}
                    title = {emotionData.title}
                    emotion_intervals={emotionData.emotion_intervals}
                  />
                )}
              </div>
              {/* RIGHT SIDE: EMOTION INTERVALS */}
              <div className="w-full md:w-1/4 flex flex-col space-y-4">
                {/* Emotions Container */}
                  <EmotionSelector 
                  emotions={uniqueEmotions}
                  selectedEmotions={selectedEmotions}
                  onToggle={handleSelectedEmotion}
                  />
                {/* Action Buttons Container */}
                  <ActionButtons 
                    onDownload={() => {
                      if (uploadedFile && emotionData) {
                        handleVideoDownload(uploadedFile, emotionData.emotion_intervals, selectedEmotions)
                      } else {
                        showToast("No Emotions Selected in Video to Export. Please try again.", "error")
                        //alert("No Emotions in Video to Export.")
                      }
                    }}
                    onReset={handleVideoReset}
                    isDownloading={downloading}
                  />
              </div>                       
            </div> 
          </div>
        )}
      </div>
    </div>
  );
};
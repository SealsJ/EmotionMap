"use client";

import { useRef } from "react";
import EmotionCarousel from "./EmotionCarousel";
import NavButton from "./NavButton";

export default function LandingHero() {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-4/5 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-0">
          {/* Left Hero Container for Title, Description, and Navigation Links */}
          <div className="w-full lg:w-1/2 space-y-3 lg:pr-40 lg:pb-18 text-left">
            <p className="pb-2 uppercase tracking-widest text-sm text-white/80 fade-left-0">
              Redefining Every Frame
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold pb-2 ml-[-4px] fade-left-1">
              EmotionMap
            </h1>
            <p className="text-lg text-white/80 leading-relaxed fade-left-2">
              Take control of your experience. EmotionMap transforms visual storytelling by bringing emotions to the spotlight.
            </p>
            <div className="flex space-x-4 pt-3">
              <NavButton href="/reveal" label="Try Now" animationClass="fade-left-3" />
              <NavButton href="/about" label="Learn More" animationClass="fade-left-3" />
            </div>
          </div>
          {/* Right Hero Container for EmotionMap Demo Video and Emotional Carousel that plays in sync*/}
          <div className="w-full lg:w-1/2 relative pb-30">
            {/* Purple Glow Behind Video */}
            <div className="absolute w-[110%] h-[55%] bg-[#9c21c9] rounded-xl blur-2xl z-0 transform translate-x-1 -translate-y-8 sm:translate-x-0"></div>
            <video
              ref={videoRef}
              src="/media/emotionmap_shortened_demo.mp4"
              autoPlay
              loop
              muted
              playsInline
							aria-label="EmotionMap Demo Video"
							title="EmotionMap Demo Video"
              className="relative z-10 rounded-xl shadow-2xl border-2 border-black/40 fade-up-0"
            />
            <p className="relative flex justify-center pt-10 z-10 uppercase tracking-widest font-semibold text-lg text-white/80 fade-up-1">Scene Emotion Reveal</p>
            <div className="flex items-center justify-center fade-up-2">
              <EmotionCarousel videoRef={videoRef}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
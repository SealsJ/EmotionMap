import BlurText from "@/app/components/BlurText";
import { Clapperboard, Monitorplay, Popcorn }from "@/app/components/icons"

// Tailwind style helpers for Audience Icon Cards
const iconWrapper = "flex items-start gap-2 lg:gap-6"
const iconAnimation = "transform transition-transform hover:scale-120 hover:translate-y-[-4px] pt-8 fade-right-0"
const cardTitle = "lg:text-xl font-semibold mb-2 fade-right-0"
const cardDescription = "text-xs lg:text-lg text-white/80 fade-right-1"

export default function About() {
  return (
    <div className="flex flex-col items-center text-white min-h-screen">
      {/* Top Section with BlurText */}
      <div className="w-4/5">
        <BlurText
          text="Unveiling Emotions Within Any Scene"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-2xl lg:text-5xl font-bold pt-4 lg:pt-16"
        />
      </div>
      <div className="w-4/5 mx-auto flex flex-col lg:flex-row lg:gap-20 lg:pt-24">
        {/* Left Section - Background and How to get Started */}
        <div className="w-full lg:w-1/2 space-y-4 lg:space-y-12 lg:pr-12 lg:pt-4">
          <h1 className="text-xl lg:text-3xl font-bold mb-4 fade-left-0 pt-4 lg:pt-12">Revisit Your Favorite Moments</h1>
            <p className="text-sm lg:text-lg text-white/80 fade-left-1">
              EmotionMap is a tool that revolutionizes how the audience engages with emotional video content. 
              By revealing the emotional structure of any video or film, YOU now have the control to interact with any story based on your emotional desires.
            </p>
          <h1 className="text-xl lg:text-3xl font-bold lg:mb-4 fade-left-0">Transform Your Experience</h1>
            <ol className="text-sm lg:text-lg leading-relaxed text-white/80 fade-left-1">
              <li>1. Upload any video clip less than 500MBs.</li> 
              <li>2. EmotionMap scans the content to reveal the most prominent emotions.</li>
              <li>3. Navigate through the results to find the emotional moments you desire.</li>
              <li>4. Clip it. Share it. Try another video!</li>
            </ol>
        </div>
        {/* Right Section - Product Audiences and Who Would Benefit Leveraging EmotionMap */}
        <div className="w-full lg:w-1/2 space-y-4 lg:space-y-16 pt-4 lg:pr-12">
          {/* Audience 1 - Casual Viewers */}
          <div className={iconWrapper}>
            <div className={iconAnimation}>
              <Popcorn />
            </div>
            <div>
              <h3 className={cardTitle}>Casual Viewers & Niche Audiences</h3>
              <p className={cardDescription}>
                From finding the moments that hit the hardest to skipping all the goosebumps and chills, EmotionMap gives viewers the agency to take control of their experience.
              </p>
            </div>
          </div>
          {/* Audience 2 - Streaming Platforms */}
          <div className={iconWrapper}>
            <div className={iconAnimation}>
              <Monitorplay />
            </div>
            <div>
              <h3 className={cardTitle}>Streaming Platforms & Product Teams</h3>
              <p className={cardDescription}>
                EmotionMap bridges the gap between Streaming Services and valuable emotional data. Enhancing recommendation engines, promoting viewer engagement, and boosting user retention.
              </p>
            </div>
          </div>
          {/* Audience 3 - Film  Directors */}
          <div className={iconWrapper}>
            <div className={iconAnimation}>
              <Clapperboard />
            </div>
            <div>
              <h3 className={cardTitle}>Content Creators & Film Directors</h3>
              <p className={cardDescription}>
                Did the reveal strike just right? Production Studios now have the power to visualize what emotions are landing with the audience before ever releasing to the big screen. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
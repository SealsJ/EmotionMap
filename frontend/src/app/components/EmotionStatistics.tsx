import { EmotionInterval, EmotionData } from '../types';
import EmotionDonutChart from './EmotionDonutChart';
import EmotionBarChart from './EmotionBarChart'
import { emotionColors } from '../constants';

export default function EmotionStatistics ({ duration, emotion_intervals }: EmotionData) {
  // Edge case for no Emotional Data
  if (!emotion_intervals || emotion_intervals.length === 0 || duration === 0) {
    return (
      <div className="mt-6 p-4 bg-[#5d1283] rounded-lg border-2 border-black/30 text-white">
        <p className="text-lg font-semibold">No emotion data available for this video</p>
        <p className="text-sm mt-1 opacity-80">Try uploading a video that contains more detectable facial expressions.</p>
      </div>
    );
  }
  
  // --- Compute Emotion Durations ---
  const emotionDurations: Record<string, number> = {};
  let lastEmotion: string | null = null;
  let switches = 0;
  let maxStreak = 0;
  let maxStreakEmotion = "";
  let currentStreak = 0;
  const streakDurations: number[] = [];

  emotion_intervals.forEach((interval: EmotionInterval) => {
    const duration = interval.end - interval.start; // Length of single interval
    const emotion = interval.dominant_emotion; // Dominant Emotion for interval

    // Accumulate duration
    emotionDurations[emotion] = (emotionDurations[emotion] || 0) + duration;

    // Track emotionl streaks
    if (emotion !== lastEmotion) {
      if (lastEmotion !== null) {
        streakDurations.push(currentStreak);
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
          maxStreakEmotion = lastEmotion;
        }
        switches++;
      }
      currentStreak = duration;
    } else {
      currentStreak += duration;
    }

    lastEmotion = emotion;
  });

  // Final streak push
  if (currentStreak > 0) {
    streakDurations.push(currentStreak);
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      maxStreakEmotion = lastEmotion!;
    }
  }

  // Calculate average length of each emotion based on total video duration
  const avgEmotionDuration =
    streakDurations.length > 0
      ? streakDurations.reduce((sum, dur) => sum + dur, 0) / streakDurations.length
      : 0;

  // Total time to compute percentages
  const totalDuration = Object.values(emotionDurations).reduce((sum, d) => sum + d, 0);

  const sortedEmotions = Object.entries(emotionDurations).sort((a, b) => b[1] - a[1]);

  const topEmotions = sortedEmotions.slice(0, 3).map(([name, value]) => ({ name, value }));

  const pieData = sortedEmotions.map(([emotion, value]) => ({
    name: emotion,
    value: parseFloat(((value / totalDuration) * 100).toFixed(2)), // percent
  }));

  const barData = sortedEmotions.map(([emotion, seconds]) => ({
    emotion,
    seconds,
  }));

  return (
    <div className="mt-3 p-4 bg-[#5d1283] rounded-lg h-auto md:h-[36vh] border-2 border-black/30 flex flex-col md:flex-row space-x-4 overflow-hidden">
      {/* Left Text Summary */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        { /*<h2 className="text-2xl font-semibold truncate fade-left-0">{title}'s Statistical Summary</h2> */}
        <ul className="flex flex-col text-sm md:text-xl space-y-1 pl-1 fade-left-1">
          <li><strong>Top 3 Emotions:</strong> {topEmotions.map(e => e.name).join(', ')}</li>
          <li><strong>Longest Emotion Streak:</strong> {maxStreakEmotion} for {maxStreak.toFixed(2)}s</li>
          <li><strong>Number of Emotion Switches:</strong> {switches}</li>
          <li><strong>Average Emotion Duration:</strong> {avgEmotionDuration.toFixed(2)}s</li>
        </ul>

        <EmotionBarChart barData={barData} emotionColors={emotionColors} />
      </div>

      {/* Right Donut Chart */}
      <div className="lg:w-[50%] flex justify-center items-center">
        <EmotionDonutChart data={pieData} emotionColors={emotionColors} />
      </div>
    </div>
  );
};
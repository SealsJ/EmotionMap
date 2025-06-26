import { AngryIcon, FearIcon, HappyIcon, NeutralIcon, SadIcon, SurpriseIcon, SickIcon, RobotIcon } from "./components/icons";

// Colors for Emotions in Emotion Selector and Emotion Statistics
export const emotionColors: Record<string, string> = {
  Happy: "#FFE95C",
  Sadness: "#A3C3D9",
  Anger: "#F25476",
  Fear: "#ED6EE5",
  Surprise: "#976FEB",
  Disgust: "#A3D585",
  Neutral: "#E2DADB",
  Unsure: "#313131",
  //Contempt: "#BF9393"
};

// Icons for Emotion Selector Buttons
export const emotionIcons: Record<string, React.ReactElement> = {
  Happy: <HappyIcon size={32} />,
  Sadness: <SadIcon size={32} />,
  Anger: <AngryIcon size={32} />,
  Fear: <FearIcon size={32} />,
  Surprise: <SurpriseIcon size={32} />,
  Neutral: <NeutralIcon size={32} />,
  Disgust: <SickIcon size={32} />,
  Unsure: <RobotIcon size={32} />
};
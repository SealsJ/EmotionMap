import cv2
import numpy as np
from deepface import DeepFace
from typing import Tuple, Dict, List

#Frontend Emotion Labels 
EMOTION_LABELS = [
    "Anger", "Disgust", "Fear", "Happy", 
    "Sadness", "Surprise", "Neutral",
]

#Mapping of Frontend Emotion Labels with Deepface Emotion Response
EMOTION_MAPPING = {
    "angry": "Anger",
    "disgust": "Disgust",
    "fear": "Fear",
    "happy": "Happy",
    "sad": "Sadness",
    "surprise": "Surprise",
    "neutral": "Neutral",
}

def run_frame_emotion_aggregation(faces: List[np.ndarray]) -> Tuple[str, Dict[str, float]]:
    if not faces or all(f is None for f in faces):
        return "Unsure", {}

    emotion_scores = []
    for frame in faces:
        if frame is None:
            continue

        try:
            bgr_face = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR) #Deepface takes Blue, Green, Red to process images
            preprocessed_frame = DeepFace.analyze(
                bgr_face,
                actions=["emotion"],
                enforce_detection=False,
                detector_backend="skip"
            )
            
            #Run Emotion Model Prediction
            raw_emotions = preprocessed_frame[0]["emotion"]
            #print(f"[DEBUG] Raw DeepFace emotion output: {raw_emotions}")
            
            #Map Emotion Predictions to a labeled Emotion Dictionary and Normalize to 0.0 - 1.0 for Average Emotion Calculation Across Frames
            scores = {
                EMOTION_MAPPING[k]: float(v) / 100.0
                for k, v in raw_emotions.items() if k in EMOTION_MAPPING
            }
            emotion_scores.append(scores)

        except Exception as e:
            print(f"[WARN] DeepFace failed on one frame: {e}")
            continue

    if not emotion_scores:
        return "Unsure", {}

    # Average scores across all successful detections
    summed = {label: 0.0 for label in EMOTION_LABELS}
    for score in emotion_scores:
        for label in EMOTION_LABELS:
            summed[label] += score.get(label, 0.0)

    # Divide each emotion's total sum by the number of frames processed to get average emotion scores across the interval
    averaged = {label: summed[label] / len(emotion_scores) for label in EMOTION_LABELS}
    #print(f"[DEBUG] AVERAGED EMOTIONS FOR SEGMENT: {averaged}")

    # Choose the emotion with highest average score
    dominant = max(averaged, key=averaged.get)
    return dominant.capitalize(), averaged
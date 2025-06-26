from models.fusion_model import fuse_emotions
from models.audio_model import run_audio_emotion_classifier
from models.facial_model import run_frame_emotion_aggregation

def analyze_segment(faces, audio):
    try:
        # Fallback unsure value, if user just uploads black screen with no audio or certain edge cases model fails.
        if faces is None and audio is None:
            return "Unsure", {}
        elif faces is not None and audio is not None: #Use Fusion Model
            _, face_probs = run_frame_emotion_aggregation(faces)
            _, audio_probs = run_audio_emotion_classifier(audio)
            return fuse_emotions(face_probs, audio_probs)
        elif faces is not None: # If no audio in segment, only use facial emotions for results
            return run_frame_emotion_aggregation(faces)
        elif audio is not None: # If no faces, landscape or skyline clips, rely purely on audio
            return run_audio_emotion_classifier(audio)
    except Exception as e:
        print(f"[ERROR] analyze_segment helper function failed: {e}")
        return "Unsure", {}
from typing import Dict, Tuple

def fuse_emotions(
    face_probs: Dict[str, float],
    audio_probs: Dict[str, float],
    weight_face: float = 0.55,
    weight_audio: float = 0.45
) -> Tuple[str, Dict[str, float]]:
    # Normalize both scores if needed
    all_emotions = set(face_probs) | set(audio_probs)
    fused_scores = {}

    for emotion in all_emotions:
        face_score = face_probs.get(emotion, 0.0)
        audio_score = audio_probs.get(emotion, 0.0)
        fused = face_score * weight_face + audio_score * weight_audio
        fused_scores[emotion] = fused

    dominant_emotion = max(fused_scores, key=fused_scores.get)
    return dominant_emotion, fused_scores
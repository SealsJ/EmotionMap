from pydantic import BaseModel, Field
from typing import List,  Dict, Optional

class EmotionInterval(BaseModel):
    start: float = Field(..., description="Start time of the interval in seconds")
    end: float = Field(..., description="End time of the interval in seconds")
    dominant_emotion: str = Field(..., description="Dominant emotion label")
    confidence: Optional[Dict[str, float]] = None

class VideoStats(BaseModel):
    total_frames: int
    fps: float

class ProcessVideoResponse(BaseModel):
    title: str
    duration: float
    stats: VideoStats
    emotion_intervals: List[EmotionInterval]
    audio: bool
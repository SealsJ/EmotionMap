import os
import json
import tempfile
from pathlib import Path
from core.emotion_utils import analyze_segment
from fastapi.responses import StreamingResponse
from moviepy import VideoFileClip, concatenate_videoclips
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from core.video_utils import save_upload_to_disk, extract_video_segments
from models.schemas import ProcessVideoResponse, VideoStats, EmotionInterval

router = APIRouter()

@router.post("/process_video", response_model=ProcessVideoResponse)
def process_video(video: UploadFile = File(...)):
    video_clip = None
    temp_video_path = None

    try:
        # Save video to temporary uploads folder for ML Processing
        upload_dir = Path(__file__).parent.parent / "uploads"
        temp_video_path = save_upload_to_disk(video, upload_dir)

        video_clip = VideoFileClip(str(temp_video_path))

        #Extract metadata from the video using moviepy
        has_audio = video_clip.audio is not None
        duration = video_clip.duration
        fps = video_clip.fps
        total_frames = int(duration * fps)

        segments = extract_video_segments(
            video_path=str(temp_video_path),
            interval=1.0,
            has_audio=has_audio
        )

        if not segments:
            raise HTTPException(status_code=400, detail="No valid segments extracted from uploaded video.")    

        # Leverage models to generate Emotion Intervals, and use Fusion Model if both visual and audio are available
        emotion_data = []
        for seg in segments:
            dominant, confidence = analyze_segment(seg.get("faces"), seg.get("audio"))

            emotion_data.append(EmotionInterval(
                start=seg["start"],
                end=seg["end"],
                dominant_emotion=dominant,
                confidence=confidence
            ))

        return ProcessVideoResponse(
            title=video.filename.replace(".mp4", ""),
            duration=round(duration, 2),
            stats=VideoStats(total_frames=total_frames, fps=fps),
            emotion_intervals=emotion_data,
            audio = has_audio
        )
    
    except Exception as e:
        print(f"Error processing video: {e}")
        raise HTTPException(status_code=500, detail="Could not process the video.")    
    finally: #Clean up temporary files
        if video_clip:
            video_clip.close()
        if temp_video_path and os.path.exists(temp_video_path):
            os.remove(temp_video_path)



@router.post("/export_emotion_video")
def export_emotion_video(
    video: UploadFile = File(...),
    emotion_intervals: str = Form(...),
    selected_emotions: str = Form(...)
):
    # Parse and validate JSON input
    try:
        intervals = json.loads(emotion_intervals)
        emotions = json.loads(selected_emotions)
    except:
        raise HTTPException(status_code=400, detail='Invalid JSON in form fields')

    #Extract valid Emotion Intervals
    valid_intervals = []
    for interval in intervals:
        try:
            if interval["dominant_emotion"] in emotions:
                start = float(interval["start"])
                end = float(interval["end"])
                if  end > start:
                    valid_intervals.append((start, end))
        except (KeyError, TypeError, ValueError):
            continue # Skip adding malformed or corrupt Emotion Intervals           


    if not valid_intervals:
        raise HTTPException(status_code=400, detail="No matching emotion intervals.")

    #Save uploaded video to a temp file for splicing
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video_file:
        temp_video_path = temp_video_file.name
        content = video.file.read()
        temp_video_file.write(content)

    #Collect valid Emotion Splices 
    try:
        video_clip = VideoFileClip(temp_video_path)
        clips = []
        
        for start,end in valid_intervals:
            try:
                clips.append(video_clip.subclipped(start, end))
            except Exception as e:
                print(f"[WARN] Skipping subclip ({start}-{end}): {e}")

        if not clips:
            raise HTTPException(status_code=400, detail="No Valid Subclips were extracted.")
        
        # Moviepy method to handle joining together spliced clips
        final_clip = concatenate_videoclips(clips)

        temp_output_path = tempfile.mktemp(suffix=".mp4")

        final_clip.write_videofile(
            temp_output_path, codec="libx264", audio_codec="aac", logger=None
        )

    finally:
        video_clip.close()
        os.unlink(temp_video_path)

    def iterfile():
        with open(temp_output_path, "rb") as f:
            yield from f
        os.unlink(temp_output_path)

    return StreamingResponse(
        iterfile(),
        media_type="video/mp4",
        headers={"Content-Disposition": "attachment; filename=EmotionMap_Highlights.mp4"},
    )
import cv2
import uuid
import numpy as np
from pathlib import Path
from fastapi import UploadFile
from moviepy import VideoFileClip
from typing import List, Dict

# Save Video Help Function
def save_upload_to_disk(video: UploadFile, upload_dir: Path) -> Path:
    upload_dir.mkdir(parents=True, exist_ok=True)
    video_id = uuid.uuid4().hex[:8]
    file_path = upload_dir / f"{video_id}_{video.filename}"

    with open(file_path, "wb") as f:
        f.write(video.file.read())

    return file_path

def is_valid_face_crop(face_crop: np.ndarray) -> bool:
    if face_crop is None:
        return False

    h, w, _ = face_crop.shape
    if h < 20 or w < 20:
        return False  # Too small to be useful

    # Check brightness
    gray = cv2.cvtColor(face_crop, cv2.COLOR_RGB2GRAY)
    brightness = np.mean(gray)
    if brightness < 20 or brightness > 250:
        return False  # Too dark or too bright

    # Optional: check sharpness (Laplacian variance)
    lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    if lap_var < 5:
        return False  # Likely too blurry

    return True

def extract_video_segments(
    video_path: str,
    interval: float = 1.0,
    has_audio: bool = True
) -> List[Dict]:
    debug_output_dir = Path("debug_faces")
    debug_output_dir.mkdir(exist_ok=True)

    #Prepare to extact segment clips
    clip = VideoFileClip(video_path)
    duration = clip.duration
    segments = []

    # Load face detector for facial Emotion Samples (OpenCV Haar Cascade)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    for i in range(int(duration // interval)):
        start = round(i * interval, 2)
        end = round(min((i + 1) * interval, duration), 2)

        # Sample 15 evenly spaced timestamps in this segment, 15 FPS Video Base
        num_samples = 15
        step = (end - start) / num_samples
        face_crops = []

        for j in range(num_samples):
            timestamp = start + j * step
            try:
                frame = clip.get_frame(timestamp)
                if frame is None:
                    raise ValueError("Frame is None.")
                gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY) #Haar Cascade requires Grey Scale for Input
                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=5) # Searches for faces in Grey Scale Frame

                if len(faces) > 0:
                    largest_face = max(faces, key=lambda rect: rect[2] * rect[3])  # rect = (x, y, w, h)
                    x, y, w, h = largest_face
                    #x, y, w, h = faces[0]
                    face_crop = frame[y:y+h, x:x+w]  # RGB crop to only include detected facial area
                    face_crops.append(face_crop)
                else:
                    face_crops.append(None)

                # Draw rectangle on original frame for Debugging OpenCV Haar Cascade Accuracy
                # debug_frame = frame.copy()
                # cv2.rectangle(debug_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                # debug_path = debug_output_dir / f"frame_{i}_{j}_boxed.jpg"
                # cv2.imwrite(str(debug_path), cv2.cvtColor(debug_frame, cv2.COLOR_RGB2BGR))

            except Exception as e:
                print(f"[WARN] Failed to extract frame at {timestamp}s: {e}")
                face_crops.append(None)

            # Debugging valid ratio of crops per segment
            # valid_crops_count = sum(1 for fc in face_crops if is_valid_face_crop(fc))
            # valid_ratio = valid_crops_count / num_samples

            # print(f"[DEBUG] Segment {i} ({start:.2f}s–{end:.2f}s): {valid_crops_count}/{num_samples} valid face crops → {valid_ratio:.2%}")

        # Extract audio segment (optional)
        audio_segment = None
        if has_audio and clip.audio:
            try:
                audio_clip = clip.subclipped(start, end).audio
                audio_segment = audio_clip.to_soundarray(fps=16000)
            except Exception as e:
                print(f"[WARN] Could not extract audio from {start}-{end}: {e}")


        segments.append({
            "start": start,
            "end": end,
            "faces": [crop for crop in face_crops if is_valid_face_crop(crop)], # List of validated faces for our facial model
            "audio": audio_segment   # Capture audio from interval each segment
        })

    clip.close()
    return segments
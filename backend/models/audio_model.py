import torch
import torchaudio
import torch.nn.functional as F
import numpy as np
from training.audio_classifier import TransformerClassifier

# Emotion categories used during training
AUDIO_EMOTIONS = ["Anger", "Disgust", "Fear", "Happy", "Sadness", "Neutral"]
EMOTION_INDEX = {i: e for i, e in enumerate(AUDIO_EMOTIONS)}

class AudioEmotionInference:
    def __init__(self, classifier_path="models/audio_classifier.pt"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Load pretrained Wav2Vec2
        self.bundle = torchaudio.pipelines.WAV2VEC2_BASE
        self.wav2vec2 = self.bundle.get_model().to(self.device).eval()

        # Load trained classifier
        self.classifier = TransformerClassifier(input_dim=768, num_classes=6).to(self.device)
        self.classifier.load_state_dict(torch.load(classifier_path, map_location=self.device))
        self.classifier.eval()

    def predict(self, waveform: np.ndarray, sr: int = 16000):
        if waveform is None or waveform.shape[0] == 0:
            return "Unsure", {}
        
         # Convert stereo to mono
        if waveform.ndim == 2 and waveform.shape[1] == 2:
            waveform = np.mean(waveform, axis=1)

        # Convert numpy to tensor and preprocess
        tensor = torch.tensor(waveform, dtype=torch.float32).unsqueeze(0)  # (1, samples)
        if sr != 16000:
            tensor = torchaudio.functional.resample(tensor, orig_freq=sr, new_freq=16000)

        if tensor.size(1) < 16000:
            pad_size = 16000 - tensor.size(1)
            tensor = torch.nn.functional.pad(tensor, (0, pad_size))

        tensor = tensor.to(self.device)
        lengths = torch.tensor([tensor.shape[1]], device=self.device)

        with torch.no_grad():
            features, _ = self.wav2vec2.extract_features(tensor, lengths)
            x = features[-1]  # last layer (B, T, 768)
            logits = self.classifier(x, lengths)
            probs = F.softmax(logits[0], dim=0).cpu().numpy()

        scores = {EMOTION_INDEX[i]: float(probs[i]) for i in range(len(probs))}
        dominant = max(scores, key=scores.get)
        return dominant, scores

# Global instance
_audio_infer = AudioEmotionInference()

def run_audio_emotion_classifier(waveform: np.ndarray, sr: int = 16000):
    return _audio_infer.predict(waveform, sr)

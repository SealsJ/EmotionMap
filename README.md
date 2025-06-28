<h2 align="center"> 🎭 EmotionMap </h2>
<hr>

<p align="center">
  <a href="#overview">Overview</a>
  •
  <a href="#audience">Audience</a>
  •
  <a href="#features">Features</a>
  •
  <a href="#tutorial">Tutorial</a>
  •
  <a href="#ml">Machine Learning Architecture</a>	
  •
  <a href="#future">Future</a>
  •
  <a href="#deployment">Deployment</a>
  •
  <a href="#disclaimers">Disclaimers</a>
</p>

---

## Overview
EmotionMap is an advanced AI tool that revolutionizes how the audience engages with emotional video content using Computer Vision & Machine Learning. By revealing the emotional structure of any video or film, YOU now have the control to interact with any story based on your emotional desires. 

## <a id="audience"></a>🎬 Who is the Audience of EmotionMap?
• <b>Casual Viewers & Niche Audiences:</b> From finding the moments that hit the hardest to skipping all the goosebumps and chills, EmotionMap gives viewers the agency to take control of their experience. <br>
• <b>Streaming Platforms & Product Teams:</b> EmotionMap bridges the gap between Streaming Services and valuable emotional data. Enhancing recommendation engines, promoting viewer engagement, and boosting user retention. <br>
• <b>Content Creators & Film Directors:</b> Did the reveal strike just right? Production Studios now have the power to visualize what emotions are landing with the audience before ever releasing to the big screen. <br> 

## <a id="features"></a>🎥 Features
• <b>Video Upload & Playback:</b> Select any `.mp4` video and view it instantly in the browser with a custom EmotionMap themed Video Player that supports Dynamic Emotional Video Splicing based on Emotion Selection. <br>
• <b>Dynamic Emotion Timeline Overlay:</b> Emotion Video Overlay that tracks with the video to inform the user what Emotion the model predicted at that interval with Confidence percentage. <br>
• <b>Emotion Filter Selector:</b> Filter video by specific emotion (Happy, Anger, Fear...). This dynamically adjusts the video so on rewatch you only experience the emotions you selected. This is connected to the Emotion Timeline Overlay which hides unselected Emotions. <br>  
• <b>Video Metadata & Analytics:</b> EmotionMap delivers an emotional breakdown of uploaded videos which includes frequency charts, a highlight of top emotions, and data regarding emotional volatility. <br>  
• <b>Emotion Based Video Download & Sharing:</b> Based on the Emotions selected, you can download the video to get "EmotionMap_Highlights" of only the emotions you are interested in. <br>
• <b>Ai Powered Emotion Detection:</b> EmotionMap uses multimodel Machine Learning models, combining facial expression recognition and voice tone analysis to detect emotions "Anger", "Disgust", "Fear", "Happy", "Sadness", "Surprise", and "Neutral". <br>

## <a id="tutorial"></a> 🧑‍💻 Tutorial
1. Upload any video clip less than 500MBs.
2. EmotionMap scans the content to reveal the most prominent emotions.
3. Navigate through the results to find the emotional moments you desire.
4. Clip it. Share it. Try another video!
> 🚧 EmotionMap walkthrough video coming soon...

## <a id="ml"></a>🤖 Machine Learning Architecture

### Facial Emotion Recognition
- **Model**: [DeepFace](https://github.com/serengil/deepface)
- **Processing**: 15 video frames per segment are collected with [MoviePy](https://pypi.org/project/moviepy/) and validated to crop faces using [OpenCV's Haar Cascade](https://github.com/opencv/opencv) before passing to Deepface model to determine Emotion Confidence per segment.

### Audio Emotion Recognition
- **Model**: Custom Trained Emotion Classifer Model using [wav2vec2](https://huggingface.co/facebook/wav2vec2-base) on [CREMA-D Dataset](https://github.com/CheyneyComputerScience/CREMA-D)
- **Processing**: Entire Audio Inteval Segment is passed to model to determine Emotion Confidence per segment.

### Fusion Model
- **Model**: Weighted Fusion (55% Facial / 45% Audio)
- **Processing**: Combinees a Weighted Average of Confidence Scores from Facial and Audio Model to determine final Emotion Confidence for each segment. This result is passed through JSON response which is delivered to frontend.

### EmotionMap Machine Learning and Computer Vision Design Diagram
<img width=100% src="https://imgur.com/a/E9ZpQRr" alt="Machine Learning and Computer Vision Design Diagram">

## <a id="future"></a> 🧪 Future Work & Development
- Add account creation to allow users to potentially store and share their EmotionMapped Videos on the platform.
- Improve MultiModel Performance to be able to handle more complex emotions or combination of Emotions with faster processing.
- Add User Engagement with Model Performance to improve the Model's training of correctly identifying certain Emotions.

## <a id="deployment"></a>🚀 Deployment
- **Frontend** is hosted on [Vercel](https://vercel.com)
- **Backend** is deployed to [Railway](https://railway.app)
- CORS is configured to allow communication between frontend and backend

## Disclaimers
- The frontend of EmotionMap is hosted on Vercel using a free account. Therefore, EmotionMap is dependent on Vercel being operational.
- The backend of EmotionMap is hosted on Railway, using a hobby tier. This is personally funded by me and sometimes hinders Model Performance but once the Monthly Quota is reached users will no longer be able to upload any videos until I raise limit.  

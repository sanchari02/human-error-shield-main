import cv2
import mediapipe as mp

class PoseEstimator:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,      
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils

    def process_frame(self, frame):
        # Convert BGR to RGB for MediaPipe
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(img_rgb)
        
        landmarks = None
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Draw skeleton
            self.mp_draw.draw_landmarks(
                frame, 
                results.pose_landmarks, 
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_draw.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
                self.mp_draw.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
            )
            
        return frame, landmarks
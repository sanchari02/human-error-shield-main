# 1. Import your new core modules at the top
from core.pose_estimation import PoseEstimator
from core.posture_rules import analyze_posture

# 2. Initialize the estimator inside your class/setup
pose_estimator = PoseEstimator()

# ... existing code ...

# 3. Inside your frame loop (where YOLO runs):
def process_video_frame(frame):
    # -> Your existing YOLO detection runs here
    
    # -> Add Pose Estimation immediately after YOLO
    frame, landmarks = pose_estimator.process_frame(frame)
    
    if landmarks:
        posture_status = analyze_posture(landmarks)
        color = (0, 0, 255) if "Unsafe" in posture_status else (0, 255, 0)
        cv2.putText(frame, f"Posture: {posture_status}", (20, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3, cv2.LINE_AA)
                    
    return frame
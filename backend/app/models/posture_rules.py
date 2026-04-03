import math

def calculate_angle(point1, point2, point3):
    x1, y1 = point1.x, point1.y
    x2, y2 = point2.x, point2.y
    x3, y3 = point3.x, point3.y
    
    radians = math.atan2(y3 - y2, x3 - x2) - math.atan2(y1 - y2, x1 - x2)
    angle = abs(radians * 180.0 / math.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def analyze_posture(landmarks):
    if not landmarks:
        return "Unknown"

    # 11: Left Shoulder, 23: Left Hip, 25: Left Knee
    shoulder = landmarks[11]
    hip = landmarks[23]
    knee = landmarks[25]

    hip_angle = calculate_angle(shoulder, hip, knee)

    if hip_angle < 120:
        return "Unsafe: Bending"
    return "Safe: Standing"
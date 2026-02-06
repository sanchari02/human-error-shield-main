import cv2
from typing import List, Dict, Tuple

from ..config import COLOR_SAFE, COLOR_LOW, COLOR_HIGH

def draw_detections(frame, detections: List[Dict], font_scale=0.7):
    for d in detections:
        x1, y1, x2, y2 = map(int, d["bbox"])
        label = f'{d["class_name"]} {d["confidence"]:.2f}'
        color = (0, 255, 255) if "no_" in d["class_name"] else (0, 255, 0)
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        cv2.putText(frame, label, (x1, max(0, y1 - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, 2)
    return frame

def draw_risk_banner(frame, risk: str):
    if risk == "HIGH":
        color = COLOR_HIGH
        text = "HIGH RISK: Missing Safety Equipment!"
    elif risk == "SAFE":
        color = COLOR_SAFE
        text = "SAFE: All equipment detected"
    elif risk == "LOW":
        color = COLOR_LOW
        text = "LOW RISK: Partial equipment"
    else:
        color = (0, 255, 255)
        text = "UNKNOWN: Check equipment"

    banner_h = 60
    cv2.rectangle(frame, (0, 0), (frame.shape[1], banner_h), color, -1)
    cv2.putText(frame, risk, (10, 35), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 2)
    cv2.putText(frame, text, (10, 58), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    return frame

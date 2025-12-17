# backend/app/models/yolo_service.py
from typing import List, Dict, Any
import cv2
import numpy as np
from ultralytics import YOLO
from ..config import WEIGHTS_PATH, CONF_THRESHOLD, CLASS_NAMES

class YOLOService:
    def __init__(self):
        # Load once for the app lifecycle
        self.model = YOLO(str(WEIGHTS_PATH))

    def predict_image(self, image_bgr: np.ndarray) -> List[Dict[str, Any]]:
        # Run inference
        results = self.model(image_bgr, conf=CONF_THRESHOLD, verbose=False)
        dets = []
        if not results or len(results) == 0:
            return dets
        boxes = results[0].boxes
        names = self.model.names
        h, w = image_bgr.shape[:2]

        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
            dets.append({
                "class_id": cls_id,
                "class_name": names.get(cls_id, str(cls_id)) if isinstance(names, dict) else CLASS_NAMES[cls_id],
                "confidence": conf,
                "bbox": [float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])]
            })
        return dets

    def assess_risk(self, detections: List[Dict[str, Any]]) -> str:
        # Simple rules: HIGH if any no_helmet or no_gloves; SAFE if helmet and gloves seen; LOW otherwise.
        helmet = any(d["class_name"] == "helmet" for d in detections)
        gloves = any(d["class_name"] == "gloves" for d in detections)
        no_helmet = any(d["class_name"] == "no_helmet" for d in detections)
        no_gloves = any(d["class_name"] == "no_gloves" for d in detections)

        if no_helmet or no_gloves:
            return "HIGH"
        if helmet and gloves:
            return "SAFE"
        if helmet or gloves:
            return "LOW"
        return "UNKNOWN"

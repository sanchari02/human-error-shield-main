from typing import List, Dict, Any
import cv2
import numpy as np
from ultralytics import YOLO
from ..config import WEIGHTS_PATH, CONF_THRESHOLD, CLASS_NAMES

class YOLOService:
    def __init__(self):
        self.model = YOLO(str(WEIGHTS_PATH))
        
        # --- DYNAMIC SETTINGS INITIALIZATION ---
        # We start with defaults from config.py, but these can be changed at runtime
        self.conf_threshold = CONF_THRESHOLD
        self.iou_threshold = 0.45  # Default IoU
        
        # Map human-readable names to Model IDs
        # Update these IDs if your model's class list is different
        self.class_map = {
            "helmet": 0, 
            "gloves": 1, 
            "vest": 2, 
            "boots": 3, 
            "goggles": 4
        }
        
        # State: Which classes are currently turned ON?
        self.active_classes = {
            "helmet": True, 
            "gloves": True, 
            "vest": True, 
            "boots": True, 
            "goggles": True
        }
        
        self.person_class_id = 6

    def update_settings(self, conf: int, iou: int, classes: Dict[str, bool]):
        """Called by the Settings API to update thresholds live."""
        self.conf_threshold = conf / 100.0
        self.iou_threshold = iou / 100.0
        self.active_classes = classes
        print(f"DEBUG: Updated Settings -> Conf: {self.conf_threshold}, Active: {self.active_classes}")

    def get_settings(self):
        """Called by the Settings API to populate the Admin panel."""
        return {
            "confidence": int(self.conf_threshold * 100),
            "iou": int(self.iou_threshold * 100),
            "classes": self.active_classes
        }

    def predict_image(self, image_bgr: np.ndarray) -> List[Dict[str, Any]]:
        # 1. GRAYSCALE CONVERSION
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        image_processed = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

        # 2. RUN INFERENCE (Use dynamic confidence)
        results = self.model(image_processed, conf=self.conf_threshold, verbose=False)
        dets = []
        
        if not results or len(results) == 0:
            return dets
        
        boxes = results[0].boxes
        names = self.model.names

        for box in boxes:
            cls_id = int(box.cls[0])
            
            # Identify the class name
            raw_name = names.get(cls_id, str(cls_id)) if isinstance(names, dict) else names[cls_id]
            
            # --- FILTERING LOGIC ---
            # Check if this class is mapped to a config key (like 'helmet')
            # and if that key is disabled in settings.
            config_key = None
            for key, val in self.class_map.items():
                if val == cls_id:
                    config_key = key
                    break
            
            # If it's a known PPE class and it's turned OFF, skip it!
            if config_key and not self.active_classes.get(config_key, True):
                continue
            # -----------------------

            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()  
            dets.append({
                "class_id": cls_id,
                "class_name": raw_name,
                "confidence": conf,
                "bbox": [float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])]
            })
        return dets

    def check_overlap(self, box1, box2):
        """Check if two boxes overlap."""
        x1_max = max(box1[0], box2[0])
        y1_max = max(box1[1], box2[1])
        x2_min = min(box1[2], box2[2])
        y2_min = min(box1[3], box2[3])

        if x2_min < x1_max or y2_min < y1_max:
            return False  # No overlap
        return True

    def assess_risk(self, detections: List[Dict[str, Any]]) -> str:
        """
        Determine risk based on Person + Active PPE overlap.
        """
        persons = []
        valid_ppe_items = []
        
        # Get IDs of currently active PPE
        active_ids = [self.class_map[k] for k, v in self.active_classes.items() if v]

        for d in detections:
            if d['class_id'] == self.person_class_id:
                persons.append(d['bbox'])
            # Only consider PPE that is turned ON
            elif d['class_id'] in active_ids:
                valid_ppe_items.append(d['bbox'])

        if not persons:
            return "NO WORKER"

        person_safe_count = 0
        
        for person_box in persons:
            has_ppe = False
            for ppe_box in valid_ppe_items:
                if self.check_overlap(person_box, ppe_box):
                    has_ppe = True
                    break
            
            if has_ppe:
                person_safe_count += 1
        
        if person_safe_count > 0:
            return "SAFE"
            
        return "HIGH"
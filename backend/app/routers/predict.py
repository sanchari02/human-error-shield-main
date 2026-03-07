from typing import List, Dict, Any
import cv2
import numpy as np
from ultralytics import YOLO
from ..config import WEIGHTS_PATH, CONF_THRESHOLD


class YOLOService:
    def __init__(self):
        self.model = YOLO(str(WEIGHTS_PATH))

        # Runtime settings
        self.conf_threshold = CONF_THRESHOLD
        self.iou_threshold = 0.45

        # PPE toggle state
        self.active_classes = {
            "helmet": True,
            "goggles": True,
            "gloves": True,
            "boots": True,
            "vest": True
        }

        # Class mapping from data.yaml
        self.class_map = {
            "person": 0,
            "head": 1,
            "torso": 2,
            "upper_arm": 3,
            "lower_arm": 4,
            "hand": 5,
            "upper_leg": 6,
            "lower_leg": 7,
            "foot": 8,

            "helmet": 9,
            "no_helmet": 10,
            "goggles": 11,
            "no_goggle": 12,
            "gloves": 13,
            "no_gloves": 14,
            "boots": 15,
            "no_boots": 16,
            "vest": 17,
            "no_vest": 18
        }

        self.person_class_id = self.class_map["person"]

        # PPE -> violation mapping
        self.violation_map = {
            "helmet": "no_helmet",
            "goggles": "no_goggle",
            "gloves": "no_gloves",
            "boots": "no_boots",
            "vest": "no_vest"
        }

    def update_settings(self, conf: int, iou: int, classes: Dict[str, bool]):
        """Update thresholds and active PPE checks."""
        self.conf_threshold = conf / 100.0
        self.iou_threshold = iou / 100.0
        self.active_classes = classes

        print(
            f"DEBUG: Updated Settings -> "
            f"Conf: {self.conf_threshold}, IoU: {self.iou_threshold}, "
            f"Classes: {self.active_classes}"
        )

    def get_settings(self):
        """Return current runtime settings."""
        return {
            "confidence": int(self.conf_threshold * 100),
            "iou": int(self.iou_threshold * 100),
            "classes": self.active_classes
        }

    def predict_image(self, image_bgr: np.ndarray) -> List[Dict[str, Any]]:
        """
        Run YOLO inference and return filtered detections
        """

        # Convert to grayscale (your preprocessing)
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        image_processed = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

        results = self.model(image_processed, conf=self.conf_threshold, verbose=False)

        detections = []

        if not results or len(results) == 0:
            return detections

        boxes = results[0].boxes
        names = self.model.names

        # Determine which violation classes should be active
        active_violation_ids = []
        for ppe, enabled in self.active_classes.items():
            if enabled:
                violation_class = self.violation_map[ppe]
                active_violation_ids.append(self.class_map[violation_class])

        for box in boxes:

            cls_id = int(box.cls[0])

            raw_name = names.get(cls_id, str(cls_id)) if isinstance(names, dict) else names[cls_id]

            # Skip violations that are disabled in settings
            if cls_id in [
                self.class_map["no_helmet"],
                self.class_map["no_goggle"],
                self.class_map["no_gloves"],
                self.class_map["no_boots"],
                self.class_map["no_vest"]
            ] and cls_id not in active_violation_ids:
                continue

            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()

            detections.append({
                "class_id": cls_id,
                "class_name": raw_name,
                "confidence": conf,
                "bbox": [
                    float(xyxy[0]),
                    float(xyxy[1]),
                    float(xyxy[2]),
                    float(xyxy[3])
                ]
            })

        return detections

    def check_overlap(self, box1, box2):
        """Check if two bounding boxes overlap"""

        x1_max = max(box1[0], box2[0])
        y1_max = max(box1[1], box2[1])
        x2_min = min(box1[2], box2[2])
        y2_min = min(box1[3], box2[3])

        if x2_min < x1_max or y2_min < y1_max:
            return False

        return True

    def assess_risk(self, detections: List[Dict[str, Any]]) -> str:
        """
        Determine risk level based on PPE violations
        """

        persons = []
        violations = []

        # Determine active violation IDs
        active_violation_ids = []
        for ppe, enabled in self.active_classes.items():
            if enabled:
                violation_class = self.violation_map[ppe]
                active_violation_ids.append(self.class_map[violation_class])

        for d in detections:

            if d["class_id"] == self.person_class_id:
                persons.append(d["bbox"])

            elif d["class_id"] in active_violation_ids:
                violations.append(d["bbox"])

        if not persons:
            return "NO WORKER"

        # If violation overlaps with any person → HIGH risk
        for person_box in persons:
            for violation_box in violations:
                if self.check_overlap(person_box, violation_box):
                    return "HIGH"

        return "SAFE"
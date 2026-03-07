from typing import List, Dict, Any
import cv2
import numpy as np
from ultralytics import YOLO
from ..config import WEIGHTS_PATH, CONF_THRESHOLD


class YOLOService:
    def __init__(self):
        self.model = YOLO(str(WEIGHTS_PATH))

        # Detection thresholds
        self.conf_threshold = CONF_THRESHOLD
        self.iou_threshold = 0.45

        # PPE classes user can toggle
        self.active_classes = {
            "helmet": True,
            "goggles": True,
            "gloves": True,
            "boots": True,
            "vest": True
        }

        # Class IDs from data.yaml
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

        # Map PPE -> violation class
        self.violation_map = {
            "helmet": "no_helmet",
            "goggles": "no_goggle",
            "gloves": "no_gloves",
            "boots": "no_boots",
            "vest": "no_vest"
        }

    def update_settings(self, conf: int, iou: int, classes: Dict[str, bool]):
        """Update detection parameters at runtime"""
        self.conf_threshold = conf / 100.0
        self.iou_threshold = iou / 100.0
        self.active_classes = classes

        print(
            f"Settings Updated: Conf={self.conf_threshold}, "
            f"IoU={self.iou_threshold}, Classes={self.active_classes}"
        )

    def get_settings(self):
        return {
            "confidence": int(self.conf_threshold * 100),
            "iou": int(self.iou_threshold * 100),
            "classes": self.active_classes
        }

    def predict_image(self, image_bgr: np.ndarray) -> List[Dict[str, Any]]:
        """Run YOLO inference"""

        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        image_processed = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

        results = self.model(image_processed, conf=self.conf_threshold, verbose=False)

        detections = []

        if not results or len(results) == 0:
            return detections

        boxes = results[0].boxes
        names = self.model.names

        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()

            detections.append({
                "class_id": cls_id,
                "class_name": names.get(cls_id, str(cls_id)),
                "confidence": conf,
                "bbox": [float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])]
            })

        return detections

    def check_overlap(self, box1, box2):
        """Check bounding box intersection"""

        x1_max = max(box1[0], box2[0])
        y1_max = max(box1[1], box2[1])
        x2_min = min(box1[2], box2[2])
        y2_min = min(box1[3], box2[3])

        if x2_min < x1_max or y2_min < y1_max:
            return False

        return True

    def assess_risk(self, detections: List[Dict[str, Any]]) -> str:
        """
        Determine worker safety based on PPE violations
        """

        persons = []
        violations = []

        # Active PPE violation IDs
        active_violation_ids = []

        for ppe, enabled in self.active_classes.items():
            if enabled:
                violation_class = self.violation_map[ppe]
                active_violation_ids.append(self.class_map[violation_class])

        # Separate detections
        for d in detections:

            if d["class_id"] == self.person_class_id:
                persons.append(d["bbox"])

            elif d["class_id"] in active_violation_ids:
                violations.append(d["bbox"])

        if not persons:
            return "NO WORKER"

        # Check if any violation overlaps with a person
        for person_box in persons:
            for v_box in violations:

                if self.check_overlap(person_box, v_box):
                    return "HIGH"

        return "SAFE"
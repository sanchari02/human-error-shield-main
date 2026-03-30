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

        #gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        #image_processed = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

        results = self.model(image_bgr, conf=self.conf_threshold, verbose=False)

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

        # Calculate the center (X, Y) of the PPE item
        box2_center_x = (box2[0] + box2[2]) / 2.0
        box2_center_y = (box2[1] + box2[3]) / 2.0

        # Check if that center point falls within box1 (the Person) boundaries
        is_inside_x = box1[0] <= box2_center_x <= box1[2]
        is_inside_y = box1[1] <= box2_center_y <= box1[3]

        return bool(is_inside_x and is_inside_y)

    def assess_risk(self, detections: List[Dict[str, Any]]) -> str:
        """
        Determine worker safety based on PPE violations
        """

        persons = []
        positive_ppe_detections = []
        violation_detections = []

        # Active PPE violation IDs
        required_ppe_ids = []
        active_violation_ids = []

        for ppe, enabled in self.active_classes.items():
            if enabled:
                # E.g., The ID for "helmet" (positive)
                required_ppe_ids.append(self.class_map[ppe])
                # E.g., The ID for "no_helmet" (explicit violation)
                violation_class = self.violation_map[ppe]
                active_violation_ids.append(self.class_map[violation_class])

        # 2. Separate detections into buckets
        for d in detections:
            cid = d["class_id"]
            if cid == self.person_class_id:
                persons.append(d["bbox"])
            elif cid in required_ppe_ids:
                positive_ppe_detections.append(d)
            elif cid in active_violation_ids:
                violation_detections.append(d["bbox"])

        # If no people are in the frame, nothing is at risk
        if not persons:
            return "NO WORKER"

        # 3. Assess each person (Guilty until proven innocent)
        # If ANY person is unsafe, the whole scene is HIGH risk.
        for person_box in persons:
            
            # --- Check A: Did the model explicitly see a violation? ---
            # (e.g., it specifically detected "no_helmet" overlapping this person)
            for v_box in violation_detections:
                if self.check_overlap(person_box, v_box):
                    return "HIGH"

            # --- Check B: Does the person actually have ALL required PPE? ---
            # If the admin requires Helmet AND Vest, we must find both.
            for req_ppe_id in required_ppe_ids:
                has_this_ppe = False
                
                # Look through all the positive PPE the AI found in the frame
                for ppe_d in positive_ppe_detections:
                    if ppe_d["class_id"] == req_ppe_id:
                        # Does this PPE physically overlap with this specific person?
                        if self.check_overlap(person_box, ppe_d["bbox"]):
                            has_this_ppe = True
                            break # Great, they have this specific item!
                
                # If we checked all detected PPE and didn't find the required item:
                if not has_this_ppe:
                    return "HIGH" # Missing equipment! Trigger alarm.

        # 4. If we checked every person, and nobody triggered a HIGH risk, we are safe.
        return "SAFE"
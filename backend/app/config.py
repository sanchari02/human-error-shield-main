# backend/app/config.py
from pathlib import Path

# Project root (two levels up from this file)
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Absolute path to YOLO weights trained in your notebook
# Example: C:/Users/ASUS/human-error-shield/models/safety_detector_v1/weights/best.pt
WEIGHTS_PATH = PROJECT_ROOT / "models" / "safety_detector_v13" / "weights" / "best.pt"

# Inference defaults
CONF_THRESHOLD = 0.5
IMG_SIZE = 640

# Class names should match your training
CLASS_NAMES = ['helmet', 'no_helmet', 'gloves', 'no_gloves']

# Risk color codes (BGR)
COLOR_SAFE = (0, 200, 0)
COLOR_LOW  = (0, 165, 255)
COLOR_HIGH = (0, 0, 255)

from pathlib import Path
PROJECT_ROOT = Path(__file__).resolve().parents[2]

WEIGHTS_PATH = (
    Path("D:/")
    / "Project"
    / "human-error-shield-main"
    / "human-error-shield-model"
    / "models"
    / "safety_detector_v13"
    / "weights"
    / "best.pt"
)

CONF_THRESHOLD = 0.5
IMG_SIZE = 640

import yaml

# Load class names dynamically from data.yaml
DATA_YAML_PATH = PROJECT_ROOT / "human-error-shield-model" / "dataset" / "data.yaml"
with open(DATA_YAML_PATH, 'r') as f:
    data_yaml = yaml.safe_load(f)
CLASS_NAMES = list(data_yaml['names'].values())

COLOR_SAFE = (0, 200, 0)
COLOR_LOW  = (0, 165, 255)
COLOR_HIGH = (0, 0, 255)

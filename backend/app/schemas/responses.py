from typing import List
from pydantic import BaseModel

class BBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: List[float]  

class PredictResponse(BaseModel):
    risk: str
    detections: List[Detection]

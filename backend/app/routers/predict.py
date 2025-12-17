# backend/app/routers/predict.py
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File
from typing import List
from ..models.yolo_service import YOLOService
from ..schemas.responses import PredictResponse, Detection

router = APIRouter(prefix="/predict", tags=["predict"])
service = YOLOService()  # load model once

@router.post("", response_model=PredictResponse)
async def predict_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    detections = service.predict_image(image)
    risk = service.assess_risk(detections)
    return {"risk": risk, "detections": detections}

@router.post("/batch")
async def predict_batch(files: List[UploadFile] = File(...)):
    out = []
    for f in files:
        image_bytes = await f.read()
        arr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        detections = service.predict_image(image)
        risk = service.assess_risk(detections)
        out.append({"filename": f.filename, "risk": risk, "detections": detections})
    return {"results": out}

# backend/app/routers/video.py
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from ..models.yolo_service import YOLOService
from ..utils.draw import draw_detections, draw_risk_banner
import time

router = APIRouter(prefix="/video", tags=["video"])
service = YOLOService()

@router.post("/process")
async def process_video(file: UploadFile = File(...)):
    # Save uploaded video to temp and process frame-by-frame
    data = await file.read()
    tmp_path = f"temp_{int(time.time())}.mp4"
    with open(tmp_path, "wb") as f:
        f.write(data)

    cap = cv2.VideoCapture(tmp_path)
    processed_frames = 0
    risks = {"HIGH": 0, "LOW": 0, "SAFE": 0, "UNKNOWN": 0}

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        dets = service.predict_image(frame)
        risk = service.assess_risk(dets)
        risks[risk] = risks.get(risk, 0) + 1
        processed_frames += 1

    cap.release()
    return JSONResponse({"frames": processed_frames, "risk_counts": risks})

@router.get("/stream")
def stream_webcam():
    # Streams webcam frames with overlays using multipart/x-mixed-replace
    def gen():
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            # gracefully end stream if camera not available
            yield b""
            return
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                dets = service.predict_image(frame)
                risk = service.assess_risk(dets)
                frame = draw_detections(frame, dets)
                frame = draw_risk_banner(frame, risk)

                ok, jpg = cv2.imencode(".jpg", frame)
                if not ok:
                    continue
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n")
        finally:
            cap.release()

    return StreamingResponse(gen(), media_type="multipart/x-mixed-replace; boundary=frame")

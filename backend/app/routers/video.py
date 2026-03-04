import cv2
import numpy as np
import os
import time
from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from ..dependencies import get_yolo_service
from ..models.yolo_service import YOLOService
from ..utils.draw import draw_detections, draw_risk_banner

router = APIRouter(prefix="/video", tags=["video"])

def create_error_frame(message):
    """Generates a black frame with error text for debugging."""
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(frame, message, (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 
                1, (0, 0, 255), 2, cv2.LINE_AA)
    return frame

@router.post("/process")
async def process_video(
    file: UploadFile = File(...), 
    service: YOLOService = Depends(get_yolo_service)
):
    # ... (Keep your existing process logic here) ...
    # This part is fine, we are focusing on the stream below
    data = await file.read()
    tmp_path = f"temp_{int(time.time())}.mp4"
    with open(tmp_path, "wb") as f:
        f.write(data)
    cap = cv2.VideoCapture(tmp_path)
    processed_frames = 0
    risks = {"HIGH": 0, "LOW": 0, "SAFE": 0, "UNKNOWN": 0}
    try:
        while True:
            ret, frame = cap.read()
            if not ret: break
            dets = service.predict_image(frame)
            risk = service.assess_risk(dets)
            risks[risk] = risks.get(risk, 0) + 1
            processed_frames += 1
    finally:
        cap.release()
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
    return JSONResponse({"frames": processed_frames, "risk_counts": risks})


@router.get("/stream")
def stream_webcam(service: YOLOService = Depends(get_yolo_service)):
    def gen():
        # 1. Attempt to open Camera 0 (Default)
        # cv2.CAP_DSHOW is often needed on Windows for faster access
        cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        
        # 2. If 0 fails, try 1 (External USB Camera)
        if not cap.isOpened():
            print("Camera 0 failed, trying Camera 1...")
            cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)

        # 3. If BOTH fail, stream a "Error" video instead of crashing
        if not cap.isOpened():
            print("CRITICAL: No camera found. Streaming error frame.")
            while True:
                # Stream a static error image so the frontend doesn't break
                frame = create_error_frame("CAMERA NOT FOUND - CHECK TERMINAL")
                ok, jpg = cv2.imencode(".jpg", frame)
                if ok:
                    yield (b"--frame\r\n"
                           b"Content-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n")
                time.sleep(1) # Prevent CPU spike
            return

        # 4. Normal Streaming Loop
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    # If camera disconnects mid-stream
                    frame = create_error_frame("CAMERA DISCONNECTED")
                else:
                    # AI Processing
                    try:
                        dets = service.predict_image(frame)
                        risk = service.assess_risk(dets)
                        frame = draw_detections(frame, dets)
                        frame = draw_risk_banner(frame, risk)
                    except Exception as e:
                        print(f"AI Error: {e}")
                        cv2.putText(frame, "AI INFERENCE ERROR", (10, 30), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255), 2)

                ok, jpg = cv2.imencode(".jpg", frame)
                if not ok: continue

                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n")
                
                # Tiny sleep to allow context switching
                time.sleep(0.01)

        finally:
            cap.release()

    return StreamingResponse(gen(), media_type="multipart/x-mixed-replace; boundary=frame")
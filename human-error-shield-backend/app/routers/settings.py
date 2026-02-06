from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict
from ..dependencies import get_yolo_service
from ..models.yolo_service import YOLOService

router = APIRouter(prefix="/settings", tags=["settings"])

class SettingsModel(BaseModel):
    confidence: int
    iou: int
    classes: Dict[str, bool]

@router.get("/")
def get_current_settings(service: YOLOService = Depends(get_yolo_service)):
    return service.get_settings()

@router.post("/")
def update_settings(settings: SettingsModel, service: YOLOService = Depends(get_yolo_service)):
    service.update_settings(settings.confidence, settings.iou, settings.classes)
    return {"status": "updated", "settings": settings}
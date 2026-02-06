from functools import lru_cache
from .models.yolo_service import YOLOService

# @lru_cache ensures we only create the service ONCE (Singleton)
# It will verify the model path only when the first request comes in.
@lru_cache()
def get_yolo_service():
    print("Initializing YOLO Service...")
    return YOLOService()
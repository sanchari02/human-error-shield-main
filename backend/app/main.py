# backend/app/main.py
from fastapi import FastAPI
from .routers import predict, video, health

app = FastAPI(title="Human Error Shield API", version="1.0.0")

# Routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(video.router)

# Root
@app.get("/")
def root():
    return {
        "name": "Human Error Shield API",
        "endpoints": ["/health", "/predict", "/predict/batch", "/video/process", "/video/stream"]
    }

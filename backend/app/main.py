from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from .routers import predict, video, health, settings # <--- IMPORT settings
import os
import json

app = FastAPI(title="Human Error Shield API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(video.router)
app.include_router(settings.router) # <--- ADD THIS

app.mount("/incidents", StaticFiles(directory="incidents"), name="incidents")

@app.get("/")
def root():
    return {"name": "Human Error Shield API", "status": "Running"}

@app.get("/api/history")
def get_history():
    history_file = "incidents/history.json"
    if os.path.exists(history_file):
        with open(history_file, "r") as f:
            logs = json.load(f)
        return JSONResponse(content=logs)
    return JSONResponse(content=[])

    
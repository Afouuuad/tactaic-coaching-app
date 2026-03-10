from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="TactAIQ AI Service",
    description="Microservice for Computer Vision (YOLO) and Player Attribute Inference",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000", # React Frontend
    "http://localhost:5000", # Node.js Backend (Original)
    "http://localhost:5001", # Node.js Backend (Active)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to save uploaded videos
UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "TactAIQ AI Service is running"}

# Import routers (to be implemented)
# Handle imports for both script execution and package run
import sys
from pathlib import Path

# Add the current directory to sys.path to ensure 'routers' can be found
current_dir = Path(__file__).resolve().parent
sys.path.append(str(current_dir))

from routers import video_analysis

app.include_router(video_analysis.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

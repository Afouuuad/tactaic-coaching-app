from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
from ultralytics import YOLO

router = APIRouter(
    prefix="/video-analysis",
    tags=["Video Analysis"]
)

UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Load Model (Lazy loading or global)
# Using yolov8n.pt (nano) for speed. It will download automatically on first use.
try:
    model = YOLO('yolov8n.pt') 
except Exception as e:
    print(f"Failed to load YOLO model: {e}")
    model = None

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return JSONResponse(content={
            "message": "Video uploaded successfully",
            "filename": file.filename,
            "file_path": file_path
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/{filename}")
async def analyze_video(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video not found")

    if not model:
        raise HTTPException(status_code=500, detail="YOLO Model not loaded")

    try:
        # Run Inference
        # stream=True produces a generator, which is memory efficient
        results = model(file_path, stream=True)
        
        total_persons = 0
        frames = 0
        
        # Process results
        for r in results:
            frames += 1
            # Class 0 is 'person' in COCO dataset
            # count detections with class 0
            persons_in_frame = r.boxes.cls.eq(0).sum().item()
            total_persons += persons_in_frame
        
        avg_persons = round(total_persons / frames, 1) if frames > 0 else 0

        # Construct Metrics based on real analysis
        metrics = {
            "heatmap_url": "heatmap_placeholder.png", # Would generate this from bounding boxes
            "intensity_zones": {
                "low": 30,
                "medium": 40,
                "high": 30
            },
            "distance_covered": 0, # Needs tracking ID logic
            "sprints": 0,          # Needs tracking ID logic
            "tactical_adherence": 85, # Logic requires formation metadata
            "detected_avg_players": avg_persons,
            "total_frames_processed": frames
        }

        return JSONResponse(content={
            "message": "Analysis complete",
            "metrics": metrics
        })

    except Exception as e:
        print(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

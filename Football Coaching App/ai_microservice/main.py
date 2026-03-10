from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from tracker import TacticalAnalyzer

app = FastAPI(title="TactAIQ Tactical AI Microservice", version="1.0.0")

# Setup CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize Analyzer (loads YOLO context)
analyzer = TacticalAnalyzer(pitch_length=105, pitch_width=68)

@app.get("/")
def read_root():
    return {"status": "online", "message": "TactAIQ AI Microservice is running."}

@app.post("/api/process-video")
async def process_video(
    video: UploadFile = File(...),
    calibrationPoints: str = Form(...), # Expected JSON string of 4 {x,y} points
    teamCentroids: str = Form(...),     # Expected JSON string of 2 {x,y} points
    attackDirection: str = Form(...)    # "leftToRight" or "rightToLeft"
):
    try:
        # Save uploaded video
        file_path = os.path.join(UPLOAD_DIR, video.filename)
        with open(file_path, "wb") as f:
            content = await video.read()
            f.write(content)
            
        print(f"Received video: {video.filename}")
        
        # Parse Frontend JSON Clicks
        calib_pts = json.loads(calibrationPoints)
        src_points = [[pt['x'], pt['y']] for pt in calib_pts]
        
        team_pts = json.loads(teamCentroids)
        centroid_points = [[pt['x'], pt['y']] for pt in team_pts]
        
        # 1. Calibrate Homography
        success = analyzer.calibrate_homography(src_points)
        if not success:
            raise HTTPException(status_code=400, detail="Homography calibration failed.")
            
        # 2. Extract Team Colors from First Frame
        import cv2
        cap = cv2.VideoCapture(file_path)
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            raise HTTPException(status_code=400, detail="Could not read video first frame.")
            
        analyzer.set_team_colors(frame, centroid_points)
        
        # 3. Process the full video
        results = analyzer.process_video(file_path)
        
        return {
            "status": "success",
            "message": "Video analysis completed",
            "metrics": {
                "detected_avg_players": 20, # Mocked high-level summary stats
                "tactical_adherence": 85,
                "intensity_zones": {"low": 30, "medium": 50, "high": 20},
                "total_frames_processed": results["total_frames_processed"]
            },
            "telemetry": results["telemetry"]
        }
        
    except Exception as e:
        print(f"Error processing video: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

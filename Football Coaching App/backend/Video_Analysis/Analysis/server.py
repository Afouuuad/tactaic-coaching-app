from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from processor import process_video

app = FastAPI()

# --- ALLOW REACT TO TALK TO PYTHON ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, verify this is localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.post("/analyze-video/")
async def analyze_video(file: UploadFile = File(...)):
    # 1. Save uploaded file
    filename = file.filename.replace(" ", "_")
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 2. Run AI Processing
    output_video, output_heatmap, output_stats = process_video(input_path, OUTPUT_FOLDER)

    # 3. Return Links
    base_url = "http://localhost:8000"
    return {
        "video_url": f"{base_url}/download/{os.path.basename(output_video)}",
        "heatmap_url": f"{base_url}/download/{os.path.basename(output_heatmap)}",
        "stats_url": f"{base_url}/download/{os.path.basename(output_stats)}"
    }

@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Video Analysis API!"}

@app.get("/favicon.ico")
def favicon():
    return {"message": "No favicon available"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
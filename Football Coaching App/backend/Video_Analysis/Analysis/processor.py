import os
import cv2
from main import main
from heatmap_generator import generate_heatmap
from stats_generator import generate_stats
from ultralytics import YOLO
from yolo_inference import run_yolo_inference

def process_video(input_video_path, output_folder):
    # Run YOLO inference
    yolo_output_folder = run_yolo_inference(input_video_path, output_folder)

    # Open the input video
    cap = cv2.VideoCapture(input_video_path)
    if not cap.isOpened():
        raise Exception("Error: Unable to open input video.")

    # Get video properties
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')

    # Define output paths
    video_out = os.path.join(output_folder, "analyzed.avi")
    heatmap_out = os.path.join(output_folder, "heatmap.png")
    stats_out = os.path.join(output_folder, "stats.json")
    out = cv2.VideoWriter(video_out, fourcc, fps, (width, height))

    # Initialize stats
    stats = {
        "completed_passes": 0,
        "player_positions": [],
        "ball_trajectory": []
    }

    # Process frames
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Perform object detection
        results = model(frame)
        detections = results.xyxy[0].cpu().numpy()  # Extract detections

        # Track players and ball
        for det in detections:
            x1, y1, x2, y2, conf, cls = det
            label = model.names[int(cls)]

            if label == "person":
                # Track player positions
                stats["player_positions"].append(((x1 + x2) / 2, (y1 + y2) / 2))
                color = (0, 255, 0)
            elif label == "sports ball":
                # Track ball trajectory
                stats["ball_trajectory"].append(((x1 + x2) / 2, (y1 + y2) / 2))
                color = (0, 0, 255)

            # Draw bounding boxes
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)

        # Update completed passes (example logic)
        if len(stats["ball_trajectory"]) > 1:
            stats["completed_passes"] += 1  # Replace with real logic

        # Write the processed frame
        out.write(frame)

    cap.release()
    out.release()

    # 1. Run the Main AI Engine
    # This will take time!
    tracks = main(input_video_path, video_out)

    # 2. Generate Heatmap from tracks
    generate_heatmap(tracks, heatmap_out)

    # 3. Generate Stats from tracks
    generate_stats(tracks, stats_out)

    # Generate dummy stats (replace with real logic)
    stats = {
        "goals": 2,
        "fouls": 5,
        "possession": "60%"
    }

    return yolo_output_folder, None, stats  # Replace None with heatmap path if applicable
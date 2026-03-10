from ultralytics import YOLO
import os

def run_yolo_inference(input_video_path, output_folder):
    # Load the YOLO model
    model = YOLO('models/best.pt')

    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Run YOLO inference on the input video
    results = model.predict(input_video_path, save=True, project=output_folder, name="yolo_output")

    # Print results for debugging
    print(results[0])
    print('=====================================')
    for box in results[0].boxes:
        print(box)

    return os.path.join(output_folder, "yolo_output")
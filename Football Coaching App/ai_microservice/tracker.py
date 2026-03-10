import cv2
import numpy as np
from ultralytics import YOLO
from sklearn.cluster import KMeans
from scipy.spatial import ConvexHull
import math

class TacticalAnalyzer:
    def __init__(self, pitch_length=105, pitch_width=68):
        self.pitch_length = pitch_length
        self.pitch_width = pitch_width
        # Load lightweight YOLOv8 nano model
        self.model = YOLO('yolov8n.pt') 
        self.homography_matrix = None
        self.team_centroids_hsv = []

    def calibrate_homography(self, user_points):
        """
        user_points: list of [x, y] tuples corresponding to 4 pitch corners selected by user in video
        """
        # Pitch corners in meters (assuming user selected Full Pitch corners: Top-Left, Top-Right, Bottom-Right, Bottom-Left)
        # Using a standard 105x68m pitch
        target_points = np.array([
            [0, 0],
            [self.pitch_length, 0],
            [self.pitch_length, self.pitch_width],
            [0, self.pitch_width]
        ], dtype=np.float32)

        src_points = np.array(user_points, dtype=np.float32)

        # Compute homography
        self.homography_matrix, _ = cv2.findHomography(src_points, target_points)
        return self.homography_matrix is not None

    def set_team_colors(self, frame, user_clicks):
        """
        user_clicks: list of two [x, y] tuples where user clicked a Team A player and a Team B player
        """
        hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        self.team_centroids_hsv = []
        
        # Sample an area around the click to get a robust color
        for point in user_clicks:
            x, y = int(point[0]), int(point[1])
            # safe crop
            y1, y2 = max(0, y-5), min(frame.shape[0], y+5)
            x1, x2 = max(0, x-5), min(frame.shape[1], x+5)
            
            patch = hsv_frame[y1:y2, x1:x2]
            avg_hsv = np.mean(patch, axis=(0, 1))
            self.team_centroids_hsv.append(avg_hsv)

    def process_video(self, video_path, output_callback=None):
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Process at 10 FPS max to save computation on amateur clips
        frame_stride = max(1, int(fps / 10))
        
        telemetry_data = [] # Stores tactical data per processed frame
        metrics_timeline = [] # Stores 1-second interval metrics
        
        frame_count = 0
        processed_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            if frame_count % frame_stride != 0:
                continue
                
            processed_count += 1
            
            # --- Detection & Tracking ---
            # Run YOLO + deepsort/bytetrack (built into ultralytics)
            # classes=[0] filters for 'person' only
            results = self.model.track(frame, classes=[0], persist=True, verbose=False)
            
            frame_players = []
            
            if results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                track_ids = results[0].boxes.id.int().cpu().tolist()
                
                team_a_pitch_pts = []
                team_b_pitch_pts = []
                
                for box, track_id in zip(boxes, track_ids):
                    x1, y1, x2, y2 = box
                    
                    # Bottom-center of bounding box represents feet
                    bottom_center = np.array([[(x1 + x2) / 2, y2]], dtype=np.float32)
                    
                    # Apply Homography -> Convert to Pitch Coordinates (Meters)
                    if self.homography_matrix is not None:
                        projected = cv2.perspectiveTransform(np.array([bottom_center]), self.homography_matrix)
                        px, py = projected[0][0]
                    else:
                        px, py = bottom_center[0] # Fallback to pixel coords if uncalibrated
                    
                    # Basic team classification (A vs B vs Referee) via HSV distance
                    # For simplicity, we just classify into A/B based on the nearest centroid
                    team_assignment = 'Unknown'
                    if len(self.team_centroids_hsv) == 2:
                        # Extract torso color
                        ty1, ty2 = int(y1), int(max(y1, (y1+y2)/2))
                        tx1, tx2 = int(x1), int(x2)
                        
                        # Defend against out of bounds bounds
                        try:
                            torso_patch = frame[ty1:ty2, tx1:tx2]
                            torso_hsv = cv2.cvtColor(torso_patch, cv2.COLOR_BGR2HSV)
                            avg_torso_hsv = np.mean(torso_hsv, axis=(0, 1))
                            
                            dist_a = float(np.linalg.norm(avg_torso_hsv - self.team_centroids_hsv[0]))
                            dist_b = float(np.linalg.norm(avg_torso_hsv - self.team_centroids_hsv[1]))
                            
                            if dist_a < dist_b:
                                team_assignment = 'Team A'
                                team_a_pitch_pts.append([float(px), float(py)])
                            elif dist_b < dist_a:
                                team_assignment = 'Team B'
                                team_b_pitch_pts.append([float(px), float(py)])
                        except Exception:
                            pass
                            
                    frame_players.append({
                        "id": track_id,
                        "team": team_assignment,
                        "x": float(px),
                        "y": float(py)
                    })
                    
                # --- Compute Tactical Metrics (per frame or per second) ---
                frame_metrics = self._compute_metrics(team_a_pitch_pts, team_b_pitch_pts)
                
                telemetry_data.append({
                    "frame": processed_count,
                    "players": frame_players,
                    "metrics": frame_metrics
                })
        
        cap.release()
        
        return {
            "total_frames_processed": processed_count,
            "telemetry": telemetry_data
        }
        
    def _compute_metrics(self, pts_a, pts_b):
        metrics = {'team_a': {}, 'team_b': {}}
        
        # We need to type the dictionary explicitly for the linter, or just construct it per team
        
        for team_key, pts in [('team_a', pts_a), ('team_b', pts_b)]:
            team_metrics = {}
            if len(pts) < 3: # Need at least 3 points for hull and meaningful structure
                metrics[team_key] = team_metrics
                continue
                
            pts_arr = np.array(pts)
            
            # Width and Depth
            team_metrics['width'] = float(np.max(pts_arr[:, 1]) - np.min(pts_arr[:, 1]))
            team_metrics['depth'] = float(np.max(pts_arr[:, 0]) - np.min(pts_arr[:, 0]))
            
            # Centroid
            centroid_x = float(np.mean(pts_arr[:, 0]))
            centroid_y = float(np.mean(pts_arr[:, 1]))
            team_metrics['centroid_x'] = centroid_x
            team_metrics['centroid_y'] = centroid_y
            
            # Compactness (Mean Euclidean dist to centroid)
            dists = np.sqrt((pts_arr[:, 0] - centroid_x)**2 + (pts_arr[:, 1] - centroid_y)**2)
            team_metrics['compactness'] = float(np.mean(dists))
            
            # Convex Hull Area
            try:
                hull = ConvexHull(pts_arr)
                team_metrics['hull_area'] = float(hull.volume) # in 2D, volume represents area
            except Exception:
                team_metrics['hull_area'] = 0.0

            # Line Structure (Mock logic using K-Means to find 3 lines)
            team_metrics['line_gap_1'] = 0.0
            team_metrics['line_gap_2'] = 0.0
            if len(pts) >= 5:
                # Cluster X-coordinates (length-wise) to find distinct lines
                kmeans = KMeans(n_clusters=min(3, len(pts)), n_init='auto', random_state=42).fit(pts_arr[:, 0].reshape(-1, 1))
                centers = np.sort(kmeans.cluster_centers_.flatten())
                if len(centers) >= 2:
                    team_metrics['line_gap_1'] = float(centers[1] - centers[0])
                if len(centers) >= 3:
                    team_metrics['line_gap_2'] = float(centers[2] - centers[1])
            
            metrics[team_key] = team_metrics

        return metrics

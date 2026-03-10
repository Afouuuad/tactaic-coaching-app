import matplotlib.pyplot as plt
import numpy as np

def generate_heatmap(tracks, output_path):
    x_positions = []
    y_positions = []

    # Loop through tracking data to extract positions
    for frame in tracks['players']:
        for player_id, data in frame.items():
            # Use 'position_transformed' if available (Pitch coordinates)
            # If not, use 'position' (Screen coordinates)
            if 'position_transformed' in data:
                pos = data['position_transformed']
            else:
                pos = data.get('position')
                
            if pos is not None:
                x_positions.append(pos[0])
                y_positions.append(pos[1])

    if not x_positions:
        print("No positions found for heatmap.")
        return

    # Draw Heatmap
    plt.figure(figsize=(8, 12))
    plt.hist2d(x_positions, y_positions, bins=50, cmap='hot_r')
    plt.axis('off') # Hide numbers
    
    # Save image
    plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
    plt.close()
    print(f"Heatmap saved to {output_path}")
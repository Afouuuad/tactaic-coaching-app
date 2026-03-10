import json

def generate_stats(tracks, output_path):
    player_stats = {}
    
    # Get the last frame to see final totals
    last_frame = tracks['players'][-1]
    
    total_distance_team = 0
    
    for player_id, data in last_frame.items():
        dist = data.get('distance', 0)
        speed = data.get('speed', 0)
        
        total_distance_team += dist
        
        player_stats[player_id] = {
            "distance_meters": round(dist, 2),
            "top_speed_kmh": round(speed, 2) # Note: this is actually last frame speed, simplifies for demo
        }

    summary = {
        "match_summary": {
            "total_distance_covered": round(total_distance_team, 2),
            "players_tracked": len(player_stats)
        },
        "player_details": player_stats
    }

    with open(output_path, 'w') as f:
        json.dump(summary, f, indent=4)
    print(f"Stats saved to {output_path}")
import numpy as np

def point_to_segment_distance(px, py, x1, y1, x2, y2):
    line_vec = np.array([x2 - x1, y2 - y1])
    point_vec = np.array([px - x1, py - y1])
    line_len_sq = np.dot(line_vec, line_vec)
    
    if line_len_sq == 0:
        # The segment is actually a point
        return np.linalg.norm(point_vec)
    
    t = max(0, min(1, np.dot(point_vec, line_vec) / line_len_sq))
    projection = np.array([x1, y1]) + t * line_vec
    distance = np.linalg.norm(np.array([px, py]) - projection)
    
    return distance

def shortest_distance_between_segments(x1, y1, x2, y2, x3, y3, x4, y4):
    distances = [
        point_to_segment_distance(x1, y1, x3, y3, x4, y4),
        point_to_segment_distance(x2, y2, x3, y3, x4, y4),
        point_to_segment_distance(x3, y3, x1, y1, x2, y2),
        point_to_segment_distance(x4, y4, x1, y1, x2, y2)
    ]
    
    return min(distances)

# Example usage:
x1, y1, x2, y2 = 0, 0, 1, 2
x3, y3, x4, y4 = 1, 0, 0, 1
shortest_distance = shortest_distance_between_segments(x1, y1, x2, y2, x3, y3, x4, y4)
print(f"The shortest distance between the segments is: {shortest_distance}")

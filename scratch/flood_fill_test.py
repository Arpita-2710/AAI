from PIL import Image
import numpy as np
from collections import deque

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)
h, w, c = arr.shape

# 1. Identify blue pixels
blue_mask = np.zeros((h, w), dtype=bool)
for y in range(h):
    for x in range(w):
        r, g, b = map(int, arr[y, x])
        if b > 180 and b > r + 80 and b > g + 30:
            blue_mask[y, x] = True

# 2. Dilate the blue mask slightly (e.g., radius of 3 pixels) to close any gaps
dilated_mask = np.zeros((h, w), dtype=bool)
for y in range(h):
    for x in range(w):
        if blue_mask[y, x]:
            # Set a 7x7 square around the blue pixel
            y_start = max(0, y - 3)
            y_end = min(h, y + 4)
            x_start = max(0, x - 3)
            x_end = min(w, x + 4)
            dilated_mask[y_start:y_end, x_start:x_end] = True

# 3. Perform flood fill from a seed point inside the circle
# Let's try seed point X=350, Y=480
seed = (350, 480)
print(f"Seed point color: {arr[seed[1], seed[0]].tolist()}")
print(f"Is seed point blue? {blue_mask[seed[1], seed[0]]}")
print(f"Is seed point in dilated mask? {dilated_mask[seed[1], seed[0]]}")

filled = np.zeros((h, w), dtype=bool)
queue = deque([seed])
filled[seed[1], seed[0]] = True

# We can flood fill all pixels that are NOT in the dilated mask
while queue:
    x, y = queue.popleft()
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h:
            if not dilated_mask[ny, nx] and not filled[ny, nx]:
                filled[ny, nx] = True
                queue.append((nx, ny))

print("Total filled pixels:", np.sum(filled))
xs, ys = np.where(filled)
if len(xs) > 0:
    print(f"Filled bounding box: X:[{np.min(ys)}, {np.max(ys)}], Y:[{np.min(xs)}, {np.max(xs)}]")

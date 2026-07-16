from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

# Check color variations in the strip X:[190, 220], Y:[412, 611]
dirty_rows = []
for y in range(412, 612):
    pixels = arr[y, 190:221]
    # compute max difference between pixels in this row segment
    diff = np.max(pixels, axis=0) - np.min(pixels, axis=0)
    max_diff = np.max(diff)
    if max_diff > 15:
        dirty_rows.append((y, max_diff))

print("Rows with high variation:", len(dirty_rows))
if dirty_rows:
    print("Sample dirty rows:", dirty_rows[:10])
else:
    print("The entire strip is clean background!")

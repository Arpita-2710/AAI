from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)
h, w, c = arr.shape

# Let's inspect row color averages for every 10 rows to see the layout
for y in range(0, h, 10):
    row_colors = arr[y, :]
    avg_color = np.mean(row_colors, axis=0)
    print(f"Y={y:03d}: Avg={avg_color.astype(int).tolist()}")

from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

# Print a 5x5 grid of pixels inside the "Run Sync" button (X around 410, Y around 480)
for y in range(475, 485):
    row_colors = [arr[y, x].tolist() for x in range(400, 420, 4)]
    print(f"Y={y}: {row_colors}")

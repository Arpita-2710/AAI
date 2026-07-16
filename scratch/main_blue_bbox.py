from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

h, w, c = arr.shape
blue_x = []
blue_y = []
for y in range(h):
    for x in range(78, w):
        r, g, b = map(int, arr[y, x])
        if b > 180 and b > r + 80 and b > g + 30:
            blue_x.append(x)
            blue_y.append(y)

print(f"Main content blue pixels count: {len(blue_x)}")
if blue_x:
    print(f"Main content blue bounding box: X:[{min(blue_x)}, {max(blue_x)}], Y:[{min(blue_y)}, {max(blue_y)}]")

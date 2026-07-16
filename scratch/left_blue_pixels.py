from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

h, w, c = arr.shape
left_blue_pixels = []
for y in range(h):
    for x in range(78, 240):
        r, g, b = map(int, arr[y, x])
        if b > 180 and b > r + 80 and b > g + 30:
            left_blue_pixels.append((x, y, (r, g, b)))

print("Total blue pixels in X:[78, 240]:", len(left_blue_pixels))
if left_blue_pixels:
    print("Coordinates:", left_blue_pixels[:20])

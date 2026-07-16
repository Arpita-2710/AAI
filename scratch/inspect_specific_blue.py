from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

# Print pixel values around X=103, Y=412
for y in range(410, 420):
    for x in range(100, 110):
        r, g, b = map(int, arr[y, x])
        if b > 180 and b > r + 80 and b > g + 30:
            print(f"Blue pixel found at X={x}, Y={y}: ({r}, {g}, {b})")

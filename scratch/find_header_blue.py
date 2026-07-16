from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)
h, w, c = arr.shape

# Let's search for blue pixels in the global header area Y:[385, 421]
for y in range(385, 422):
    for x in range(78, w):
        r, g, b = map(int, arr[y, x])
        # A looser check: B is the largest component and B > 120 and B > R + 30
        if b > 120 and b > r + 30 and b > g + 10:
            print(f"Blue pixel in header: X={x}, Y={y}, Color=({r}, {g}, {b})")

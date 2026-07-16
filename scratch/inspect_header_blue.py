from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)
h, w, c = arr.shape

# Let's check how many blue pixels we have at Y < 422
# And what their coordinates are
def is_blue(r, g, b):
    return b > 180 and b > r + 80 and b > g + 30

count_blue = 0
for y in range(385, 422):
    for x in range(78, w):
        r, g, b = map(int, arr[y, x])
        if is_blue(r, g, b):
            count_blue += 1
            if count_blue <= 50:
                print(f"Blue pixel: X={x}, Y={y}, Color=({r}, {g}, {b})")

print("Total blue pixels in global header (Y < 422):", count_blue)

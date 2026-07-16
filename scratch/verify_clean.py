from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/OneDrive/Desktop/AAAA/AAI/scratch/edited_media.jpg'
img = Image.open(img_path)
arr = np.array(img)
h, w, c = arr.shape

# Let's count blue pixels in the content area X >= 78, Y:[410, 600]
def is_blue(r, g, b):
    return b > 110 and b > r + 15 and b > g + 5

count = 0
for y in range(410, 601):
    for x in range(78, w):
        r, g, b = map(int, arr[y, x])
        if is_blue(r, g, b):
            count += 1
            if count <= 20:
                print(f"Remaining blue pixel: X={x}, Y={y}, Color=({r}, {g}, {b})")

print("Total remaining blue pixels in content area:", count)

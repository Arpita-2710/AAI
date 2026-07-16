from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

# Let's inspect the bounding box of X:[190, 220], Y:[412, 611]
# We want to check if there are any pixels that are NOT background or border.
# The header background is ~[254, 255, 255]
# The body background is ~[248, 249, 251]
# The border is ~[236, 237, 239]
# Let's see if there are any blue pixels (from the blue circle) in this strip.

blue_pixels = []
for y in range(412, 612):
    for x in range(190, 221):
        r, g, b = map(int, arr[y, x])
        if b > 180 and b > r + 80 and b > g + 30:
            blue_pixels.append((x, y))

print("Blue pixels in strip:", len(blue_pixels))

# Let's print the colors of some rows in this strip to check for other elements (like the blue circle line crossing it)
# Wait, did the blue circle line cross X: [190, 220]?
# The blue circle is a wide oval, it might cross this strip at the top and bottom!
# Let's see where the blue pixels are in the column range [190, 220]
for y in range(412, 612):
    row_blue = []
    for x in range(190, 221):
        r, g, b = map(int, arr[y, x])
        if b > 180 and b > r + 80 and b > g + 30:
            row_blue.append(x)
    if row_blue:
        print(f"Y={y} has blue pixels at X={row_blue}")

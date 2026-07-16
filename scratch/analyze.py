from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

h, w, c = arr.shape
blue_pixels = []
for y in range(h):
    for x in range(w):
        r, g, b = map(int, arr[y, x])
        # Vibrant drawing blue is high B, lower R and G
        # Let's check for: B is high, and B is significantly larger than R and G
        if b > 180 and b > r + 80 and b > g + 30:
            blue_pixels.append((x, y, (r, g, b)))

print("Total blue pixels found:", len(blue_pixels))
if len(blue_pixels) > 0:
    xs = [p[0] for p in blue_pixels]
    ys = [p[1] for p in blue_pixels]
    print("Bounding box of blue pixels: X:[{}, {}], Y:[{}, {}]".format(min(xs), max(xs), min(ys), max(ys)))
    print("Sample blue pixel values:", blue_pixels[:10])
else:
    # Print some stats from the middle of the image to understand the color profile
    print("Middle pixels: ", arr[h//2, w//2-5:w//2+5])

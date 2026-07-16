from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)
h, w, c = arr.shape

# Let's find rows in the range [300, 700] where the row is not completely white (e.g. mean RGB is not > 250)
non_white_rows = []
for y in range(300, 700):
    row_colors = arr[y, :]
    avg_color = np.mean(row_colors)
    if avg_color < 250:
        non_white_rows.append(y)

if non_white_rows:
    print(f"Browser window vertical range: Y:[{min(non_white_rows)}, {max(non_white_rows)}]")
else:
    print("No non-white rows found!")

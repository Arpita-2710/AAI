from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)
h, w, c = arr.shape

# Let's inspect rows around Y from 420 to 520
# We want to find:
# 1. The horizontal gray border line (which separates the subheader from the page body)
# 2. The background color of the header (which should be white or near-white)
# 3. The background color of the page body (which should be slate-50, near-white gray)

print("Image height:", h, "width:", w)

# Find rows that look like a horizontal border line
# A border line is a row where the main dashboard area has a distinct gray color (e.g. around 220-240)
# The sidebar is on the left. Let's see where the sidebar ends.
# The sidebar is white or gray? Let's check some columns.
# Let's print the average color of each row from y = 420 to 480, for x in range(100, 400)
for y in range(420, 480):
    row_colors = arr[y, 100:400]
    avg_color = np.mean(row_colors, axis=0)
    # Check if there is a row with a lower intensity (the border line)
    # Let's print row stats
    print(f"Row {y}: Avg={avg_color.tolist()}, Min={np.min(row_colors, axis=0).tolist()}, Max={np.max(row_colors, axis=0).tolist()}")

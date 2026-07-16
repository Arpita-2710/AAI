from PIL import Image
import numpy as np

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
arr = np.array(img)

# Print pixel values along column X=90 for Y from 420 to 480
for y in range(420, 480):
    print(f"Y={y}: {arr[y, 90].tolist()}")

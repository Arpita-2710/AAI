from PIL import Image

img_path = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
img = Image.open(img_path)
# Crop to browser window range Y: [390, 631]
cropped = img.crop((0, 385, 472, 630))
cropped.save('C:/Users/purab/OneDrive/Desktop/AAAA/AAI/scratch/cropped.png')
print("Cropped image saved successfully!")

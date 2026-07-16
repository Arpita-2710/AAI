from PIL import Image
import numpy as np

def edit_image(input_path, output_path):
    img = Image.open(input_path)
    arr = np.array(img)
    h, w, c = arr.shape
    
    # Create a copy to edit
    out_arr = arr.copy()
    
    # Helper to check if a pixel is blue (using a looser condition for anti-aliased/blended edges)
    def is_blue(r, g, b):
        return b > 110 and b > r + 15 and b > g + 5

    # Helper to check if a coordinate is inside the flat-filled rectangles
    def is_in_flat_rect(x, y):
        if x >= 240:
            if 422 <= y <= 522:
                return True
        return False

    # 1. Fill the right side of the subheader with white (Y: 422 to 456, X >= 240)
    for y in range(422, 457):
        for x in range(240, w):
            out_arr[y, x] = [254, 255, 255]
            
    # 2. Rebuild the border line (Y: 457 to 458, X >= 240)
    for y in range(457, 459):
        for x in range(240, w):
            out_arr[y, x] = [236, 237, 239]
            
    # 3. Fill the right side of the body with page background (Y: 459 to 522, X >= 240)
    for y in range(459, 523):
        for x in range(240, w):
            out_arr[y, x] = [248, 249, 251]
            
    # 4. Clean other blue pixels in the content area using specific safety zones:
    # Zone 1a (Global Header - above avatar): Y: [410, 417], X: [220, 445]
    # Zone 1b (Global Header - below avatar): Y: [418, 421], X: [220, w-1]
    # Zone 2 (KPI Cards): Y: [523, 570], X: [370, w-1]
    # Zone 3 (Left curve): Y: [422, 522], X: [220, 240]
    
    for y in range(h):
        for x in range(78, w):
            if is_in_flat_rect(x, y):
                continue
            
            # Check if (x, y) is in one of the safe zones
            in_zone = False
            if 410 <= y <= 417 and 220 <= x <= 445:
                in_zone = True
            elif 418 <= y <= 421 and 220 <= x < w:
                in_zone = True
            elif 523 <= y <= 570 and 370 <= x < w:
                in_zone = True
            elif 422 <= y <= 522 and 220 <= x <= 240:
                in_zone = True
                
            if in_zone:
                r, g, b = map(int, out_arr[y, x])
                if is_blue(r, g, b):
                    # Search left for a non-blue pixel
                    found = False
                    for dx in range(1, 40):
                        lx = x - dx
                        if lx >= 78:
                            lr, lg, lb = map(int, out_arr[y, lx])
                            if not is_blue(lr, lg, lb):
                                out_arr[y, x] = out_arr[y, lx]
                                found = True
                                break
                    if not found:
                        # If left search failed, search right
                        for dx in range(1, 40):
                            rx = x + dx
                            if rx < w:
                                rr, rg, rb = map(int, out_arr[y, rx])
                                if not is_blue(rr, rg, rb):
                                    out_arr[y, x] = out_arr[y, rx]
                                    break

    # Save output
    out_img = Image.fromarray(out_arr)
    out_img.save(output_path)
    print(f"Saved edited image to {output_path}")
    
    # Save cropped version for visual verification
    cropped = out_img.crop((0, 385, w, 630))
    cropped_path = output_path.replace('.jpg', '_cropped.png').replace('.jpeg', '_cropped.png')
    cropped.save(cropped_path)
    print(f"Saved cropped verification image to {cropped_path}")

# Edit the brain image
brain_in = 'C:/Users/purab/.gemini/antigravity-ide/brain/6c9027ce-3a66-479f-ab62-125745688c4f/media__1784099667179.jpg'
brain_out = 'C:/Users/purab/OneDrive/Desktop/AAAA/AAI/scratch/edited_media.jpg'
edit_image(brain_in, brain_out)

from PIL import Image

try:
    img = Image.open('public/logo.png').convert("RGBA")
    
    # Get bounding box manually by scanning pixels
    width, height = img.size
    pixels = img.load()
    
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # Ignore transparent pixels and white pixels
            is_white = (r > 245 and g > 245 and b > 245)
            if a > 10 and not is_white:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    if min_x <= max_x and min_y <= max_y:
        img_cropped = img.crop((min_x, min_y, max_x + 1, max_y + 1))
        
        # Now make the outer corners completely transparent!
        # Because we cropped it to a tight square, we can make the background transparent
        # by drawing a circular mask.
        from PIL import ImageDraw
        mask = Image.new("L", img_cropped.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, img_cropped.size[0], img_cropped.size[1]), fill=255)
        
        # Apply mask
        img_cropped.putalpha(mask)
        
        img_cropped.save('public/logo.png')
        img_cropped.save('src/app/icon.png')
        print(f"Cropped aggressively from {img.size} to {img_cropped.size} and made background transparent!")
    else:
        print("No bounding box found.")
except Exception as e:
    print(f"Error: {e}")

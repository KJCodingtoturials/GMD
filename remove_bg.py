from PIL import Image

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # item is (R, G, B, A)
        r, g, b, a = item
        # If the pixel is very dark (close to black), make it transparent
        if max(r, g, b) < 15:
            new_data.append((r, g, b, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # We should also crop the image nicely if it has a lot of padding, but for now we'll just save it.
    # The user's image looks like it has a glowing circle. The corners are already black.
    # Crop to the glowing circle bounds approximately.
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

remove_black_background(r"C:\Users\Administrator\.gemini\antigravity-ide\brain\3a3bdf18-2de2-4574-8c50-bb28741fe0a9\media__1790871124300.jpg", r"C:\Users\Administrator\Desktop\chorme\growth-matrix-digital\public\logo-transparent.png")
print("Done")

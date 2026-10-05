import os
import subprocess
import sys

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Installing rembg and pillow...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "rembg", "pillow"])
    from rembg import remove
    from PIL import Image

# Path to the newly uploaded image
input_path = r"C:\Users\Administrator\.gemini\antigravity-ide\brain\20934c63-89b5-400e-90a7-6be109a83e04\media__1791047423627.jpg"
output_path = r"C:\Users\Administrator\Desktop\chorme\growth-matrix-digital\img\founder.webp"
output_lg_path = r"C:\Users\Administrator\Desktop\chorme\growth-matrix-digital\img\founder-lg.webp"

if not os.path.exists(input_path):
    print(f"Error: Input file not found at {input_path}")
    sys.exit(1)

print("Processing image, removing background... (this may take a moment to download models on first run)")
with open(input_path, 'rb') as i:
    with open(output_path, 'wb') as o:
        input = i.read()
        output = remove(input)
        o.write(output)

print("Applying original background style and optimizing...")
# We will create a background matching the previous styling
# The previous poster background was a solid color with some lighting.
# Let's use a nice dark/gradient background matching the UI tokens
img = Image.open(output_path).convert("RGBA")

# Create a dark background
bg = Image.new("RGBA", img.size, (18, 27, 42, 255))
# Composite the transparent founder image over the background
final_img = Image.alpha_composite(bg, img).convert("RGB")

# Save as optimized webp
final_img.thumbnail((720, 1000), Image.LANCZOS)
final_img.save(output_path, "WEBP", quality=85)

final_img_lg = final_img.copy()
final_img_lg.thumbnail((1100, 1500), Image.LANCZOS)
final_img_lg.save(output_lg_path, "WEBP", quality=85)

print("Background successfully removed and image replaced!")

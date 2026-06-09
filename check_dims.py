from PIL import Image
import os
import json

base_dir = r"c:\Users\MELVILLE\Desktop\Vibe\JSH store\Imports\Sidia Beast vape"
out_dir = os.path.join(base_dir, "cropped")
os.makedirs(out_dir, exist_ok=True)

images = [
    "pomelli-image-1.png",
    "pomelli-image-2.png",
    "pomelli-image-3.png",
    "pomelli-image-4.png"
]

results = {}

for img_name in images:
    img_path = os.path.join(base_dir, img_name)
    if not os.path.exists(img_path):
        continue
        
    with Image.open(img_path) as img:
        width, height = img.size
        # Let's save a quick info file to understand dimensions
        results[img_name] = {"width": width, "height": height}
        
print(json.dumps(results, indent=2))

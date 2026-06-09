from PIL import Image
import os
import json

base_dir = r"c:\Users\MELVILLE\Desktop\Vibe\JSH store\Imports\Sidia Beast vape"
out_dir = os.path.join(base_dir, "cropped")
os.makedirs(out_dir, exist_ok=True)

# Define configurations for each image
# img_name: (cols, rows, header_offset_pct, bottom_offset_pct)
configs = {
    "pomelli-image-1.png": (4, 3, 0.15, 0.0), # 4 cols, 3 rows, ~15% top header
    "pomelli-image-2.png": (3, 5, 0.15, 0.0), # 3 cols, 5 rows, ~15% top header
    "pomelli-image-3.png": (5, 3, 0.0, 0.0),  # 5 cols, 3 rows, looks like no header
    "pomelli-image-4.png": (3, 4, 0.0, 0.0)   # 3 cols, 4 rows, labels inside cell
}

results = []

for img_name, (cols, rows, header_pct, bottom_pct) in configs.items():
    img_path = os.path.join(base_dir, img_name)
    if not os.path.exists(img_path):
        print(f"Skipping {img_name}, not found.")
        continue
        
    try:
        with Image.open(img_path) as img:
            width, height = img.size
            
            top_margin = int(height * header_pct)
            bottom_margin = int(height * bottom_pct)
            
            grid_height = height - top_margin - bottom_margin
            cell_w = width // cols
            cell_h = grid_height // rows
            
            for r in range(rows):
                for c in range(cols):
                    left = c * cell_w
                    top = top_margin + (r * cell_h)
                    right = left + cell_w
                    bottom = top + cell_h
                    
                    cropped = img.crop((left, top, right, bottom))
                    out_name = f"{img_name.split('.')[0]}_r{r+1}_c{c+1}.png"
                    cropped.save(os.path.join(out_dir, out_name))
                    results.append(out_name)
        print(f"Successfully cropped {img_name} into {rows*cols} images.")
    except Exception as e:
        print(f"Error processing {img_name}: {e}")

print(f"Total images generated: {len(results)}")

import os
import json
from datetime import datetime

def generate_photo_metadata(category):
    folder_path = os.path.join('photos', category)
    photos = []

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(folder_path, filename)
            creation_time = os.path.getctime(filepath)
            photos.append({
                'file': filename,
                'date': datetime.fromtimestamp(creation_time).isoformat()
            })

    output_file = os.path.join('js', f'{category.lower()}_photos.json')
    with open(output_file, 'w') as json_file:
        json.dump(photos, json_file, indent=4)

def generate_metadata_for_all_categories():
    photos_root = 'photos'
    categories = [name for name in os.listdir(photos_root) if os.path.isdir(os.path.join(photos_root, name))]

    for category in categories:
        print(f"Generating metadata for category: {category}")
        generate_photo_metadata(category)

if __name__ == "__main__":
    generate_metadata_for_all_categories()
    print("Metadata generation complete.")

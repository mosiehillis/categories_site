import json
from datetime import datetime

def load_categories():
    with open('js/categories.json') as f:
        return json.load(f)['categories']

def load_photos(category):
    with open(f'js/{category}.json') as f:
        return json.load(f)

def generate_index_page(categories, recent_photos):
    with open('templates/index_template.html', 'r') as f:
        template = f.read()

    category_buttons = ''.join(f'<a href="{category}.html" class="category-button">{category}</a>' for category in categories)
    
    photos_html = generate_photos_html(recent_photos)

    final_html = template.replace('{{ category_buttons }}', category_buttons)
    final_html = final_html.replace('{{ recent_photos }}', photos_html)

    with open('index.html', 'w') as f:
        f.write(final_html)

def generate_category_page(category, photos):
    with open('templates/category_template.html', 'r') as f:
        template = f.read()
    
    photos_html = generate_photos_html(photos)

    final_html = template.replace('{{ category_name }}', category)
    final_html = final_html.replace('{{ category_photos }}', photos_html)

    with open(f'{category}.html', 'w') as f:
        f.write(final_html)

def generate_photos_html(photos):
    photos_html = ''
    for i, photo in enumerate(photos):
        portrait_class = 'portrait' if photo['portrait'] else 'landscape'
        photos_html += f'<img src="photos/{photo["category"]}/{photo["file"]}" loading="lazy" class="{portrait_class}" alt="Photo" />\n'
    return photos_html

def main():
    categories = load_categories()
    all_photos = []

    for category in categories:
        photos = load_photos(category)
        for photo in photos:
            photo['category'] = category
            all_photos.append(photo)
    
    # Sort photos by date descending
    all_photos.sort(key=lambda x: datetime.fromisoformat(x['date']), reverse=True)

    generate_index_page(categories, all_photos)

    for category in categories:
        photos = load_photos(category)
        generate_category_page(category, photos)

if __name__ == '__main__':
    main()
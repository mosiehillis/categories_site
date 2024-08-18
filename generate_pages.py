import json
from datetime import datetime

def load_categories():
    with open('js/categories.json') as f:
        return json.load(f)['categories']

def load_photos(category):
    with open(f'js/{category}.json') as f:
        photos = json.load(f)
    for photo in photos:
        photo['category'] = category
    return photos
    
def generate_html_page(categories, recent_photos, page_name):
    with open('templates/index_template.html', 'r') as f:
        template = f.read()

    category_buttons = '\n'.join(f'<a href="{category}.html" class="category-button">{category}</a>' for category in categories)
    
    photos_html = generate_photos_html(recent_photos)

    final_html = template.replace('{{ category_buttons }}', category_buttons)
    final_html = final_html.replace('{{ recent_photos }}', photos_html)

    with open(f'{page_name}.html', 'w') as f:
        f.write(final_html)

def generate_photos_html(photos):
    photos_html = ''
    for i, photo in enumerate(photos):
        portrait_class = 'portrait' if photo['portrait'] else 'landscape'
        photos_html += f'<img src="photos/{photo["category"]}/{photo["file"]}" loading="lazy" class="{portrait_class}" alt="Photo"</img>\n'
    return photos_html

def main():
    categories = load_categories()
    all_photos = [elem for subl in [load_photos(category) for category in categories] for elem in subl]

    # Sort photos by date descending
    all_photos.sort(key=lambda x: datetime.fromisoformat(x['date']), reverse=True)

    generate_html_page(categories, all_photos, 'index')

    for category in categories:
        photos = load_photos(category)
        generate_html_page(category, photos, category)

if __name__ == '__main__':
    main()
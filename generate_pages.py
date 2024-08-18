import os
import json
from jinja2 import Environment, FileSystemLoader

def get_categories():
    photos_root = 'photos'
    return [name for name in os.listdir(photos_root) if os.path.isdir(os.path.join(photos_root, name))]

def generate_category_page(category):
    template = env.get_template('category_template.html')
    output = template.render(category=category)
    
    with open(f'{category.lower()}.html', 'w') as f:
        f.write(output)

def update_index_page(categories):
    template = env.get_template('index_template.html')
    output = template.render(categories=categories)
    
    with open('index.html', 'w') as f:
        f.write(output)

if __name__ == "__main__":
    # Set up Jinja2 environment
    env = Environment(loader=FileSystemLoader('templates'))

    # Get categories
    categories = get_categories()

    # Generate category pages
    for category in categories:
        generate_category_page(category)
    
    # Update index page
    update_index_page(categories)

    print("Page generation complete.")
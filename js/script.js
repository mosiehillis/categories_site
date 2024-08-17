// script.js
document.addEventListener('DOMContentLoaded', () => {
    fetchPhotos();
});

async function fetchPhotos() {
    try {
        const response = await fetch('/photo-metadata.json');
        const data = await response.json();
        const photoGrid = document.querySelector('.photo-grid');

        data.photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.classList.add(photo.is_portrait ? 'portrait' : 'landscape');

            const img = document.createElement('img');
            img.src = photo.thumbnailUrl; // Use the URL of the thumbnail image
            img.alt = photo.title; // Optional: Add alt text for accessibility

            // Add lazy loading attribute
            img.setAttribute('loading', 'lazy');

            photoElement.appendChild(img);
            photoGrid.appendChild(photoElement);
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
    }
}

function setTileBackground(category) {
    fetch(`js/${category.toLowerCase()}_photos.json`)
        .then(response => response.json())
        .then(photos => {
            if (photos.length > 0) {
                const tile = document.getElementById(`${category.toLowerCase()}-tile`);
                tile.style.backgroundImage = `url('photos/${category}/${photos[0].file}')`;
            }
        })
        .catch(error => console.error('Error loading category preview:', error));
}

['Concerts', 'Weddings', 'Portraits'].forEach(setTileBackground);

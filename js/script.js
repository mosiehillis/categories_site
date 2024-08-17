function loadPhotos(category) {
    const photoGrid = document.getElementById('photo-grid');
    fetch(`js/${category.toLowerCase()}_photos.json`)
        .then(response => response.json())
        .then(photos => {
            photos.sort((a, b) => new Date(b.date) - new Date(a.date));  // Sort photos newest to oldest
            photos.forEach(photo => {
                const img = document.createElement('img');
                img.src = `photos/${category}/${photo.file}`;
                photoGrid.appendChild(img);
            });
        })
        .catch(error => console.error('Error loading photos:', error));
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

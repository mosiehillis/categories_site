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
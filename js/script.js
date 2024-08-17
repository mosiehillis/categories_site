// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Load photos for the default category or you can specify categories as needed
    loadPhotos('default'); // Change 'default' to the actual category name if needed
    updateCategoryTiles();
});

async function loadPhotos(categoryName) {
    try {
        const response = await fetch(`js/${categoryName}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const photoGrid = document.querySelector('.photo-grid');

        // Clear previous photos
        photoGrid.innerHTML = '';

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
        console.error('Error loading photos:', error);
    }
}

async function updateCategoryTiles() {
    try {
        // Fetch categories
        const categoriesResponse = await fetch('js/categories.json');
        if (!categoriesResponse.ok) {
            throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        const categories = categoriesData.categories;

        // Iterate over each category
        for (const category of categories) {
            const metadataResponse = await fetch(`js/${category}.json`);
            if (!metadataResponse.ok) {
                console.error(`Error fetching metadata for category ${category}: ${metadataResponse.statusText}`);
                continue; // Skip this category if there's an error
            }
            const data = await metadataResponse.json();
            const tile = document.getElementById(`${category.toLowerCase()}-tile`);

            if (tile && data.photos.length > 0) {
                const previewPhoto = data.photos[0]; // Get the first photo for the preview
                tile.style.backgroundImage = `url(${previewPhoto.thumbnailUrl})`;
            }
        }
    } catch (error) {
        console.error('Error updating category tiles:', error);
    }
}

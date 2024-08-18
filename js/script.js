document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    loadCategories();
    setupNavigation();
});

async function loadCategories() {
    const response = await fetch('js/categories.json');
    const data = await response.json();
    const categoryGrid = document.querySelector('.category-grid');

    data.categories.forEach(category => {
        const preview = document.createElement('div');
        preview.className = 'category-preview';
        preview.innerHTML = `
            <img src="photos/${category}/thumbnails/${getFirstImage(category)}" alt="${category}">
            <h2>${category}</h2>
        `;
        preview.addEventListener('click', () => {
            window.location.href = `${category.toLowerCase()}.html`;
        });
        categoryGrid.appendChild(preview);
    });
}

async function getFirstImage(category) {
    const response = await fetch(`js/${category}.json`);
    const data = await response.json();
    return data[0].file;
}

function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    }, options);

    lazyImages.forEach(img => imageObserver.observe(img));
}

function setupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImg">
    `;
    document.body.appendChild(modal);

    const modalImg = document.getElementById('modalImg');
    const close = document.querySelector('.close');

    // Use event delegation on the photo wall
    document.querySelector('.photo-wall').addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            modal.style.display = 'block';
            modalImg.src = e.target.src || e.target.dataset.src; // Use src if loaded, otherwise use data-src
        }
    });

    close.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function loadPhotos(category) {
    const response = await fetch(`js/${category}.json`);
    const data = await response.json();
    const photoWall = document.querySelector('.photo-wall');

    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentRow = document.createElement('div');
    currentRow.className = 'photo-row';
    let rowHeight = 0;
    const targetRowHeight = 200;

    data.forEach(photo => {
        const img = document.createElement('img');
        img.dataset.src = `photos/${category}/${photo.file}`; // Use data-src for lazy loading
        img.alt = photo.file;
        img.className = 'lazy'; // Add a class for lazy-loaded images

        if (photo.portrait) {
            img.style.width = `${targetRowHeight * 2 / 3}px`;
            img.style.height = `${targetRowHeight}px`;
        } else {
            img.style.width = `${targetRowHeight * 3 / 2}px`;
            img.style.height = `${targetRowHeight}px`;
        }

        if (rowHeight + parseInt(img.style.height) > targetRowHeight) {
            photoWall.appendChild(currentRow);
            currentRow = document.createElement('div');
            currentRow.className = 'photo-row';
            rowHeight = 0;
        }

        currentRow.appendChild(img);
        rowHeight += parseInt(img.style.height);
    });

    if (currentRow.children.length > 0) {
        photoWall.appendChild(currentRow);
    }

    setupLazyLoading();
    setupModal();
}

async function setupNavigation() {
    const response = await fetch('js/categories.json');
    const data = await response.json();
    const navMenu = document.querySelector('.nav-menu');

    // Add home link
    const homeLink = document.createElement('li');
    homeLink.innerHTML = '<a href="index.html">Home</a>';
    navMenu.appendChild(homeLink);

    // Add category links
    data.categories.forEach(category => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${category.toLowerCase()}.html">${category}</a>`;
        navMenu.appendChild(li);
    });
}
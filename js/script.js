document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    loadCategories();
    setupLazyLoading();
    setupModal();
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
    const images = document.querySelectorAll('img[data-src]');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, options);

    images.forEach(img => observer.observe(img));
}

function setupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImg">
    `;
    document.body.appendChild(modal);

    const images = document.querySelectorAll('.photo-wall img');
    const modalImg = document.getElementById('modalImg');
    const close = document.querySelector('.close');

    images.forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = img.src;
        });
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
        img.dataset.src = `photos/${category}/${photo.file}`;
        img.alt = photo.file;

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
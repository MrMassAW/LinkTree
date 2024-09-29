// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.addEventListener('DOMContentLoaded', () => {
    init(); // Only call init once when the DOM is loaded
});

function init() {
    // Ensure the categories are only initialized once
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) {
        console.error("Error: #categories-container element not found in the DOM.");
        return;
    }

    // Clear the categories container to prevent duplication
    categoriesContainer.innerHTML = '';

    // Fetch and render categories
    fetchCategoriesAndRender();

    // Set up background canvas for the Milky Way
    canvasSetup();
}

function fetchCategoriesAndRender() {
    fetch('massa_links.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.categories) {
                console.error("Error: No categories found in data.");
                return;
            }

            renderCategories(data.categories);
            setupSearch(); // Set up search after categories have been rendered
        })
        .catch(error => console.error('Error loading the categories:', error));
}

function renderCategories(categoriesData) {
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.innerHTML = ''; // Clear previous content

    // Inject categories into the DOM
    Object.keys(categoriesData).forEach(categoryName => {
        const categoryData = categoriesData[categoryName];

        // Create category column
        const categoryColumn = document.createElement('div');
        categoryColumn.className = 'category-column';

        // Create category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <span class="icon">${categoryData.icon ? `<img src="${categoryData.icon}" alt="${categoryName} icon" class="category-icon">` : ''}</span>
            <span>${categoryName}</span>
        `;
        categoryColumn.appendChild(categoryHeader);

        // Create items container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items-container';

        categoryData.items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <div class="item-header">
                    <img src="${item.icon}" alt="${item.name} icon" class="item-icon">
                    <div class="item-title">${item.name}</div>
                </div>
            `;
            itemCard.dataset.title = item.name.toLowerCase();
            itemCard.dataset.description = item.description.toLowerCase();
            itemCard.dataset.tooltip = item.description; // Add description as tooltip data
            itemCard.addEventListener('click', () => {
                if (item.url) {
                    window.open(item.url, '_blank');
                }
            });
            itemsContainer.appendChild(itemCard);
        });
        categoryColumn.appendChild(itemsContainer);

        // Append the category column to the container
        categoriesContainer.appendChild(categoryColumn);
    });
}

function canvasSetup() {
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setupSearch() {
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) {
        console.error("Error: #search-bar element not found in the DOM.");
        return;
    }

    searchBar.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();

        const categories = document.querySelectorAll('.category-column');
        const itemCards = document.querySelectorAll('.item-card');

        let hasVisibleCategories = false;

        // Filter categories and their items
        categories.forEach(category => {
            const categoryName = category.querySelector('.category-header span:last-child').textContent.toLowerCase();
            const itemsContainer = category.querySelector('.items-container');
            const items = itemsContainer.querySelectorAll('.item-card');
            let categoryMatch = false;

            // Check if the category name matches the query
            if (categoryName.includes(query)) {
                categoryMatch = true;
                items.forEach(item => {
                    item.classList.remove('hidden'); // Show all items if category name matches
                });
            } else {
                // Filter items based on title and description
                items.forEach(item => {
                    const title = item.dataset.title;
                    const description = item.dataset.description;

                    if (title.includes(query) || description.includes(query)) {
                        item.classList.remove('hidden'); // Show matching items by removing 'hidden' class
                        categoryMatch = true; // If at least one item matches, category should be shown
                    } else {
                        item.classList.add('hidden'); // Hide non-matching items by adding 'hidden' class
                    }
                });
            }

            // Show or hide category based on match
            if (categoryMatch) {
                category.style.display = 'block'; // Show category if the name matches or it has visible items
                hasVisibleCategories = true;
            } else {
                category.style.display = 'none'; // Hide category if no items match and the name doesn't match
            }
        });

        // Show a message if no categories are visible (optional)
        if (!hasVisibleCategories) {
            console.warn("No matching categories or items found.");
        }
    });
}


// Initialize the script
init();

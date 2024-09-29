// utils.js

function createPlaceholderImage(size) {
    // Create a canvas element to draw the placeholder
    const placeholderCanvas = document.createElement('canvas');
    placeholderCanvas.width = size;
    placeholderCanvas.height = size;

    const context = placeholderCanvas.getContext('2d');

    // Draw a background
    context.fillStyle = '#ccc'; // Light gray background
    context.fillRect(0, 0, size, size);

    // Draw a question mark or any symbol you prefer
    context.fillStyle = '#666'; // Dark gray color
    context.font = `${size * 0.5}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('?', size / 2, size / 2);

    // Create an image from the canvas
    const img = new Image();
    img.src = placeholderCanvas.toDataURL();

    return img;
}

// node.js

// Assuming 'canvas' and 'ctx' are declared in 'main.js' and accessible globally

class Node {
    constructor(x, y, name, type, parent = null, data = null) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.name = name;
        this.type = type; // 'main', 'category', 'item'
        this.parent = parent;
        this.children = [];
        this.data = data; // For items: link data
        this.size = type === 'main' ? 60 : type === 'category' ? 40 : 20;
        this.hover = false;
        this.image = new Image();
        this.imageLoaded = false;
        this.imageError = false;

        if (data && data.icon) {
            this.image.src = data.icon;
        } else {
            this.image.src = ''; // Empty source to trigger error
        }

        // Handle image loading success
        this.image.onload = () => {
            this.imageLoaded = true;
        };

        // Handle image loading error
        this.image.onerror = () => {
            console.error(`Failed to load image: ${this.image.src}`);
            this.imageError = true;
            // Create a placeholder image dynamically
            this.image = createPlaceholderImage(this.size);
            this.imageLoaded = true;
        };

        // For link animation
        this.progress = Math.random();
        this.progressDirection = Math.random() < 0.5 ? 1 : -1;
    }

    draw() {
        if (!this.imageLoaded) return; // Wait until the image is loaded

        ctx.save();

        // Draw node as image
        ctx.translate(currentOffsetX, currentOffsetY);
        ctx.scale(currentZoom, currentZoom);

        ctx.drawImage(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        ctx.restore();
    }

    drawLineToParent() {
        if (this.parent) {
            ctx.save();
            ctx.translate(currentOffsetX, currentOffsetY);
            ctx.scale(currentZoom, currentZoom);

            // Draw the line (dark red)
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.parent.x, this.parent.y);
            ctx.strokeStyle = 'rgba(139, 0, 0, 0.8)'; // Dark red color
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw moving particle along the line (Massa red)
            const t = this.progress;
            const x = this.x + (this.parent.x - this.x) * t;
            const y = this.y + (this.parent.y - this.y) * t;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(204, 0, 0, 0.9)'; // Massa red color
            ctx.fill();

            ctx.restore();
        }
    }

    update() {
        // Move toward mouse, but limit movement to a small offset from base position
        if (mouse.x !== null && mouse.y !== null) {
            const attractionStrength = 0.05; // Adjust this value for subtle movement
            const maxOffset = 10; // Maximum pixels the node can move from its base position

            // Calculate desired displacement due to attraction
            const dx = mouse.x - this.baseX;
            const dy = mouse.y - this.baseY;

            // Desired new position
            let desiredX = this.baseX + dx * attractionStrength;
            let desiredY = this.baseY + dy * attractionStrength;

            // Limit the displacement to maxOffset
            const offsetX = desiredX - this.baseX;
            const offsetY = desiredY - this.baseY;
            const offsetDistance = Math.hypot(offsetX, offsetY);

            if (offsetDistance > maxOffset) {
                // Scale down the offset to stay within maxOffset
                const scale = maxOffset / offsetDistance;
                desiredX = this.baseX + offsetX * scale;
                desiredY = this.baseY + offsetY * scale;
            }

            // Move towards the desired position smoothly
            this.x += (desiredX - this.x) * 0.1; // Adjust smoothing factor
            this.y += (desiredY - this.y) * 0.1;
        }

        // Update link animation progress
        this.progress += this.progressDirection * 0.005; // Adjust speed as desired
        if (this.progress >= 1) {
            this.progress = 1;
            this.progressDirection = -1;
        } else if (this.progress <= 0) {
            this.progress = 0;
            this.progressDirection = 1;
        }

        // Check for hover
        const scaledMouseX = mouse.x * currentZoom + currentOffsetX;
        const scaledMouseY = mouse.y * currentZoom + currentOffsetY;

        const nodeScreenX = this.x * currentZoom + currentOffsetX;
        const nodeScreenY = this.y * currentZoom + currentOffsetY;
        const nodeScreenSize = this.size * currentZoom;

        const hoverDistance = Math.hypot(scaledMouseX - nodeScreenX, scaledMouseY - nodeScreenY);
        if (hoverDistance < nodeScreenSize / 2) {
            canvas.style.cursor = 'pointer';
            this.hover = true;

            // Show tooltip
            tooltip.style.left = `${scaledMouseX + 15}px`;
            tooltip.style.top = `${scaledMouseY + 15}px`;

            if (this.type === 'main' || this.type === 'category') {
                tooltip.innerHTML = `<strong>${this.name}</strong>`;
            } else if (this.type === 'item') {
                tooltip.innerHTML = `
                    <strong>${this.data.name}</strong><br>
                    ${this.data.description}
                `;
            }

            tooltip.style.display = 'block';
        } else {
            this.hover = false;
        }
    }
}

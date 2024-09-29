(function () {
    // Get the canvas and context
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Resize the canvas to the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class MilkyWayStar {
        constructor() {
            this.reset();
        }

        reset() {
            const milkyWayWidth = canvas.width;
            const milkyWayHeight = canvas.height;

            // Set random position
            this.x = Math.random() * milkyWayWidth;
            this.y = Math.random() * milkyWayHeight;

            // Set random speed and direction for slow movement
            this.speed = Math.random() * 0.1 + 0.1; // Slow speed for smoother movement
            const angle = Math.random() * Math.PI * 2;
            this.dx = Math.cos(angle) * this.speed;
            this.dy = Math.sin(angle) * this.speed;

            // Randomize star size
            this.size = Math.random() * 1.5 + 0.5;

            // Opacity for scintillation
            this.opacity = Math.random() * 0.5 + 0.5; // Between 0.5 and 1
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            ctx.restore();
        }

        update() {
            // Move the star
            this.x += this.dx;
            this.y += this.dy;

            // Keep stars within the canvas bounds by bouncing off the edges
            if (this.x <= 0 || this.x >= canvas.width) this.dx *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.dy *= -1;

            // Update the color or opacity here if needed
        }
    }

    class Link {
        constructor(star1, star2) {
            this.star1 = star1;
            this.star2 = star2;
        }

        draw() {
            const dx = this.star1.x - this.star2.x;
            const dy = this.star1.y - this.star2.y;
            const distance = Math.hypot(dx, dy);

            // Only draw links if stars are within 150 pixels of each other
            if (distance < 150) {
                const brightness = Math.max(0, 1 - distance / 150);
                const redValue = Math.floor(255 * Math.pow(brightness, 2)); // Exponential increase for brighter red when closer

                ctx.save();
                ctx.strokeStyle = `rgba(${redValue}, 0, 0, ${brightness})`; // Dark red to bright red based on distance
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.star1.x, this.star1.y);
                ctx.lineTo(this.star2.x, this.star2.y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    // Initialize Milky Way stars and links
    function initMilkyWayStars() {
        window.milkyWayStarsArray = [];
        window.milkyWayLinksArray = [];

        const numMilkyWayStars = 500;

        // Create stars
        for (let i = 0; i < numMilkyWayStars; i++) {
            milkyWayStarsArray.push(new MilkyWayStar());
        }

        // Create links
        for (let i = 0; i < milkyWayStarsArray.length; i++) {
            for (let j = i + 1; j < milkyWayStarsArray.length; j++) {
                milkyWayLinksArray.push(new Link(milkyWayStarsArray[i], milkyWayStarsArray[j]));
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw stars
        milkyWayStarsArray.forEach(star => {
            star.update();
            star.draw();
        });

        // Draw links between stars
        milkyWayLinksArray.forEach(link => {
            link.draw();
        });
    }

    // Set up and start the animation
    document.addEventListener('DOMContentLoaded', () => {
        initMilkyWayStars();
        animate();

        // Resize the canvas when the window size changes
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initMilkyWayStars(); // Reinitialize stars and links on resize
        });
    });
})();

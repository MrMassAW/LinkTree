document.addEventListener("DOMContentLoaded", function() {
    const robot = document.getElementById("robot");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let robotX = mouseX;
    let robotY = mouseY;
    let speed = 0;
    let defaultSpeed = 0.1; // Maximum speed when following the mouse
    let speedBoost = 0; 
    let targetPosition = {x: 0, y: 0};
    let mouseTimeout;
    let currentAngle = Math.random() * Math.PI * 2; // Random initial angle
    let mouseMoving = false;

    // Function to handle when mouse stops moving
    function onMouseStop() {
        console.log("Mouse stopped moving");
        // Add actions for when the mouse stops moving
        mouseMoving = false;
    }
    
    // Mouse move event listener
    document.addEventListener("mousemove", function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        targetPosition.x = mouseX;
        targetPosition.y = mouseY;
        clearTimeout(mouseTimeout); // Clear any previous timeout
        mouseTimeout = setTimeout(onMouseStop, 1000); // Set new timeout for 1 second of inactivity
        mouseMoving = true;
    });

    // Function to update robot position
    function updateRobotPosition() {
        let dx = targetPosition.x - robotX;
        let dy = targetPosition.y - robotY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        // Calculate acceleration based on distance (more distance, more acceleration)
        speedBoost = distance / 100; // Scale acceleration relative to distance
        speed = defaultSpeed + speedBoost;

        // Flip robot if needed (reversed logic)
        if (targetPosition.x < robotX) {
            robot.style.transform = "scaleX(1)";
        } else {
            robot.style.transform = "scaleX(-1)";
        }
        if (distance > 1) {
            // Update direction angle towards the mouse
            let directionAngle = Math.atan2(dy, dx);
            // Update robot's position based on the current direction and speed
            robotX += Math.cos(directionAngle) * speed;
            robotY += Math.sin(directionAngle) * speed;
        }
        // Keep the robot within the window bounds
        robotX = Math.max(0, Math.min(window.innerWidth - robot.offsetWidth, robotX));
        robotY = Math.max(0, Math.min(window.innerHeight - robot.offsetHeight, robotY));

        // Update the robot's position on the page
        robot.style.left = (robotX - robot.offsetWidth /2 ) + "px";
        robot.style.top = (robotY - robot.offsetHeight / 2 ) + "px";

    }

    function runTaskAtRandomIntervals() {
        // Generate a random interval between 1000 ms (1 second) and 5000 ms (5 seconds)
        let randomInterval = Math.random() * 8000 + 500;
    
        // Perform the desired task
        console.log("Task running at interval:", randomInterval);
        if (!mouseMoving){
            // Set new target position while ensuring it's within window bounds
            targetPosition.x = (Math.random() * window.innerWidth)
            targetPosition.y = (Math.random() * window.innerHeight);
            console.log(targetPosition.x);
            console.log(targetPosition.y);
        }

        // Set a new timeout to call the function again after the random interval
        setTimeout(runTaskAtRandomIntervals, randomInterval);
    }
    
    // Start the task for the first time
    runTaskAtRandomIntervals();

    // Call updateRobotPosition every 20ms for smooth animation
    setInterval(updateRobotPosition, 20);




});

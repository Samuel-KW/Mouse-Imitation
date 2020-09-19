
// Calulate distance between two points
let distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

// Get path of element
function path(elem) {
    let stack = [elem];

    while (elem.parentNode != null) {
        let parent = elem.parentNode;
    
        stack.push(parent);
        elem = parent;
    }

    stack.push(window);

    return stack;
}

class FakeMouse {
    constructor (x=0, y=0) {

        this.goal = { x: 0, y: 0 };
        this.moving = false;

        // The randomness of the movement
        this.random = 0;
    
        // The current position of the mouse
        this.x = x;
        this.y = y;

        // The current velocity of the mouse
        this.velocity = { x: 0, y: 0 };
        this.max_velocity = { x: 1, y: 1 };

        // The acceleration of the mouse
        this.acceleration = { x: 0.1, y: 0.1 };

        // Speed for distance max velocity algorithm
        this.speed = 5;

        // Setup delta time
        this.last_update = Date.now();
        this.delta_time = 0;

        // Start update loop
        window.requestAnimationFrame(() => this.tick());
    }

    move_to(x, y, random=1, speed=5) {
        
        this.goal.x = x;
        this.goal.y = y;

        this.random = random;
    
        this.moving = true;

        // Assign a random initial velocity
        this.velocity = {
            x: (Math.random() * random) - random / 2,
            y: (Math.random() * random) - random / 2
        };

        // Assign initial acceleration
        this.acceleration = { x: speed, y: speed };

        // Assign initial speed
        this.speed = speed;
    }

    update_mouse() {

        // Make sure the mouse is moving
        if (this.moving === false) return;

        // Determine max velocity based on distance from goal
        this.max_velocity.x = (Math.abs(this.goal.x - this.x) / window.innerWidth) * this.speed;
        this.max_velocity.y = (Math.abs(this.goal.y - this.y) / window.innerHeight) * this.speed;

        // Add the acceleration to the velocity
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // Take into account the max velocity
        if (this.velocity.x > this.max_velocity.x) this.velocity.x = this.max_velocity.x;
        if (this.velocity.y > this.max_velocity.y) this.velocity.y = this.max_velocity.y;

        // Update the mouse position
        this.x += this.velocity.x * this.delta_time;
        this.y += this.velocity.y * this.delta_time;

        // Change acceleration based on goal
        this.acceleration.x = (this.x > this.goal.x ? -Math.abs(this.acceleration.x) : Math.abs(this.acceleration.x));
        this.acceleration.y = (this.y > this.goal.y ? -Math.abs(this.acceleration.y) : Math.abs(this.acceleration.y));

        // If the goal is reached
        if (Math.round(this.x) === Math.round(this.goal.x) && Math.round(this.y) === Math.round(this.goal.y)) {
            
            this.x = this.goal.x;
            this.y = this.goal.y;

            this.moving = false;
        }
    }

    tick () {

        let now = Date.now();

        // Update delta time
        this.delta_time = now - this.last_update;
        this.last_update = now;

        // Update the mouse
        this.update_mouse();

        // Dispatch the movement event
        this.dispatch_movement(this.x, this.y);

        // Call loop
        window.requestAnimationFrame(() => this.tick());
    }

    dispatch_movement(x, y) {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
    }
}

let mouse = new FakeMouse(100, 100);
mouse.move_to(500, 500, 1, 100);

// Remove old mouse preview elements
document.getElementById('mouse-preview')?.remove();

// Create a new canvas for previewing movement
let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.id = 'mouse-preview';
canvas.style = 'position: fixed; top: 0; left: 0; z-index: 2147483647; background-color: transparent; margin: 0; padding: 0; pointer-events: none; user-select: none;';

document.body.appendChild(canvas);

// Handle resizing the browser
function handle_resize () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

handle_resize();
window.addEventListener('resize', handle_resize);

// Initialize basic variable
let x = 0, y = 0,
    mouse_moved = false;

// Handle mouse events
function handle_mouse(event) {

    if (mouse_moved === false) {
        mouse_moved = true;

        x = event.clientX;
        y = event.clientY;
    }

    let old_x = x,
        old_y = y;

    x = event.clientX;
    y = event.clientY;

    // Draw event types
    switch(event.type) {
        case 'mousemove':

            ctx.beginPath();
            ctx.moveTo(old_x, old_y);
            
            ctx.lineTo(x, y);

            ctx.strokeStyle = '#000';
            ctx.stroke();

            break;
        case 'mousedown':

            ctx.beginPath();
            ctx.arc(x, y, 7, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();

            break;
        case 'mouseup':

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'red';
            ctx.fill();

            break;
    }
}

// Add listeners to mouse events
window.addEventListener('mousemove', handle_mouse, false);
window.addEventListener('mouseup', handle_mouse, false);
window.addEventListener('mousedown', handle_mouse, false);
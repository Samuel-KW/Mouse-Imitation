
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
        this.max_velocity = { x: 10, y: 10 };

        // The acceleration of the mouse
        this.acceleration = { x: 1, y: 1 };

        // Setup delta time
        this.last_update = Date.now();
        this.delta_time = 0;

        // Start update loop
        window.requestAnimationFrame(this.tick);
    }

    move_to(x, y, random=0, speed=1) {
        
        this.goal.x = x;
        this.goal.y = y;

        this.random = random;
        this.speed = speed;
    
        this.moving = true;
    }

    update_mouse() {


        if (this.moving === false) return;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
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
        window.requestAnimationFrame(this.tick);
    }

    dispatch_movement(x, y) {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
    }
}

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
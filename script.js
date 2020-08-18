
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
    mouse_moved = false,
    movement_queue = [];

// Create dispatch loop for custom events
function dispatch_loop () {

    let pos = movement_queue.shift();
    if (pos) window.dispatchEvent(new MouseEvent('mousemove', { clientX: pos.x, clientY: pos.y }));
}

// From testing I found the delay from mousemove events to have delay around 7 ms
setInterval(dispatch_loop, 7); 

// Get points along bezier curve
function bezier (start, p1, p2, end, accuracy=0.01) {
    let cX = 3 * (p1.x - start.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = end.x - start.x - cX - bX;

    let cY = 3 * (p1.y - start.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = end.y - start.y - cY - bY;

    let steps = [];
    for (let i = 0; i < 1; i += accuracy) {
        let x = (aX * Math.pow(i, 3)) + (bX * Math.pow(i, 2)) + (cX * i) + start.x,
            y = (aY * Math.pow(i, 3)) + (bY * Math.pow(i, 2)) + (cY * i) + start.y;

        steps.push({ x, y });
    }

    steps.push(end);

    return steps;
}

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

const move_to = async function (pos={ x: 0, y: 0 }, speed=0.01) {

    // Get current mouse position
    const current = { x, y };

    // Get bezier path
    const path = bezier(current, { x: current.x + 10, y: current.y + 10 }, { x: pos.x + 300, y: pos.y + 100 }, pos, speed);

    // Return new promise
    return new Promise((resolve, reject) => {

        // Recursive function to dispatch events
        const dispatch = positions => {
            let coord = positions.shift();
    
            if (coord) {
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: coord.x, clientY: coord.y }));
                setTimeout(() => dispatch(positions), 0);
            } else resolve(pos);
        };

        dispatch(path);
    });
};

// Move the mouse
move_to({x: 10, y: 200}, 0.01).then(e => move_to({x: 1000, y: 200}, 0.01));
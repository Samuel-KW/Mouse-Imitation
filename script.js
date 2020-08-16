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

    window.requestAnimationFrame(dispatch_loop);
}
window.requestAnimationFrame(dispatch_loop);

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


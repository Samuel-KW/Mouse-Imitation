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


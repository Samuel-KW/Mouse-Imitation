// Remove old mouse preview elements
document.getElementById('mouse-preview')?.remove();

let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.id = 'mouse-preview';
canvas.style = 'position: fixed; top: 0; left: 0; z-index: 2147483647; background-color: transparent; margin: 0; padding: 0; pointer-events: none; user-select: none;';

document.body.appendChild(canvas);
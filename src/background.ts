const FPS = 60;

const BACKGROUND_COLOR = '#000000';

const canvas = document.getElementById(
    'background-canvas'
) as HTMLCanvasElement;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animate() {
    ctx.beginPath();
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
}

init();
setInterval(animate, 1000 / FPS);

window.addEventListener('resize', init);

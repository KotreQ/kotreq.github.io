import { Vector2d } from './utils/vector.js';
import { Particle } from './utils/particle.js';
const FPS = 60;
const PARTICLE_DENSITY = 80;
const PARTICLE_VELOCITY_MIN = 25;
const PARTICLE_VELOCITY_MAX = 60;
const REPEL_DISTANCE = 150;
const REPEL_FORCE = 500;
const CENTER_ATTRACTION_FORCE = 100;
const FRICTION = 2.5;
const CONNECTION_DISTANCE = 125;
const PARTICLE_RADIUS = 4;
const PARTICLE_COLORS = ['#00d000', '#00e000', '#00f000'];
const CONNECTION_WIDTH = 3;
const CONNECTION_COLOR = '#00a000';
const BACKGROUND_COLOR = '#000000';
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let mouse = new Vector2d(-1, -1);
let particles = [];
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particle_count = Math.floor((canvas.width / 1000) * (canvas.height / 1000) * PARTICLE_DENSITY);
    // Add particles if there are too little
    while (particles.length < particle_count) {
        particles.push(new Particle({
            particle: {
                colors: PARTICLE_COLORS,
                radius: PARTICLE_RADIUS,
            },
            connections: {
                color: CONNECTION_COLOR,
                width: CONNECTION_WIDTH,
                distance: CONNECTION_DISTANCE,
            },
        }, {
            x1: 0,
            y1: 0,
            x2: canvas.width - 1,
            y2: canvas.height - 1,
        }, {
            velocity_range: {
                min: PARTICLE_VELOCITY_MIN,
                max: PARTICLE_VELOCITY_MAX,
            },
            friction: FRICTION,
        }));
    }
    // Remove particles if there are too much
    while (particles.length > particle_count) {
        particles.shift();
    }
    particles.forEach((particle) => {
        particle.wasSeen = false;
    });
}
function animate() {
    ctx.beginPath();
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    // Repel particles from the mouse
    if (mouse != null) {
        particles.forEach((particle) => {
            mouse = mouse || new Vector2d();
            let force = particle.pos.subtract(mouse);
            let distance = force.getMagnitude();
            if (distance > REPEL_DISTANCE) {
                return;
            }
            force.setMagnitude(REPEL_FORCE * (1 - distance / REPEL_DISTANCE));
            particle.applyForce(force);
        });
    }
    // Attract off-screen particles to the center
    particles.forEach((particle) => {
        if (!particle.wasSeen &&
            (particle.pos.x < 0 ||
                particle.pos.x > canvas.width - 1 ||
                particle.pos.y < 0 ||
                particle.pos.y > canvas.height - 1)) {
            let center = new Vector2d(canvas.width / 2, canvas.height / 2);
            let force = center.subtract(particle.pos);
            force.setMagnitude(CENTER_ATTRACTION_FORCE);
            particle.applyForce(force);
        }
        else if (!particle.wasSeen) {
            particle.wasSeen = true;
        }
    });
    // Update velocities and positions
    particles.forEach((particle) => {
        if (particle.update()) {
            particle.wasSeen = false;
        }
    });
    // Draw connections between all particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            particles[i].drawConnTo(ctx, particles[j]);
        }
    }
    // Draw all particles
    particles.forEach((particle) => {
        particle.draw(ctx);
    });
}
window.addEventListener('mousemove', (event) => {
    mouse = new Vector2d(event.clientX, event.clientY);
});
init();
setInterval(animate, 1000 / FPS);
window.addEventListener('resize', init);

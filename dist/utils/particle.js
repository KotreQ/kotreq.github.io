import { BoundingBox, Vector2d } from './vector.js';
import { randomFromRange, randomChoice } from './random.js';
import { toHex, lerp } from './math.js';
export class Particle {
    constructor(drawing_ctx, style, bounding_box, physics_config) {
        this.drawing_ctx = drawing_ctx;
        this.particle_style = style.particle;
        this.connections_style = style.connections;
        this.velocity_range = physics_config.velocity_range;
        this.friction = physics_config.friction;
        let additional_distance = this.particle_style.radius + this.connections_style.distance;
        this.bounding_box = new BoundingBox(bounding_box.x1 - additional_distance, bounding_box.y1 - additional_distance, bounding_box.x2 + additional_distance, bounding_box.y2 + additional_distance);
        this.pos = new Vector2d();
        this.color = '#000000';
        this.constVelocity = new Vector2d();
        this.tempVelocity = new Vector2d();
        this.lastUpdate = new Date().getTime();
        this.wasSeen = false;
        this.randomize();
    }
    randomize(spawnOnEdge = false) {
        this.constVelocity.setMagnitude(randomFromRange(this.velocity_range.min, this.velocity_range.max));
        if (spawnOnEdge) {
            let { point, edgeNum } = this.bounding_box.randomEdgePoint();
            this.pos = point;
            this.constVelocity.setAngle((randomFromRange(edgeNum - 1, edgeNum + 1) / 2) * Math.PI);
        }
        else {
            this.pos = this.bounding_box.randomPoint();
            this.constVelocity.setAngle(randomFromRange(0, 2 * Math.PI));
        }
        this.color = randomChoice(this.particle_style.colors);
        this.wasSeen = false;
    }
    distanceTo(particle2) {
        return particle2.pos.subtract(this.pos).getMagnitude();
    }
    draw() {
        this.drawing_ctx.beginPath();
        this.drawing_ctx.fillStyle = this.color;
        this.drawing_ctx.arc(this.pos.x, this.pos.y, this.particle_style.radius, 0, 2 * Math.PI);
        this.drawing_ctx.fill();
        this.drawing_ctx.closePath();
    }
    drawConnTo(particle2) {
        let distance = this.distanceTo(particle2);
        if (distance <= this.connections_style.distance) {
            this.drawing_ctx.beginPath();
            this.drawing_ctx.strokeStyle =
                this.connections_style.color +
                    toHex(Math.floor(lerp(256, 0, Math.pow(distance / this.connections_style.distance, 2))), 2);
            this.drawing_ctx.lineWidth = this.connections_style.width;
            this.drawing_ctx.moveTo(this.pos.x, this.pos.y);
            this.drawing_ctx.lineTo(particle2.pos.x, particle2.pos.y);
            this.drawing_ctx.stroke();
            this.drawing_ctx.closePath();
        }
    }
    update() {
        let currentTime = new Date().getTime();
        let deltaTime = (currentTime - this.lastUpdate) / 1000;
        this.lastUpdate = currentTime;
        this.pos = this.pos.add(this.constVelocity.multiply(deltaTime));
        this.pos = this.pos.add(this.tempVelocity.multiply(deltaTime));
        this.tempVelocity = this.tempVelocity.divide(1 + deltaTime * this.friction);
        if (!this.bounding_box.contains(this.pos)) {
            this.tempVelocity = new Vector2d();
            this.randomize(true);
        }
    }
    applyForce(force) {
        let currentMagnitude = this.tempVelocity.getMagnitude();
        let newAngle = this.tempVelocity.add(force).getAngle();
        let newMagnitude = force.getMagnitude();
        if (newMagnitude > currentMagnitude) {
            this.tempVelocity.setMagnitude(newMagnitude);
        }
        this.tempVelocity.setAngle(newAngle);
    }
}

import { BoundingBox, Vector2d } from './vector.js';
import { randomFromRange, randomChoice } from './random.js';
import { toHex, lerp } from './math.js';
export class Particle {
    constructor(drawingCtx, style, boundingBox, physicsConfig) {
        this.drawingCtx = drawingCtx;
        this.particleStyle = style.particle;
        this.connectionsStyle = style.connections;
        this.velocityRange = physicsConfig.velocityRange;
        this.friction = physicsConfig.friction;
        let additionalDistance = this.particleStyle.radius + this.connectionsStyle.distance;
        this.boundingRox = new BoundingBox(boundingBox.x1 - additionalDistance, boundingBox.y1 - additionalDistance, boundingBox.x2 + additionalDistance, boundingBox.y2 + additionalDistance);
        this.pos = new Vector2d();
        this.color = '#000000';
        this.constVelocity = new Vector2d();
        this.tempVelocity = new Vector2d();
        this.lastUpdate = new Date().getTime();
        this.wasSeen = false;
        this.randomize();
    }
    randomize(spawnOnEdge = false) {
        this.constVelocity.setMagnitude(randomFromRange(this.velocityRange.min, this.velocityRange.max));
        if (spawnOnEdge) {
            let { point, edgeNum } = this.boundingRox.randomEdgePoint();
            this.pos = point;
            this.constVelocity.setAngle((randomFromRange(edgeNum - 1, edgeNum + 1) / 2) * Math.PI);
        }
        else {
            this.pos = this.boundingRox.randomPoint();
            this.constVelocity.setAngle(randomFromRange(0, 2 * Math.PI));
        }
        this.color = randomChoice(this.particleStyle.colors);
        this.wasSeen = false;
    }
    distanceTo(particle2) {
        return particle2.pos.subtract(this.pos).getMagnitude();
    }
    draw() {
        this.drawingCtx.beginPath();
        this.drawingCtx.fillStyle = this.color;
        this.drawingCtx.arc(this.pos.x, this.pos.y, this.particleStyle.radius, 0, 2 * Math.PI);
        this.drawingCtx.fill();
        this.drawingCtx.closePath();
    }
    drawConnTo(particle2) {
        let distance = this.distanceTo(particle2);
        if (distance <= this.connectionsStyle.distance) {
            this.drawingCtx.beginPath();
            this.drawingCtx.strokeStyle =
                this.connectionsStyle.color +
                    toHex(Math.floor(lerp(256, 0, Math.pow(distance / this.connectionsStyle.distance, 2))), 2);
            this.drawingCtx.lineWidth = this.connectionsStyle.width;
            this.drawingCtx.moveTo(this.pos.x, this.pos.y);
            this.drawingCtx.lineTo(particle2.pos.x, particle2.pos.y);
            this.drawingCtx.stroke();
            this.drawingCtx.closePath();
        }
    }
    update() {
        let currentTime = new Date().getTime();
        let deltaTime = (currentTime - this.lastUpdate) / 1000;
        this.lastUpdate = currentTime;
        // Limit deltaTime to 1 second
        deltaTime = deltaTime > 1 ? 1 : deltaTime;
        this.pos = this.pos.add(this.constVelocity.multiply(deltaTime));
        this.pos = this.pos.add(this.tempVelocity.multiply(deltaTime));
        this.tempVelocity = this.tempVelocity.divide(1 + deltaTime * this.friction);
        if (!this.boundingRox.contains(this.pos)) {
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

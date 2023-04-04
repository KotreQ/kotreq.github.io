import { randomFromRange, randomBool } from './random.js';

export class BoundingBox {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    getWidth(): number {
        return Math.abs(this.x2 - this.x1) + 1;
    }

    getHeight(): number {
        return Math.abs(this.y2 - this.y1) + 1;
    }

    contains(pos: Vector2d): boolean {
        return (
            pos.x >= this.x1 &&
            pos.x <= this.x2 &&
            pos.y >= this.y1 &&
            pos.y <= this.y2
        );
    }

    randomPoint(): Vector2d {
        return new Vector2d(
            randomFromRange(this.x1, this.x2 + 1),
            randomFromRange(this.y1, this.y2 + 1)
        );
    }

    randomEdgePoint(): { point: Vector2d; edgeNum: number } {
        const width = this.getWidth();
        const height = this.getHeight();
        const isHorizontalEdge = randomFromRange(0, width + height) < width;
        const edgeNum = (randomBool() ? 2 : 0) + (isHorizontalEdge ? 1 : 0);

        let point = this.randomPoint();

        switch (edgeNum) {
            case 0:
                point.x = this.x1;
                break;
            case 1:
                point.y = this.y1;
                break;
            case 2:
                point.x = this.x2;
                break;
            case 3:
                point.y = this.y2;
                break;
        }

        return { point, edgeNum };
    }
}

export class Vector2d {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    getAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    setAngle(angle: number) {
        const magnitude = this.getMagnitude();
        this.x = Math.cos(angle) * magnitude;
        this.y = Math.sin(angle) * magnitude;
    }

    getMagnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMagnitude(magnitude: number) {
        const direction = this.getAngle();
        this.x = Math.cos(direction) * magnitude;
        this.y = Math.sin(direction) * magnitude;
    }

    add(other: Vector2d): Vector2d {
        return new Vector2d(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vector2d): Vector2d {
        return new Vector2d(this.x - other.x, this.y - other.y);
    }

    multiply(scalar: number): Vector2d {
        return new Vector2d(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vector2d {
        return new Vector2d(this.x / scalar, this.y / scalar);
    }

    normalize(): Vector2d {
        const magnitude = this.getMagnitude();
        return this.divide(magnitude);
    }

    copy(): Vector2d {
        return new Vector2d(this.x, this.y);
    }
}

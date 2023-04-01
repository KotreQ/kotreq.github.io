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

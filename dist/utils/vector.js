export class Vector2d {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    setAngle(angle) {
        const magnitude = this.getMagnitude();
        this.x = Math.cos(angle) * magnitude;
        this.y = Math.sin(angle) * magnitude;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    setMagnitude(magnitude) {
        const direction = this.getAngle();
        this.x = Math.cos(direction) * magnitude;
        this.y = Math.sin(direction) * magnitude;
    }
    add(other) {
        return new Vector2d(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Vector2d(this.x - other.x, this.y - other.y);
    }
    multiply(scalar) {
        return new Vector2d(this.x * scalar, this.y * scalar);
    }
    divide(scalar) {
        return new Vector2d(this.x / scalar, this.y / scalar);
    }
    normalize() {
        const magnitude = this.getMagnitude();
        return this.divide(magnitude);
    }
    copy() {
        return new Vector2d(this.x, this.y);
    }
}

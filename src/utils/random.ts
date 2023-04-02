import { Vector2d, boundingBox } from './vector.js';

export function randomBool() {
    return Math.random() < 0.5;
}

export function randomFromRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

export function randomChoice(arr: string | any[]): any {
    return arr[Math.floor(randomFromRange(0, arr.length))];
}

export function randomPoint(bounding_box: boundingBox): Vector2d {
    return new Vector2d(
        randomFromRange(bounding_box.x1, bounding_box.x2 + 1),
        randomFromRange(bounding_box.y1, bounding_box.y2 + 1)
    );
}

export function randomEdgePoint(bounding_box: boundingBox): {
    point: Vector2d;
    edgeNum: number;
} {
    const width = Math.abs(bounding_box.x2 - bounding_box.x1) + 1;
    const height = Math.abs(bounding_box.y2 - bounding_box.y1) + 1;
    const isHorizontalEdge = randomFromRange(0, width + height) < width;
    const isLowEdge = randomBool();

    let point = new Vector2d();

    if (isHorizontalEdge) {
        point.x = randomFromRange(bounding_box.x1, bounding_box.x2 + 1);
        point.y = isLowEdge ? bounding_box.y1 : bounding_box.y2;
    } else {
        point.x = isLowEdge ? bounding_box.x1 : bounding_box.x2;
        point.y = randomFromRange(bounding_box.y1, bounding_box.y2 + 1);
    }

    const edgeNum =
        (isHorizontalEdge ? 1 : 0) + (isHorizontalEdge != isLowEdge ? 2 : 0);

    return { point, edgeNum: edgeNum };
}

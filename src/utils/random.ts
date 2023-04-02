export function randomBool() {
    return Math.random() < 0.5;
}

export function randomFromRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

export function randomChoice(arr: string | any[]): any {
    return arr[Math.floor(randomFromRange(0, arr.length))];
}

export function randomBool() {
    return Math.random() < 0.5;
}
export function randomFromRange(min, max) {
    return min + Math.random() * (max - min);
}
export function randomChoice(arr) {
    return arr[Math.floor(randomFromRange(0, arr.length))];
}

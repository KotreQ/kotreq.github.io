export function lerp(a, b, t) {
    if (t <= 0)
        return a;
    if (t >= 1)
        return b;
    return (1 - t) * a + t * b;
}
export function toHex(a, hexDigits) {
    if (hexDigits > 0) {
        let result = (a + (1 << (4 * hexDigits))).toString(16);
        return result.slice(-hexDigits);
    }
    return a.toString(16);
}

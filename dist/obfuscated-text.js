import { randomChoice } from './utils/random.js';
const FPS = 40;
const RANDOM_OBFUSCATION_CHANCE = 0.002;
const OBFUSCATION_RESOLVE_CHANCE = 0.05;
const OBFUSCATED_CHARS = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
const OBFUSCATED_CLASS_NAME = 'obfuscated';
class ObfuscatedText {
    constructor(textObject) {
        this.text = textObject;
        if (!this.text.originalText) {
            this.text.originalText = textObject.textContent || '';
        }
    }
    update() {
        let newString = '';
        if (!this.text.originalText) {
            return;
        }
        let lengthDiff = this.text.originalText.length - this.text.textContent.length;
        if (lengthDiff > 0) {
            this.text.textContent += ' '.repeat(lengthDiff);
        }
        else if (lengthDiff < 0) {
            this.text.originalText += this.text.textContent.slice(lengthDiff);
        }
        for (let i = 0; i < this.text.originalText.length; i++) {
            // Character should not be obfuscated
            if (!OBFUSCATED_CHARS.includes(this.text.originalText[i])) {
                newString += this.text.originalText[i];
                continue;
            }
            // Right character is in place
            if (this.text.textContent[i] == this.text.originalText[i]) {
                if (Math.random() < RANDOM_OBFUSCATION_CHANCE) {
                    newString += randomChoice(OBFUSCATED_CHARS.replace(this.text.originalText[i], ''));
                }
                else {
                    newString += this.text.originalText[i];
                }
            }
            // Wrong character is in place
            else {
                if (Math.random() < OBFUSCATION_RESOLVE_CHANCE) {
                    // Write correct character
                    newString += this.text.originalText[i];
                }
                else {
                    // Write incorrect character
                    newString += randomChoice(OBFUSCATED_CHARS.replace(this.text.originalText[i], ''));
                }
            }
        }
        if (newString != this.text.textContent) {
            this.text.textContent = newString;
        }
    }
}
let obfuscatedTexts = [];
function init() {
    obfuscatedTexts = [];
    let queue = [];
    Array.from(document.getElementsByClassName(OBFUSCATED_CLASS_NAME)).forEach((element) => {
        queue.push(...element.childNodes);
    });
    while (queue.length > 0) {
        let node = queue.pop();
        if (node instanceof Text) {
            obfuscatedTexts.push(new ObfuscatedText(node));
        }
        else if (node instanceof Element &&
            !node.classList.contains(OBFUSCATED_CLASS_NAME)) {
            queue.push(...node.childNodes);
        }
    }
}
function animate() {
    obfuscatedTexts.forEach((obfuscatedText) => {
        obfuscatedText.update();
    });
}
init();
setInterval(animate, 1000 / FPS);

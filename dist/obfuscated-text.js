import { randomChoice } from './utils/random.js';
const FPS = 40;
const RANDOM_OBFUSCATION_CHANCE = 0.002;
const OBFUSCATION_RESOLVE_CHANCE = 0.05;
const OBFUSCATED_CHARS = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
const OBFUSCATED_CLASS_NAME = 'obfuscated';
class ObfuscatedText {
    constructor(textObject) {
        this.textObject = textObject;
        this.text = textObject.textContent || '';
        textObject.textContent = Array(this.text.length).fill(' ').join('');
    }
    update() {
        let newString = '';
        for (let i = 0; i < this.text.length; i++) {
            // Character should not be obfuscated
            if (!OBFUSCATED_CHARS.includes(this.text[i])) {
                newString += this.text[i];
                continue;
            }
            this.textObject.textContent = this.textObject.textContent || '';
            // Right character is in place
            if (this.textObject.textContent[i] == this.text[i]) {
                if (Math.random() < RANDOM_OBFUSCATION_CHANCE) {
                    newString += randomChoice(OBFUSCATED_CHARS.replace(this.text[i], ''));
                }
                else {
                    newString += this.text[i];
                }
            }
            // Wrong character is in place
            else {
                if (Math.random() < OBFUSCATION_RESOLVE_CHANCE) {
                    // Write correct character
                    newString += this.text[i];
                }
                else {
                    // Write incorrect character
                    newString += randomChoice(OBFUSCATED_CHARS.replace(this.text[i], ''));
                }
            }
        }
        if (newString != this.textObject.textContent) {
            this.textObject.textContent = newString;
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
        else if (node instanceof Element && !node.classList.contains(OBFUSCATED_CLASS_NAME)) {
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

import { randomChoice } from './utils/random.js';

const FPS = 40;

const RANDOM_OBFUSCATION_CHANCE = 0.002;
const OBFUSCATION_RESOLVE_CHANCE = 0.05;

const OBFUSCATED_CHARS =
    '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

const OBFUSCATED_CLASS_NAME = 'obfuscated';

interface ObfuscatedTextNode extends Text {
    originalText: string | undefined;
    textContent: string;
}

class ObfuscatedText {
    private text: ObfuscatedTextNode;

    constructor(textObject: Text) {
        this.text = textObject as ObfuscatedTextNode;
        if (!this.text.originalText) {
            this.text.originalText = textObject.textContent || '';
        }
    }

    reset() {
        this.text.textContent = this.text.originalText || '';
        delete this.text.originalText;
    }

    isConnected(): boolean {
        return this.text.isConnected;
    }

    isSameNode(node: Node): boolean {
        return this.text.isSameNode(node);
    }

    hasParentWithClass(className: string): boolean {
        return this.text.parentElement?.closest(`.${className}`) != null;
    }

    update() {
        let newString = '';
        if (!this.text.originalText) {
            return;
        }

        let lengthDiff =
            this.text.originalText.length - this.text.textContent.length;
        if (lengthDiff > 0) {
            this.text.originalText = this.text.originalText.slice(
                0,
                -lengthDiff
            );
        } else if (lengthDiff < 0) {
            this.text.originalText += this.text.textContent.slice(lengthDiff);
        }

        if (lengthDiff) return;

        for (let i = 0; i < this.text.originalText.length; i++) {
            // Character should not be obfuscated
            if (!OBFUSCATED_CHARS.includes(this.text.originalText[i])) {
                newString += this.text.originalText[i];
                continue;
            }

            // Right character is in place
            if (this.text.textContent[i] == this.text.originalText[i]) {
                if (Math.random() < RANDOM_OBFUSCATION_CHANCE) {
                    newString += randomChoice(
                        OBFUSCATED_CHARS.replace(this.text.originalText[i], '')
                    );
                } else {
                    newString += this.text.originalText[i];
                }
            }

            // Wrong character is in place
            else {
                if (Math.random() < OBFUSCATION_RESOLVE_CHANCE) {
                    // Write correct character
                    newString += this.text.originalText[i];
                } else {
                    // Write incorrect character
                    newString += randomChoice(
                        OBFUSCATED_CHARS.replace(this.text.originalText[i], '')
                    );
                }
            }
        }

        if (newString != this.text.textContent) {
            this.text.textContent = newString;
        }
    }
}

let obfuscatedTexts: ObfuscatedText[] = [];

function refreshNodes() {
    let removedTexts: ObfuscatedText[] = [];
    obfuscatedTexts = obfuscatedTexts.filter((obfuscatedText) => {
        // If node removed
        if (
            !obfuscatedText.hasParentWithClass(OBFUSCATED_CLASS_NAME) ||
            !obfuscatedText.isConnected()
        ) {
            removedTexts.push(obfuscatedText);
            return false;
        }
        return true;
    });
    removedTexts.forEach((removedText) => removedText.reset());

    let queue: ChildNode[] = [];

    Array.from(document.getElementsByClassName(OBFUSCATED_CLASS_NAME)).forEach(
        (element) => {
            queue.push(...element.childNodes);
        }
    );

    while (queue.length > 0) {
        let node = queue[0];
        queue.shift();
        if (node instanceof Text) {
            // Prevent duplicates
            if (
                !obfuscatedTexts.some((obfuscatedText) =>
                    obfuscatedText.isSameNode(node)
                )
            )
                obfuscatedTexts.push(new ObfuscatedText(node));
        } else if (
            node instanceof Element &&
            !node.classList.contains(OBFUSCATED_CLASS_NAME)
        ) {
            queue.push(...node.childNodes);
        }
    }
}

function animate() {
    obfuscatedTexts.forEach((obfuscatedText) => {
        obfuscatedText.update();
    });
}

refreshNodes();
setInterval(animate, 1000 / FPS);
setInterval(refreshNodes, 1000);

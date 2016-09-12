// We need to use a polyfill itself here,
// not its' possible native implementation.
import ResizeObserver from 'resize-observer-polyfill/src/ResizeObserver';

import randomColor from 'randomcolor';

const hues = [
    'red',
    'pink',
    'blue',
    'orange',
    'purple',
    'monochrome'
];

let colorData = {
    luminosity: 'light',
    hue: hues[getRandomInt(0, 5)]
};

const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
        const rect = entry.contentRect;
        const dimensionsStr = `${rect.width} x ${rect.height}`;

        entry.target.firstElementChild.textContent = dimensionsStr;
    }
});

let index = 0;
let queue = [];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateColorData() {
    colorData.hue = hues[getRandomInt(0, 5)];
}

function generateColor() {
    return randomColor(colorData);
}

function toArray(collection) {
    return Array.prototype.slice.call(collection);
}

function generateElements(container, levels, items = 4) {
    let index = items;

    levels--;

    while (index--) {
        let className = 'block';
        const block = document.createElement('div');

        if (levels) {
            className += ' parent';

            generateElements(block, levels, items);
        } else {
            className += ' leaf';

            block.innerHTML = '<span class="dimen"></span>';
            block.style.backgroundColor = generateColor();
        }

        block.className = className;

        container.appendChild(block);
    }
}

generateElements(document.getElementById('container'), 3);

function populateQueue() {
    index = 0;
    queue = toArray(document.querySelectorAll('.block'));

    updateColorData();

    requestAnimationFrame(resolveNextItem);
}

function resolveNextItem() {
    const block = queue.shift();

    if (!block) {
        setTimeout(populateQueue, 2500)

        return;
    }

    if (!index || index === 2) {
        block.style.maxWidth = getRandomInt(30, 50) + '%';

        if (index === 2) {
            block.style.minHeight = getRandomInt(0, 80) + '%';
        }
    }

    if (~block.className.indexOf('leaf')) {
        block.style.backgroundColor = generateColor();
    }

    if (++index === 4) {
        index = 0;
    }

    requestAnimationFrame(resolveNextItem);
}


for (const leaf of toArray(document.querySelectorAll('.leaf'))) {
    observer.observe(leaf);
}

setTimeout(populateQueue, 2000);

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

function resizeElements() {
    let blocks = document.querySelectorAll('.block');
    let index = 0;

    for (const block of toArray(blocks)) {
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
    }

    document.body.style.backgroundColor = generateColor();

    setTimeout(resizeElements, 2500);
}

generateElements(document.getElementById('container'), 3);

for (const leaf of toArray(document.querySelectorAll('.leaf'))) {
    observer.observe(leaf);
}

setTimeout(resizeElements, 2000);
setInterval(updateColorData, 10000);

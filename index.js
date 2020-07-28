const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const size = 800
const scale = 8
const resolution = size / scale

let cells;

setInterval(step, 500);

setup();
randomCells();
drawCells();
step();

function setup() {
    canvas.width = size;
    canvas.height = size;
    context.fillStyle = "black";
    context.scale(scale, scale);
    cells = createCells()
}

function createCells() {
    let arr = new Array(resolution);
    for (let x = 0; x < resolution; x++) {
        let cols = new Array(resolution);
        for (let y = 0; y < resolution; y++) {
            cols[y] = false;
        }
        arr[x] = cols;
    }
    return arr;
}

function randomCells() {
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            if (Math.random() < 0.5) cells[x][y] = true;
        }
    }
}

function drawCells() {
    context.fillStyle = "white";
    context.fillRect(0, 0, resolution - 1, resolution - 1);
    context.fillStyle = "black";

    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            if (cells[x][y]) context.fillRect(x, y, 1, 1)
        }
    } 
}

function step() {
    let newCells = createCells();

    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            const neighbours = getNeighbourCount(x, y);

            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) newCells[x][y] = true;
            else if (!cells[x][y] && neighbours === 3) newCells[x][y] = true;
        }
    }
    cells = newCells;
    drawCells();
}

function getNeighbourCount(x, y) {
    let count = 0;

    for (let a = -1; a < 2; a++) {
        for (let b = -1; b < 2; b++) {
            if (b === 0 && a === 0) continue;
            if (x + b < 0 || x + b > resolution - 1) continue;
            if (y + a < 0 || y + a > resolution - 1) continue;
            if (cells[x + b][y + a]) count++;
        }
    }
    return count;
}
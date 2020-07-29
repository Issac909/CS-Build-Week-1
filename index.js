// creates a canvas to display our animation for Conway's Game of Life
const canvas = document.getElementById("canvas");
// tells convas what kind of context it will contain
const context = canvas.getContext("2d");
// size is used to determine how large the canvas will be, along as set the boundaries that the animation will take into account
const size = 600;
// scale is the size of each individual cell
const scale = 8;
// setting up the max (highest numbered position in the rowsay[x][y])
const resolution = size / scale;
// an rowsay that will hold the set up for our rows and columns[x][y]
let cells;

let speed = 500
let speed_value = document.getElementById("speed_value");
speed_value.innerHTML = speed

const slower = document.getElementById("slower");
const faster = document.getElementById("faster");

const play = document.getElementById("play");
const step_by_step = document.getElementById("step");
const pause = document.getElementById("pause");
const stop = document.getElementById("stop");

let isPaused = false;

canvas.width = size;
canvas.height = size;

let interval = setInterval(step, speed)

slower.addEventListener("click", function() {
    if (speed <= 1000 && speed >= 0) {
        new_speed = speed += 100
        speed_value.innerHTML = speed
        setInterval(step, new_speed)
    } 
     else {
        return console.log('No Speed')
    }
})

faster.addEventListener("click", function() {
    if (speed <= 1000 && speed >= 0) {
        new_speed = speed -= 100
        speed_value.innerHTML = speed
        setInterval(step, new_speed)
    } 
     else {
        return console.log("Max Speed")
    }
})

// intial generation
play.addEventListener("click", function() {
    if (isPaused === true) {
        isPaused = !isPaused;
    } else if (!cells) {
        setup();
        // setting up future generations
        randomCells();
        // displays the next generation when time interval expires
        drawCells();
        // determines which cell can be live/dead according to the rules of life
        step();    
        
    } else {
        return
    }
})

step_by_step.addEventListener("click", function() {
    if (isPaused === true) {
        drawCells();
        step();
    }
    else {
        isPaused = true;
    }
})

pause.addEventListener("click", function() {
    isPaused = !isPaused;
})

stop.addEventListener("click", function() {
    context.fillStyle = "white";
    context.fillRect(0, 0, resolution, resolution);
    cells = undefined;
    speed = 500;
    speed_value.innerHTML = speed
})

function setup() {
    // setting up the canvas size and basic black/white display
    canvas.width = size;
    canvas.height = size;
    context.fillStyle = "black";
    context.scale(scale, scale);
    cells = createCells();
}

function createCells() {
    // sets up an array for rows
    let rows = new Array(resolution);

    for (let x = 0; x < resolution; x++) {
        let cols = new Array(resolution);
        // adding array for 2nd dimensions / columns to the grid
        for (let y = 0; y < resolution; y++) {
            // it will fill the columns with rows up until its set max
            cols[y] = false;
        }
        // attaching the array of columns to the array of rows
        rows[x] = cols;
    }
    // returns a single array with columns and rows
    return rows;
}

function randomCells() {
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            // targets each cell and determines if it is alive or dead initally
            if (Math.random() < 0.5) cells[x][y] = true;
        }
    }
}

function drawCells() {
    // will color dead cells "white"
    context.fillStyle = "white";
    context.fillRect(0, 0, resolution, resolution);
    // will color live cells "black"
    context.fillStyle = "black";


    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            // marks proper cells alive 
            if (cells[x][y]) {
                context.fillRect(x, y, 1, 1)   
            }
        }
    } 
}

function step() {
    let newCells = createCells();
   
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            // variable to determine whether a cell is dead or alive
            const neighbours = getNeighbourCount(x, y);
            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) newCells[x][y] = true;
            // if cell status is present with 2-3 neighbours, cell will be alive
            else if (!cells[x][y] && neighbours === 3) newCells[x][y] = true;
            // if cell status is not present and has 3 neighbours, cell will be alive
        }
    }
    // sets next generation of cells as the current generation
    cells = newCells;
    // display new generation of cells
    if (isPaused === true) {
        return console.log("Game Paused")
    } else {
        drawCells();
    }
}

function getNeighbourCount(x, y) {
    // count will increase for every cell that counts as "alive" according to the rules
    let count = 0;

    for (let a = -1; a < 2; a++) {
        for (let b = -1; b < 2; b++) {
            // x and y variables are coordinates referencing the cell in question
            if (b === 0 && a === 0) continue;
            // if a and b both = 0, this is the current position of the cell
            if (x + b < 0 || x + b > resolution - 1) continue;
            // checking the adjacent row to the left and right of current cell
            if (y + a < 0 || y + a > resolution - 1) continue;
            // checking the adjacent column up and down of current cell
            if (cells[x + b][y + a]) count++;
            // if a live cell is found, increase count
        }
    }    
    
    // returns count of live neighbours
    return count;
}
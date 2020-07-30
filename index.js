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
// an array that will hold the set up for our rows and columns[x][y]
let cells;
// speed given for animation
let speed = 500
// display speed value
let speed_value = document.getElementById("speed_value");
speed_value.innerHTML = speed
// creating variables for buttons
const slower = document.getElementById("slower");
const faster = document.getElementById("faster");

const play = document.getElementById("play");
const step_by_step = document.getElementById("step");
const pause = document.getElementById("pause");
const stop = document.getElementById("stop");

const preset1 = document.getElementById("brain")
const preset2 = document.getElementById("dragon")
const preset3 = document.getElementById("heart")
const preset4 = document.getElementById("pulsar")


let isPaused = false;
// default size of the canvas
canvas.width = size;
canvas.height = size;
// setting up animation speed
let interval = setInterval(step, speed)

// attaching functions to buttons
slower.addEventListener("click", function() {
    if (speed <= 1000 && speed >= 0) {
        new_speed = speed += 100
        speed_value.innerHTML = speed
        interval = setInterval(step, new_speed)
    } 
     else {
        return console.log('No Speed')
    }
})

faster.addEventListener("click", function() {
    if (speed <= 1000 && speed >= 0) {
        new_speed = speed -= 100
        speed_value.innerHTML = speed
        interval = setInterval(step, new_speed)
    } 
     else {
        return console.log("Max Speed")
    }
})

play.addEventListener("click", function() {
    if (isPaused === true) {
        isPaused = !isPaused;
    } else if (!cells) {
        // intial generation
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

// preset buttons
preset1.addEventListener("click", function() {
    const one = document.getElementById("one")
    const selected1 = document.getElementById("preset-1")

    if (one.classList.contains("on") && selected1.classList.contains("selected")) {
        return clearSelected();
    } else {
        clearSelected();
        one.classList.add("on")
        selected1.classList.add("selected")
        makePattern(17, 11, 'b3o9b3ob$obob2o5b2obobo$obobo7bobobo$bob2ob2ob2ob2obob$5bobobobo5b$3bobobobobobo3b$2b2obobobobob2o2b$2b3o2bobo2b3o2b$2b2o2bo3bo2b2o2b$bo4b2ob2o4bob$bo13bo!')
    }
})

preset2.addEventListener("click", function() {
    const two = document.getElementById("two");
    const selected2 = document.getElementById("preset-2")

    if (two.classList.contains("on") && selected2.classList.contains("selected")) {
        return clearSelected();
    } else {
        clearSelected();
        two.classList.add("on")
        selected2.classList.add("selected")
        makePattern(29, 18, '12bo16b$12b2o14bo$10bob2o5bobo4b2ob$5bo3bo3b3o2bo4bo5b$2o3bo2bo6bobo5b3o2bo$2o3bob2o6bo3bobobo5b$2o3bo10bobo7b2ob$5b2o14bo6bo$7bo12bobo6b$7bo12bobo6b$5b2o14bo6bo$2o3bo10bobo7b2ob$2o3bob2o6bo3bobobo5b$2o3bo2bo6bobo5b3o2bo$5bo3bo3b3o2bo4bo5b$10bob2o5bobo4b2ob$12b2o14bo$12bo!')
    }
})

preset3.addEventListener("click", function() {
    const three = document.getElementById("three")
    const selected3 = document.getElementById("preset-3") 

    if (three.classList.contains("on") && selected3.classList.contains("selected")) {
        return clearSelected();
    } else {
        clearSelected();
        three.classList.add("on")
        selected3.classList.add("selected")
        makePattern(11, 11, '5bo5b$4bo2bo3b$bo2bo2bo3b$obobobob2ob$bo2bo2bo3b$4bo5bo$5b5ob2$7bo3b$6bobo2b$7bo!')
    }
})

preset4.addEventListener("click", function() {
    const four = document.getElementById("four");
    const selected4 = document.getElementById("preset-4")

    if (four.classList.contains("on") && selected4.classList.contains("selected")) {
        return clearSelected();
    } else {
        clearSelected();
        four.classList.add("on")
        selected4.classList.add("selected")
        makePattern(13, 13, '2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!')
    }
})

function clearSelected() {
    const one = document.getElementById("one")
    const selected1 = document.getElementById("preset-1")
    const two = document.getElementById("two");
    const selected2 = document.getElementById("preset-2")
    const three = document.getElementById("three")
    const selected3 = document.getElementById("preset-3") 
    const four = document.getElementById("four");
    const selected4 = document.getElementById("preset-4")

    one.classList.remove("on")
    selected1.classList.remove("selected")
    two.classList.remove("on")
    selected2.classList.remove("selected")
    three.classList.remove("on")
    selected3.classList.remove("selected")
    four.classList.remove("on")
    selected4.classList.remove("selected")
}
// functions that make game of life
function setup() {
    // setting up the canvas size and basic black/white display
    canvas.width = size;
    canvas.height = size;
    context.fillStyle = "black";
    context.scale(scale, scale);
    cells = createGrid();
}

function createGrid() {
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
    let newCells = createGrid();
   
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
            if (cells[x + b] && cells[x + b][y + a]) count++;
            // if a live cell is found, increase count
        }
    }    
    // returns count of live neighbours
    return count;
}

function findStartLocation(patternWidth, patternHeight) {
    let x = floor((size - patternWidth) / 2);
    let y = floor((size - patternHeight) / 2);
    return {x: x, y: y}
}

function makePattern(x, y, code) {
    let start = findStartLocation(x, y);
    let locations = lengthDecoder(code);

    setup();
    fillGrid(locations, start);
    drawCells();
    step();
}

function resetGrid() {
    for(let i = 0; i < cells.length; i++) {
        for(let k = 0; k < cells[i].length; k++) {
            cells[i][k].value = false;
        }
    }
}

function fillGrid(locations, start) {
    resetGrid();

    for(let i = 0; i < locations.length; i++) {
        let x = start.x + locations[i][0];
        let y = start.y + locations[i][1];
        cells[x][y].value = 1;
    }
     drawCells();
}

function renderPattern() {
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[0].length; j++) {
            fill(cells[i][j] ? context.fillStyle("purple") : context.fillStyle("yellow"));
            rect(i * resolution, j * resolution, resolution, resolution)
        }
    }
}

function lengthDecoder(rle) {
    let x = 0;
    let y = 0;
    let locations = [];
    let s = 0;
    for (let i = 0; i < rle.length - 1; i++) {
      let char = rle[i];
  
      if (char == '$') {
        y++;
        x = 0;
      } else if (char == 'b') {
        x++;
      } else if (char == 'o') {
        locations.push([x, y]);
        x++;
      } else {
        s = i;
        i++;
        while (rle[i] != 'b' && rle[i] != 'o' && rle[i] != '$') {
          i++;
        }
        let num = parseInt(rle.substring(s, i));
  
        if (rle[i] == 'b') {
          x += num;
        } else if (rle[i] == 'o') {
          for (let j = 0; j < num; j++) {
            locations.push([x, y]);
            x++;
          }
        } else {
          y += num;
          x = 0;
        }
      }
    }
    return locations;
}
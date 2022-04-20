enum State {
    input,
    running
}

const cellsA: number[][] = [];
const cellsB: number[][] = [];
let activeCells = cellsA;
let state: State = State.input;

const w = 45;
const h = 30;
const cellSize = 15;
const filledFieldFactor = 0.15;

function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    const myCanvas = createCanvas(w * cellSize, h * cellSize);
    myCanvas.parent('canvasDiv');
    frameRate(10);

    for (let i = 0; i < w; i++) {
        const newCellsA = [];
        const newCellsB = [];
        for (let j = 0; j < h; j++) {
            newCellsA.push(Math.random() < filledFieldFactor ? 1 : 0)
            newCellsB.push(0);
        }
        cellsA.push(newCellsA);
        cellsB.push(newCellsB);
    }
}

function draw() {
    // Calculate next gen
    if (state === State.running && frameCount % 5 === 0) {
        calculateNextGen();
    }

    // Draw
    drawOnCanvas()
}

let calculateNextGen = () => {
    // Switch arrays
    let oldCells;
    if (activeCells === cellsA) {
        activeCells = cellsB;
        oldCells = cellsA;
    } else {
        activeCells = cellsA;
        oldCells = cellsB;
    }

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (countNeighbors(i, j, oldCells) === 3 || (oldCells[i][j] === 1 && countNeighbors(i, j, oldCells) === 2)) {
                activeCells[i][j] = 1;
            } else {
                activeCells[i][j] = 0;
            }
        }
    }
}

const countNeighbors = (i: number, j: number, oldCells: number[][]): number => {
    return getN(oldCells, i - 1, j - 1) + getN(oldCells, i - 1, j) + getN(oldCells, i - 1, j + 1)
        + getN(oldCells, i, j - 1) + getN(oldCells, i, j + 1)
        + getN(oldCells, i + 1, j - 1) + getN(oldCells, i + 1, j) + getN(oldCells, i + 1, j + 1);
}

const getN = (oldCells: number[][], i: number, j: number): number => {
    return (oldCells[i] ?? [])[j] ?? 0;
}

const drawOnCanvas = (): void => {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const value = activeCells[i][j];
            fill(value === 1 ? 0 : 250);
            square(i * cellSize, j * cellSize, cellSize);
        }
    }
}

const toggleRun = (): void => {
    state = (state === State.running) ? State.input : State.running;
};

const resetField = (random: boolean): void => {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            let value = 0;
            if (random) {
                value = Math.random() < filledFieldFactor ? 1 : 0;
            }
            cellsA[i][j] = value;
            cellsB[i][j] = value;
        }
    }
};

const getMousePos = (canvas: HTMLElement, event: MouseEvent): {x: number, y: number} => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

// Triggered by P5
function mouseClicked(event: any): void {
    // Code adapted from: https://stackoverflow.com/a/17130415
    const canvas = document.getElementsByTagName('canvas')[0];
    const pos = this.getMousePos(canvas, event);

    const x = Math.floor(pos.x / cellSize);
    const y = Math.floor(pos.y / cellSize);

    if (state === State.input && x >= 0 && x < w && y > 0 && y < h) {
        activeCells[x][y] = (activeCells[x][y] === 0) ? 1 : 0;
    }
}

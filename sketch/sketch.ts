enum State {
  input,
  running
}

const cellsA: number[][] = [];
const cellsB: number[][] = [];
let activeCells = cellsA;
let state: State = State.input;

const w = 80;
const h = 60;
const cellSize = 20;

// P5 will automatically use global mode if a draw() function is defined
function setup() {
  const myCanvas = createCanvas(800, 600);
  myCanvas.parent('canvasDiv');

  for (let i = 0; i < h; i++) {
    const newCellsA = [];
    const newCellsB = [];
    for (let j = 0; j < w; j++) {
      newCellsA.push(0);
      newCellsB.push(0); // Math.random() < 0.3 ? 1 : 0
    }
    cellsA.push(newCellsA);
    cellsB.push(newCellsB);
  }

  // console.log("🚀 - Setup initialized - P5 is running");
  // createCanvas(windowWidth, windowHeight);
  // rectMode(CENTER).noFill().frameRate(30);

  // Speed slider
  // speed = createSlider(0, 15, 3, 1);
  // speed.position(10, 10);
  // speed.style("width", "80px");
}

function draw() {
  // Calculate next gen
  if (state === State.running && frameCount % 15 === 0) {
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

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (countNeighbors(i, j, oldCells) === 3 || (oldCells[i][j] === 1 && countNeighbors(i, j, oldCells) === 2)) {
        activeCells[i][j] = 1;
      } else {
        activeCells[i][j] = 0;
      }
    }
  }
}

const countNeighbors = (i: number, j: number, oldCells: number[][]): number => {
  let count = 0;
  if (j === 0 || i === 0 || j === w - 1 || i === h - 1) {
    return 0;
  }
  count += oldCells[i - 1][j - 1];
  count += oldCells[i - 1][j];
  count += oldCells[i - 1][j + 1];

  count += oldCells[i][j - 1];
  count += oldCells[i][j + 1];

  count += oldCells[i + 1][j - 1];
  count += oldCells[i + 1][j];
  count += oldCells[i + 1][j + 1];
  return count;
}

const drawOnCanvas = (): void => {
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const value = activeCells[i][j];
      fill(value === 1 ? 0 : 250);
      square(i * cellSize, j * cellSize, cellSize);
    }
  }
}

const toggleRun = () => {
  if (state === State.running) {
    state = State.input;
  } else {
    state = State.running;
  }
};

function mouseClicked(event: any) {
  console.log('mouseClicked:', event);
  const x = Math.floor(event.pageX / 20);
  const y = Math.floor(event.pageY / 20);

  if (state === State.input) {
    activeCells[x][y] = 1;
  }
}

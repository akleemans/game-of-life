var State;
(function (State) {
    State[State["input"] = 0] = "input";
    State[State["running"] = 1] = "running";
})(State || (State = {}));
var cellsA = [];
var cellsB = [];
var activeCells = cellsA;
var state = State.input;
var w = 45;
var h = 30;
var cellSize = 15;
var filledFieldFactor = 0.15;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    var myCanvas = createCanvas(w * cellSize, h * cellSize);
    myCanvas.parent('canvasDiv');
    frameRate(10);
    for (var i = 0; i < w; i++) {
        var newCellsA = [];
        var newCellsB = [];
        for (var j = 0; j < h; j++) {
            newCellsA.push(Math.random() < filledFieldFactor ? 1 : 0);
            newCellsB.push(0);
        }
        cellsA.push(newCellsA);
        cellsB.push(newCellsB);
    }
}
function draw() {
    if (state === State.running && frameCount % 5 === 0) {
        calculateNextGen();
    }
    drawOnCanvas();
}
var calculateNextGen = function () {
    var oldCells;
    if (activeCells === cellsA) {
        activeCells = cellsB;
        oldCells = cellsA;
    }
    else {
        activeCells = cellsA;
        oldCells = cellsB;
    }
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            if (countNeighbors(i, j, oldCells) === 3 || (oldCells[i][j] === 1 && countNeighbors(i, j, oldCells) === 2)) {
                activeCells[i][j] = 1;
            }
            else {
                activeCells[i][j] = 0;
            }
        }
    }
};
var countNeighbors = function (i, j, oldCells) {
    return getN(oldCells, i - 1, j - 1) + getN(oldCells, i - 1, j) + getN(oldCells, i - 1, j + 1)
        + getN(oldCells, i, j - 1) + getN(oldCells, i, j + 1)
        + getN(oldCells, i + 1, j - 1) + getN(oldCells, i + 1, j) + getN(oldCells, i + 1, j + 1);
};
var getN = function (oldCells, i, j) {
    var _a, _b;
    return (_b = ((_a = oldCells[i]) !== null && _a !== void 0 ? _a : [])[j]) !== null && _b !== void 0 ? _b : 0;
};
var drawOnCanvas = function () {
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            var value = activeCells[i][j];
            fill(value === 1 ? 0 : 250);
            square(i * cellSize, j * cellSize, cellSize);
        }
    }
};
var toggleRun = function () {
    state = (state === State.running) ? State.input : State.running;
};
var resetField = function (random) {
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            var value = 0;
            if (random) {
                value = Math.random() < filledFieldFactor ? 1 : 0;
            }
            cellsA[i][j] = value;
            cellsB[i][j] = value;
        }
    }
};
var getMousePos = function (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};
function mouseClicked(event) {
    console.log('mouseClicked:', event);
    var canvas = document.getElementsByTagName('canvas')[0];
    var pos = this.getMousePos(canvas, event);
    var x = Math.floor(pos.x / cellSize);
    var y = Math.floor(pos.y / cellSize);
    if (state === State.input && x >= 0 && x < w && y > 0 && y < h) {
        activeCells[x][y] = (activeCells[x][y] === 0) ? 1 : 0;
    }
}
//# sourceMappingURL=../sketch/sketch/build.js.map
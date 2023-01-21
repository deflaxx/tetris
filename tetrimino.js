class Tetrimino {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.TetriminoShape = Object.freeze({
            I: [[new Block("lightblue", 0, 0), new Block("lightblue", 30, 0), new Block("lightblue", 60, 0), new Block("lightblue", 90, 0)]],
            J: [[new Block("darkblue", 0, 0), new Block("rgba(0,0,0,0)", 30, 0), new Block("rgba(0,0,0,0)", 60, 0)], 
                [new Block("darkblue", 0, 30), new Block("darkblue", 30, 30), new Block("darkblue", 60, 30)]],
            L: [[new Block("rgba(0,0,0,0)", 0, 0), new Block("rgba(0,0,0,0)", 30, 0), new Block("orange", 60, 0)], 
                [new Block("orange", 0, 30), new Block("orange", 30, 30), new Block("orange", 60, 30)]],
            O: [[new Block("yellow", 0, 0), new Block("yellow", 30, 0)],
                [new Block("yellow", 0, 30), new Block("yellow", 30, 30)]],
            S: [[new Block("rgba(0,0,0,0)", 0, 0), new Block("green", 30, 0), new Block("green", 60, 0)], 
                [new Block("green", 0, 30), new Block("green", 30, 30), new Block("rgba(0,0,0,0)", 60, 30)]],
            T: [[new Block("rgba(0,0,0,0)", 0, 0), new Block("purple", 30, 0), new Block("rgba(0,0,0,0)", 60, 0)], 
                [new Block("purple", 0, 30), new Block("purple", 30, 30), new Block("purple", 60, 30)]],
            Z: [[new Block("red", 0, 0), new Block("red", 30, 0), new Block("rgba(0,0,0,0)", 60, 0)], 
                [new Block("rgba(0,0,0,0)", 0, 30), new Block("red", 30, 30), new Block("red", 60, 30)]]
        });

        this.shape = this.randomShape();
    }

    rotate(sim = false) {
        let newShape = [];
        let maxX = this.shape[0].length;
        let maxY = this.shape.length;
        for (let x = 0; x < maxX; x++) {
            newShape[x] = [];
            for (let y = 0; y < maxY; y++) {
                let block = this.shape[y][x];
                newShape[x][maxY - 1 - y] = new Block(block.color, block.x, block.y);
                newShape[x][maxY - 1 - y].x = 30 * (maxY - 1 - y);
                newShape[x][maxY - 1 - y].y = 30 * x;
            }
        }
        if (sim) {
            let simRota = new Tetrimino(this.x, this.y);
            simRota.shape = newShape;
            return simRota;
        }
        this.shape = newShape;
    }

    moveLeft() {
        this.x -= 30;
    }

    moveRight() {
        this.x += 30;
    }

    moveDown() {
        this.y += 30;
    }

    randomShape() {
        let shapeKeys = Object.keys(this.TetriminoShape);
        let randomIndex = Math.floor(Math.random() * shapeKeys.length);
        return this.TetriminoShape[shapeKeys[randomIndex]];
    }
}
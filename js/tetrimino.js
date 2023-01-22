class Tetrimino {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.TetriminoShape = Object.freeze({
            I: [[new Block("#bae1ff", 0, 0), new Block("#bae1ff", 30, 0), new Block("#bae1ff", 60, 0), new Block("#bae1ff", 90, 0)]],
            J: [[new Block(" 	#8d8ee1", 0, 0), new Block("rgba(0,0,0,0)", 30, 0), new Block("rgba(0,0,0,0)", 60, 0)], 
                [new Block(" 	#8d8ee1", 0, 30), new Block(" 	#8d8ee1", 30, 30), new Block(" 	#8d8ee1", 60, 30)]],
            L: [[new Block("rgba(0,0,0,0)", 0, 0), new Block("rgba(0,0,0,0)", 30, 0), new Block("#ffdfba", 60, 0)], 
                [new Block("#ffdfba", 0, 30), new Block("#ffdfba", 30, 30), new Block("#ffdfba", 60, 30)]],
            O: [[new Block("#ffffba", 0, 0), new Block("#ffffba", 30, 0)],
                [new Block("#ffffba", 0, 30), new Block("#ffffba", 30, 30)]],
            S: [[new Block("rgba(0,0,0,0)", 0, 0), new Block("#baffc9", 30, 0), new Block("#baffc9", 60, 0)], 
                [new Block("#baffc9", 0, 30), new Block("#baffc9", 30, 30), new Block("rgba(0,0,0,0)", 60, 30)]],
            T: [[new Block("rgba(0,0,0,0)", 0, 0), new Block("#eecbff", 30, 0), new Block("rgba(0,0,0,0)", 60, 0)], 
                [new Block("#eecbff", 0, 30), new Block("#eecbff", 30, 30), new Block("#eecbff", 60, 30)]],
            Z: [[new Block("#ffb3ba", 0, 0), new Block("#ffb3ba", 30, 0), new Block("rgba(0,0,0,0)", 60, 0)], 
                [new Block("rgba(0,0,0,0)", 0, 30), new Block("#ffb3ba", 30, 30), new Block("#ffb3ba", 60, 30)]]
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
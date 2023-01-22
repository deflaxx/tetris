class Grid {
    constructor(){
        let matrix = [];
        for (let i = 0; i < 20; i++) {
        matrix[i] = [];
            for (let j = 0; j < 10; j++) {
                matrix[i][j] = new Block("white", j*30, i*30);
            }
        }
        this.matrix = matrix;
    }
}
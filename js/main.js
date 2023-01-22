class Model {
    constructor() {
        this.grid = new Grid();
        this.piece = new Tetrimino(90, 30);
        this.nextPiece = new Tetrimino(0, 60);
        this.nextnextPiece = new Tetrimino(0, 180);
        this.intervalId = null;
        this.interval = 1000;
        this.lines = 0;
        this.score = 0;
        this.bestScore = 0;
        this.refreshing = true;
    }

    bindDisplayGame(callback){
        this.displayGame = callback;
    }

    bindDisplayPieces(callback){
        this.displayPieces = callback;
    }

    bindDisplayScore(callback){
        this.displayScore = callback;
    }

    bindDestroyRow(callback){
        this.destroyRow = callback;
    }

    bindDisplayGameOver(callback){
        this.displayGameOver = callback;
    }

    bindDisplayPause(callback){
        this.displayPause = callback;
    }

    getGrid(){
        this.displayGame(this.grid.matrix, this.piece);
        this.displayPieces(this.nextPiece, this.nextnextPiece);
        this.displayScore(this.lines, this.score, this.bestScore);
    }

    goLeft(){
        if (this.isLegalMove("ArrowLeft")){
            this.piece.moveLeft();
            this.displayGame(this.grid.matrix, this.piece);
        }
    }

    goRight(){
        if (this.isLegalMove("ArrowRight")){
            this.piece.moveRight();
            this.displayGame(this.grid.matrix, this.piece);
        }
    }

    goDown(){
        if (this.isLegalMove("ArrowDown")){
            this.piece.moveDown();
            this.score += 1;
            this.getGrid();
        }
    }

    rotate(){
        if (this.isLegalMove("ArrowUp")){
            this.piece.rotate();
            this.displayGame(this.grid.matrix, this.piece);
        }
    }

    moveToBottom(){
        while (this.isLegalMove("ArrowDown", false)){
            this.piece.moveDown();
            this.score += 1;
        }
        if (!this.isGameOver(false)) {
            this.getGrid();
            this.completeRow();
        } else {
            this.stopFalling();
        }
    }

    newGame(){
        this.stopFalling();
        this.grid = new Grid();
        this.piece = new Tetrimino(90, 30);
        this.nextPiece = new Tetrimino(0, 60);
        this.nextnextPiece = new Tetrimino(0, 180);
        this.interval = 1000;
        this.lines = 0;
        this.score = 0;
        this.getGrid();
        this.startFalling();
    }

    pause(anim = true){
        if(this.intervalId == null){
            this.startFalling();
            this.getGrid();
        } else {
            this.stopFalling();
            if(anim) {
                this.displayPause();
            }
        }
    }

    isLegalMove(key, refresh = true){
        if (!this.refreshing) {
            return false;
        }
        for (let i = 0; i < this.piece.shape.length; i++) {
            for (let j = 0; j < this.piece.shape[i].length; j++) {
                if(this.piece.shape[i][j].color != "rgba(0,0,0,0)"){
                    switch (key) {
                        case "ArrowLeft":
                            if (this.piece.x+this.piece.shape[i][j].x == 0 || this.grid.matrix[(this.piece.y+this.piece.shape[i][j].y)/30][(this.piece.x+this.piece.shape[i][j].x)/30-1].fixed == 1){
                                return false;
                            }
                            break;
                        case "ArrowRight":
                            if (this.piece.x+this.piece.shape[i][j].x == 270 || this.grid.matrix[(this.piece.y+this.piece.shape[i][j].y)/30][(this.piece.x+this.piece.shape[i][j].x)/30+1].fixed == 1){
                                return false;
                            }
                            break;
                        case "ArrowDown":
                            if (this.piece.y+this.piece.shape[i][j].y == 570 || this.grid.matrix[(this.piece.y+this.piece.shape[i][j].y)/30+1][(this.piece.x+this.piece.shape[i][j].x)/30].fixed == 1){
                                for (let i = 0; i < this.piece.shape.length; i++) {
                                    for (let j = 0; j < this.piece.shape[i].length; j++) {
                                        if(this.piece.shape[i][j].color != "rgba(0,0,0,0)"){
                                            this.grid.matrix[(this.piece.y+this.piece.shape[i][j].y)/30][(this.piece.x+this.piece.shape[i][j].x)/30].color = this.piece.shape[i][j].color;
                                            this.grid.matrix[(this.piece.y+this.piece.shape[i][j].y)/30][(this.piece.x+this.piece.shape[i][j].x)/30].fixed = 1;
                                            if (refresh) {
                                                this.completeRow();
                                            } 
                                        }
                                    }
                                }
                                if (!this.isGameOver()){
                                    if (!refresh) {
                                        setTimeout(() => {
                                            this.changePiece();
                                        }, 100);
                                    } else {
                                        this.changePiece();
                                    }
                                } else {
                                    this.stopFalling();
                                }
                                return false;
                            }
                            break;
                        case "ArrowUp":
                            let sim = this.piece.rotate(true);
                            for (let i = 0; i < sim.shape.length; i++) {
                                for (let j = 0; j < sim.shape[i].length; j++) {
                                    if(sim.shape[i][j].color != "rgba(0,0,0,0)"){
                                        if(sim.x+sim.shape[i][j].x == -30 || sim.x+sim.shape[i][j].x == 300 || sim.y+sim.shape[i][j].y == 600 || this.grid.matrix[(sim.y+sim.shape[i][j].y)/30][(sim.x+sim.shape[i][j].x)/30].fixed == 1){
                                            return false;
                                        }
                                    }
                                }
                            }
                    }
                }
            }
        }
        return true;
    }

    changePiece(){
        this.piece = this.nextPiece;
        this.piece.x = 90;
        this.piece.y = 30;
        this.nextPiece = this.nextnextPiece;
        this.nextPiece.y = 60;
        this.nextnextPiece = new Tetrimino(0, 180);
        this.displayPieces(this.nextPiece, this.nextnextPiece);
    }

    startFalling() {
        if (this.intervalId === null) {
            this.intervalId = setInterval(() => {
                if (this.isLegalMove("ArrowDown")){
                    this.piece.moveDown();
                    this.displayGame(this.grid.matrix, this.piece);
                }
            }, this.interval);
        }
    }

    stopFalling() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    setInterval(interval) {
        this.interval = interval;
        if (this.intervalId !== null) {
            this.stopFalling();
            this.startFalling();
        }
    }

    completeRow(){
        let count = 0;
        for (let i = 0; i < 20; i++) {
            let row = true;
            for (let j = 0; j < 10; j++) {
                if(this.grid.matrix[i][j].fixed == 0){
                    row = false;
                }
            }
            if (row) {
                this.refreshing = false;
                count++;
                this.destroyRow(i);
                for (let k = i; k > 0; k--) {
                    for (let j = 0; j < 10; j++) {
                         this.grid.matrix[k][j].fixed = this.grid.matrix[k-1][j].fixed;
                        this.grid.matrix[k][j].color = this.grid.matrix[k-1][j].color;
                    }
                }
                setTimeout(() => { this.refreshing = true; }, 550);
            }
        }
        if (count > 0) {
            this.score += count*100;
            this.lines += count;
            this.displayScore(this.lines, this.score, this.bestScore);
        }
    }
    
    isGameOver(display = true){
        for (let i = 0; i < 10; i++) {
            if(this.grid.matrix[2][i].fixed == 1){
                if (display) {
                    this.getGrid();
                    this.displayGameOver();  
                }          
                this.bestScore = Math.max(this.bestScore, this.score);
                return true;
            }
        }
        return false;
    }
}

class View {
    constructor(){
        this.tetris = document.getElementById("tetris-canvas");
        this.ctx1 = this.tetris.getContext("2d");
        this.nextPiece = document.getElementById("next-piece");
        this.ctx2 = this.nextPiece.getContext("2d");
        this.linesCount = document.getElementById("lines-count");
        this.scoreCount = document.getElementById("score");
        this.bestScoreCount = document.getElementById("best-score");
        this.playButton = document.getElementById("play-button");
        this.pauseButton = document.getElementById("pause-button");
    }

    displayGame(grid, piece){
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                this.ctx1.fillStyle = grid[i][j].color;
                this.ctx1.fillRect(grid[i][j].x, grid[i][j].y, 30, 30);
            }
        }
        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {
                this.ctx1.fillStyle = piece.shape[i][j].color;
                this.ctx1.fillRect(piece.x+piece.shape[i][j].x, piece.y+piece.shape[i][j].y, 30, 30);
            }
        } 
    }

    displayNextPieces(nextPiece, nextnextPiece){
        this.ctx2.fillStyle = "white";
        this.ctx2.fillRect(0, 0, 120, 270);
        for (let i = 0; i < nextPiece.shape.length; i++) {
            for (let j = 0; j < nextPiece.shape[i].length; j++) {
                this.ctx2.fillStyle = nextPiece.shape[i][j].color;
                this.ctx2.fillRect(nextPiece.x+nextPiece.shape[i][j].x, nextPiece.y+nextPiece.shape[i][j].y, 30, 30);
            }
        }
        for (let i = 0; i < nextnextPiece.shape.length; i++) {
            for (let j = 0; j < nextnextPiece.shape[i].length; j++) {
                this.ctx2.fillStyle = nextnextPiece.shape[i][j].color;
                this.ctx2.fillRect(nextnextPiece.x+nextnextPiece.shape[i][j].x, nextnextPiece.y+nextnextPiece.shape[i][j].y, 30, 30);
            }
        }
    }

    displayScore(lines, score, bestScore){
        this.linesCount.innerHTML = "Lignes : " + lines;
        this.scoreCount.innerHTML = "Score : " + score;
        this.bestScoreCount.innerHTML = "Meilleur score : " + bestScore;
    }
    
    destroyRow(row) {
        this.ctx1.fillStyle = "rgb(255, 255, 255)";
        let i = 0;
        const interval = setInterval(() => {
            if (i > 300) {
                clearInterval(interval);
                return;
            }
            this.ctx1.fillRect(0, row*30, i, 30);
            i += 30;
        }, 50);
    }
    

    displayPause(){
        this.ctx1.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx1.fillRect(0, 0, 300, 600);
        this.ctx1.fillStyle = "white";
        this.ctx1.font = "45px Hanalei Fill";
        this.ctx1.textAlign = "center";
        this.ctx1.fillText("Pause", 150, 300);
        this.ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx2.fillRect(0, 0, 120, 270);
    }

    displayGameOver(){
        this.ctx1.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx1.fillRect(0, 0, 300, 600);
        this.ctx1.fillStyle = "white";
        this.ctx1.font = "45px Hanalei Fill";
        this.ctx1.textAlign = "center";
        this.ctx1.fillText("Game Over", 150, 300);
        this.ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx2.fillRect(0, 0, 120, 270);
    }

    bindGetGrid(callback){
        this.getGrid = callback;
    }

    initView(){ 
        this.getGrid();
    }
}

class Controller {
    constructor(model, view){
        this.model = new Model();
        this.view = new View();
        this.bindDisplayGame = this.bindDisplayGame.bind(this);
        this.model.bindDisplayGame(this.bindDisplayGame);
        this.bindDisplayPieces = this.bindDisplayPieces.bind(this);
        this.model.bindDisplayPieces(this.bindDisplayPieces);
        this.bindDisplayScore = this.bindDisplayScore.bind(this);
        this.model.bindDisplayScore(this.bindDisplayScore);
        this.bindDisplayGameOver = this.bindDisplayGameOver.bind(this);
        this.model.bindDisplayGameOver(this.bindDisplayGameOver);
        this.bindDestroyRow = this.bindDestroyRow.bind(this);
        this.model.bindDestroyRow(this.bindDestroyRow);
        this.bindDisplayPause = this.bindDisplayPause.bind(this);
        this.model.bindDisplayPause(this.bindDisplayPause);
        this.bindGetGrid = this.bindGetGrid.bind(this);
        this.view.bindGetGrid(this.bindGetGrid);
        this.view.initView();
        this.addListener();
        this.model.startFalling();
    }

    bindDisplayGame(grid, piece){
        this.view.displayGame(grid, piece);
    }

    bindDisplayPieces(nextPiece, nextnextPiece){
        this.view.displayNextPieces(nextPiece, nextnextPiece);
    }

    bindDisplayScore(lines, score, bestScore){
        this.view.displayScore(lines, score, bestScore);
    }

    bindDisplayGameOver(){
        this.view.displayGameOver();
    }

    bindDisplayPause(){
        this.view.displayPause();
    }

    bindDestroyRow(row, color){
        this.view.destroyRow(row, color);
    }

    bindGetGrid(){
        this.model.getGrid();
    }

    bindGetPiece(){
        this.model.getPiece();
    }

    addListener(){
        document.addEventListener("keydown", (event) => {
            if (this.model.intervalId != null){
                switch (event.key) {
                    case "ArrowLeft":
                        this.model.goLeft();
                        break;
                    case "ArrowRight":
                        this.model.goRight();
                        break;
                    case "ArrowDown":
                        this.model.goDown();
                        break;
                    case "ArrowUp":
                        this.model.rotate();
                        break;
                }
                switch (event.code) {
                    case "Space":
                        this.model.moveToBottom();
                        break;
                }
            }
            switch (event.key) {
                case "Enter":
                    this.model.newGame();
                    break;
                case "p":
                    this.model.pause();
                    break;
            }
        });
        this.view.playButton.addEventListener("click", (event) => {
            this.model.newGame();
        });
        this.view.pauseButton.addEventListener("click", (event) => {
            this.model.pause();
        });
    }
}

new Controller(new Model(), new View());
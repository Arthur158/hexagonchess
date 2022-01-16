// @ts-nocheck

/**
 * This is a container cell of the board
 */
 class BoardCell {
    /**
     * @param {string|null} pieceType 
     * @param {string|null} color 
     */
    constructor(pieceType, color) {
        this.pieceType = pieceType;
        this.color = color;
    }
}

class GameBoard {
    constructor() {
        this.fileNumber = 11;
        this.levelNumber = 11;
        this.cells = [];
        for(let i = 0; i < this.levelNumber; i++) {
            this.cells[i] = [];
            for(let j = Math.max(0, i - 5); j < Math.min(this.fileNumber, this.fileNumber + 5 - i); j++) {
                this.cells[i][j] = new BoardCell(null, null)
            }
        }
    }

    /**
     * Function that initializes the board with the Glinski starting positions
     */
    initializeGlinski() {
        //white pieces
        this.cells[0][6] = new BoardCell("KING", "WHITE");
        this.cells[0][4] = new BoardCell("QUEEN", "WHITE");

        this.cells[0][3] = new BoardCell("KNIGHT", "WHITE");
        this.cells[0][7] = new BoardCell("KNIGHT", "WHITE");

        this.cells[0][2] = new BoardCell("ROOK", "WHITE");
        this.cells[0][8] = new BoardCell("ROOK", "WHITE");

        this.cells[1][5] = new BoardCell("BISHOP", "WHITE");
        this.cells[2][5] = new BoardCell("BISHOP", "WHITE");
        this.cells[0][5] = new BoardCell("BISHOP", "WHITE");

        //black pieces
        this.cells[9][6] = new BoardCell("KING", "BLACK");
        this.cells[9][4] = new BoardCell("QUEEN", "BLACK");

        this.cells[8][3] = new BoardCell("KNIGHT", "BLACK");
        this.cells[8][7] = new BoardCell("KNIGHT", "BLACK");

        this.cells[7][2] = new BoardCell("ROOK", "BLACK");
        this.cells[7][8] = new BoardCell("ROOK", "BLACK");

        this.cells[10][5] = new BoardCell("BISHOP", "BLACK");
        this.cells[9][5] = new BoardCell("BISHOP", "BLACK");
        this.cells[8][5] = new BoardCell("BISHOP", "BLACK");

        //pawns
        for(let i = 1; i < 10; i++) {
            this.cells[6][i] = new BoardCell("PAWN", "BLACK");
        }
        for(let i = 1; i < 10; i++) {
            this.cells[4-Math.abs(5-i)][i] = new BoardCell("PAWN", "WHITE");
        }
    }

    initializeStalemateOrCheckmateOrCheck() {
        this.cells[0][0] = new BoardCell("KING","BLACK");
        this.cells[1][4] = new BoardCell("ROOK","WHITE");
        this.cells[6][1] = new BoardCell("ROOK","WHITE");
        this.cells[5][4] = new BoardCell("BISHOP","WHITE");
        this.cells[5][5] = new BoardCell("KING","WHITE");
    }

    copyGameBoard(){
        let result=new GameBoard();
        for(let i=0;i<this.cells.length;i++){
            for(let j=0;j<this.cells[i].length;j++){
                if(this.cells[i][j]==null){
                    result.cells[i][j]=null;
                }
                else{
                    result.cells[i][j]=new BoardCell(this.cells[i][j].pieceType,this.cells[i][j].color)
                }
            }
        }
        return result;
    }

    getCoordinates(boardCell){
        let count1=0;
        let count2=0;
        for(let i=0;i<this.cells.length;i++){
            if(this.cells[i].includes(boardCell)){
                for(let j=0;i<cells[i].length;j++){
                    if(this.cells[i][j]===e){
                        return [count1,count2];
                    }
                    else{
                        count2++
                    }
                }
                return [-1,-1];
            }
            else{
                count1++;
            }
        }
        return [-1,-1];
    }

    /**
     * Put the specified piece of color at the requested position on the board (does not do checking)
     * 
     * @param {Position} position 
     * @param {string} pieceType 
     * @param {string} color 
     */
    setPieceAtPosition(position, pieceType, color) {
        let newCoords = GameBoard.fromPosition(position);

        this.cells[newCoords.level][newCoords.file] = new BoardCell(pieceType, color);
    }

    /**
     * Function that returns the piece type and color of a piece on a certain position
     * 
     * @param {Position} p 
     * @returns {[string, string]|null} a tuple containing the said things
     */
    getPieceAtPosition(p){
        let newCoords = GameBoard.fromPosition(p);

        let cell = this.cells[newCoords.level][newCoords.file];

        if(cell!= null &&cell.pieceType != null) return [cell.pieceType, cell.color];
    
        return null;
    }

    /**
     * Moves a piece from position p1 to position p2 
     * and returns any overriden piece
     * 
     * @param {Position} p1 
     * @param {Position} p2 
     * 
     * @returns {[string, string]|null}
     */
    movePiece(p1, p2) {
        let piece = this.getPieceAtPosition(p1);

        if(piece != null) {
            let overriden = this.getPieceAtPosition(p2);

            this.setPieceAtPosition(p1, null, null);
            this.setPieceAtPosition(p2, piece[0], piece[1])


            return overriden;
        }

        return null;
    }

    getKingCoordinates(color) {
        for(let i = 0; i < this.cells.length; i++){
            for(let j = 0; j < this.cells[i].length; j++){
                let curr = this.cells[i][j];
                if(curr != null && curr.pieceType == "KING" && curr.color == color) {
                    return {level: i, file: j};
                }
            }
        }

        return null;
    }

    /**
     * Updates the cells based on provided object
     * 
     * @param {Object} obj 
     */
    fromObj(obj) {
        let arr = obj.cells;

        for(let i = 0; i < arr.length; i++) {
            for(let j = 0; j < arr[i].length; j++) {
                let bcobj = arr[i][j];
                if(bcobj != null){
                    this.cells[i][j] = new BoardCell(bcobj.pieceType, bcobj.color);
                }
            }
        }
    }

    /**
     * Function that transforms a position to a file / level coordinate system
     * 
     * @param {Position} position
     * @returns object containing transformed coordinates
     */
    static fromPosition(position) {
        let level = position.x + 5; // positions start from middle of the board. levels from the bottom. compensate
        let file = position.y + 5; //same with the files

        if(position.y < 0) {
            level += position.y;
        }

        // now the fun part
        for(let i = 0; i < Math.abs(position.z); i++) {
            if(position.z < 0) {
                level += (file >= 5 ? -1 : 0);
            }
            else {
                level += (file > 5 ? 1 : 0);
            }
            file += -Math.sign(position.z);
        }

        return {file: file, level: level};
    }

    
}

/**
 * Class that contains the state of the game, including the board, the timers and the turn
 */
class GameState {
    constructor(){
        this.gameBoard = new GameBoard();
        this.gameBoard.initializeGlinski();
        this.whiteTimer = 600000;
        this.blackTimer = 600000;
        this.lastUpdated = (new Date()).getTime();
        this.turn = 0;
        this.losses = {
            white: [],
            black: [],
        }
    }


    getCurrentPlayer() {
        return this.turn % 2 == 0 ? "WHITE" : "BLACK";
    }

    /**
     * 
     * @param {object} obj 
     */
    fromObj(obj) {
        this.whiteTimer = obj.whiteTimer;
        this.blackTimer = obj.blackTimer;
        this.turn = obj.turn;
        this.losses = obj.losses;

        this.gameBoard.fromObj(obj.gameBoard);
    }

    performMove(p1, p2) {
        let lostPiece = this.gameBoard.movePiece(p1, p2);

        if(lostPiece != null) {
            if(lostPiece[1] == "WHITE") {
                this.losses.white.push(lostPiece[0]);
            }
            else {
                this.losses.black.push(lostPiece[0]);
            }
        }
    }

    initializeTimer() {
        this.lastUpdated = (new Date()).getTime();
    }

    updateTimer(color) {
        let nowTime = (new Date()).getTime();
        
        let elapsedTime = nowTime - this.lastUpdated;

        this.lastUpdated = (new Date()).getTime();

        if(color == "WHITE") {
            this.whiteTimer -= elapsedTime;
        }
        else {
            this.blackTimer -= elapsedTime;
        }
    }

    /**
     * Function that returns the corresponding color of the timer that expired
     * or null, if no timer has expired
     * 
     * @returns {string|null} the corresponding color or null
     */
    getExpiredTimer() {
        if(this.whiteTimer <= 0) return "WHITE";
        if(this.blackTimer <= 0) return "BLACK";

        return null;
    }

}

if(module) {
    module.exports.GameState = GameState;
    module.exports.GameBoard = GameBoard;
}
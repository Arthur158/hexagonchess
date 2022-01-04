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
        this.cells[0][5] = new BoardCell("KING", "WHITE");
        this.cells[10][5] = new BoardCell("KING", "BLACK");
        for(let i = 1; i < 10; i++) {
            this.cells[6][i] = new BoardCell("PAWN", "BLACK");
        }
        this.cells[1][5] = new BoardCell("BISHOP", "WHITE");
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

        if(cell.pieceType != null) return [cell.pieceType, cell.color];
    
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

            //console.log(`[DEBUG] Performed ${piece[0]} ${p1}:${p2}`);

            return overriden;
        }

        return null;
    }

    /**
     * Updates the cells based on provided object
     * 
     * @param {Array} arr 
     */
    fromObj(arr) {
        for(let i = 0; i < arr.length; i++) {
            for(let j = 0; j < arr[i].length; j++) {
                if(!typeof arr[i][j] === undefined) {
                    let bcobj = arr[i][j];
                    
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
            level += (file > 5 ? 1 : 0) * Math.sign(position.z);
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
        this.whiteTimer = 0;
        this.blackTimer = 0;
        this.turn = 0;
        this.losses = {
            white: [],
            black: [],
        }
    }

    /**
     * Sets the game board
     * 
     * @param {GameBoard} board 
     */
    setBoard(board) {
        this.gameBoard = board;
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

        this.gameBoard.fromObj(obj);
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
}

if(module) {
    module.exports.GameState = GameState;
    module.exports.GameBoard = GameBoard;
}
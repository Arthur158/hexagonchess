/**
 * This is a container cell of the board
 */
class BoardCell {
    /**
     * @param {PieceType|null} pieceType 
     * @param {Color|null} color 
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
     * Function that returns the piece type and color of a piece on a certain position
     * 
     * @param {Position} p 
     * @returns {[string, string]|null} a tuple containing the said things
     */
    getPieceAtPosition(p){
        return [PieceType.PAWN, Color.WHITE];
    }
}

if(module) module.exports = GameBoard;
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
     * Put the specified piece of color at the requested position on the board (does not do checking)
     * 
     * @param {Position} position 
     * @param {PieceType} pieceType 
     * @param {Color} color 
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

if(module) module.exports = GameBoard;
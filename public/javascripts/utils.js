// @ts-nocheck

// if(module) {
//     const { GameBoard } = require("./gamestate");
// }

const Color = {
    BLACK: 'BLACK',
    WHITE: 'WHITE'
}

const PlayerType = Color;

const PieceType = {
    PAWN: 'PAWN',
    KING: 'KING',
    QUEEN: 'QUEEN',
    BISHOP: 'BISHOP',
    KNIGHT: 'KNIGHT',
    ROOK: 'ROOK'
}

class Position {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setZ(z) {
        this.z = z;
    }

    equals(p) {
        return this.x == p.x && this.y == p.y && this.z == p.z;
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

    static fromObj(obj) {
        return new Position(obj.x, obj.y, obj.z);
    }

    /**
     * Turns normal file/level coordinates into position coords
     * 
     * @param {number} file 
     * @param {number} level 
     * @returns 
     */
    static fromHexCoords(file, level) {
        let x = level - 5;
        let y = file > 5 ? file - 5 : 0;
        let z = file < 5 ? 5 - file : 0;

        return new Position(x, y, z);
    }
}


class PositionChecker {
    constructor() {}

    /**
     * Checks if the provided position is actually on the board
     * 
     * @param {Position} position 
     * @returns {boolean} 
     */
    static isPositionOnBoard(position) {
        return true;
    }

    /**
     * Simple function that checks if the piece at the given position on board is the
     * same color as the expected color
     * 
     * @param {Position} position 
     * @param {GameBoard} board 
     * @param {string} expectedColor 
     * @returns {boolean}
     */
    static sameColor(position, board, expectedColor) {
        return board.getPieceAtPosition(position)[1] == expectedColor;
    }

    /**
     * This method checks if a move from p1 to p2 is valid.
     *
     * @param {Position} p1
     * @param {Position} p2
     * @param {GameBoard} board
     */
    static checkPosition(p1, p2, board) { // board.getPieceAtPosition(Position) -> {PieceType, color} | null
        let pieceStartingPosition = board.getPieceAtPosition(p1);
        let pieceEndingPosition = board.getPieceAtPosition(p2);

        // returns false if the piece is capturing a piece of its own colour
        if (pieceEndingPosition != null && pieceStartingPosition!=null && pieceStartingPosition[1] == pieceEndingPosition[1]) {
            return false;
        }

        if(pieceStartingPosition==null){
            return false;
        }

        // creates a vector representing the wanted movement of the piece
        let vector = new Position(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);

        // simplifies this vector as much as possible
        //while((vector.y < 0 && vector.z < 0)||(vector.x < 0 && vector.z > 0)||(vector.x > 0 && vector.y < 0) || (vector.x > 0 && vector.z < 0)||(vector.y > 0 && vector.z > 0)||(vector.x < 0 && vector.y > 0)){
            while (vector.x > 0 && vector.y < 0) {
                vector.x --;
                vector.y ++;
                vector.z ++;
            }
            while (vector.x < 0 && vector.y > 0) {
                vector.x ++;
                vector.y --;
                vector.z --;
            }
            while (vector.x > 0 && vector.z < 0) {
                vector.x --;
                vector.z ++;
                vector.y ++;
            }
            while (vector.x < 0 && vector.z > 0) {
                vector.x ++;
                vector.z --;
                vector.y --;
            }
            while (vector.y > 0 && vector.z > 0) {
                vector.z --;
                vector.y --;
                vector.x ++;
            }
            while (vector.y < 0 && vector.z < 0) {
                vector.z ++;
                vector.y ++;
                vector.x --;
            }
        

        // returns false if the piece doesn't actually move
        if (vector.x == 0 && vector.y == 0 && vector.z == 0) {
            return false;
        }

        // switch statement depending on the type of the piece
        switch (pieceStartingPosition[0]) {
            case PieceType.KING:
                if (Math.abs(vector.x) < 2 && Math.abs(vector.y) < 2 && Math.abs(vector.z) < 2) {
                    return true;
                }
                break;

            case PieceType.KNIGHT:
                if (vector.x == 2) {
                    if ((vector.y == 1 && vector.z == 0) || (vector.z == 1 && vector.y == 0)) {
                        return true;
                    }
                }
                if (vector.x == -2) {
                    if ((vector.y == -1 && vector.z == 0) || (vector.z == -1 && vector.y == 0)) {
                        return true;
                    }
                }
                if (vector.y == 2) {
                    if ((vector.x == 1 && vector.z == 0) || (vector.z == -1 && vector.x == 0)) {
                        return true;
                    }
                }
                if (vector.y == -2) {
                    if ((vector.x == -1 && vector.z == 0) || (vector.z == 1 && vector.x == 0)) {
                        return true;
                    }
                }
                if (vector.z == 2) {
                    if ((vector.y == -1 && vector.x == 0) || (vector.x == 1 && vector.y == 0)) {
                        return true;
                    }
                }
                if (vector.z == -2) {
                    if ((vector.y == 1 && vector.x == 0) || (vector.x == -1 && vector.y == 0)) {
                        return true;
                    }
                }
                break;
            case PieceType.PAWN:
                if (pieceStartingPosition[1] == Color.WHITE) {
                    if (vector.x == 1 && vector.y == 0 && vector.z == 0) {
                        if (pieceEndingPosition == null) {
                            return true;
                        }
                    }
                    if (vector.x == 2 && vector.y == 0 && vector.z == 0) {
                        if (pieceEndingPosition == null) {
                            if (PositionChecker.otherPieceGetter(p2.x - 1, p2.y, p2.z, board) == null) {
                                for(var i=1;i<6;i++){
                                    if(p1.x==-i){
                                        if((p1.y==i-1&&p1.z==0)||(p1.z==i-1&&p1.y==0)){
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (vector.x == 0 && ((vector.y == 0 && vector.z == 1) || (vector.z == 0 && vector.y == 1))) {
                        if (pieceEndingPosition != null) {
                            return true;
                        }
                    }
                }
                if (pieceStartingPosition[1] == Color.BLACK) {
                    if (vector.x == -1 && vector.y == 0 && vector.z == 0) {
                        if (pieceEndingPosition == null) {
                            return true;
                        }
                    }
                    if (vector.x == -2 && vector.y == 0 && vector.z == 0) {
                        if (pieceEndingPosition == null) {
                            if (PositionChecker.otherPieceGetter(p2.x + 1, p2.y, p2.z, board) == null) {
                                if (p1.x == 1) { // !!careful implementation
                                    return true;
                                }
                            }
                        }
                    }
                    if (vector.x == 0 && ((vector.y == 0 && vector.z == -1) || (vector.z == 0 && vector.y == -1))) {
                        if (pieceEndingPosition != null) {
                            return true;
                        }
                    }
                }
                break;
            case PieceType.BISHOP:
                if (vector.x == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.y)-1; i++) {
                            if (PositionChecker.otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.y == 0) {
                    if (Math.abs(vector.x) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.x)-1; i++) {
                            if (PositionChecker.otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }

                }
                if (vector.z == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.x)) {
                        for (var i = 1; i <= Math.abs(vector.y)-1; i++) {
                            if (PositionChecker.otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                break;

            case PieceType.ROOK:
                if (vector.x == 0 && vector.y == 0) {
                    for (var i = 1; i <= Math.abs(vector.z)-1; i++) {
                        if (PositionChecker.otherPieceGetter(p1.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.x == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.y)-1; i++) {
                        if (PositionChecker.otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.y == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.x)-1; i++) {
                        if (PositionChecker.otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                break;
            case PieceType.QUEEN:
                if (vector.x == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.y)-1; i++) {
                            if (PositionChecker.otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.y == 0) {
                    if (Math.abs(vector.x) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.x)-1; i++) {
                            if (PositionChecker.otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }

                }
                if (vector.z == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.x)) {
                        for (var i = 1; i <= Math.abs(vector.y)-1; i++) {
                            if (PositionChecker.otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.x == 0 && vector.y == 0) {
                    for (var i = 1; i <= Math.abs(vector.z)-1; i++) {
                        if (PositionChecker.otherPieceGetter(p1.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.x == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.y)-1; i++) {
                        if (PositionChecker.otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.y == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.x)-1; i++) {
                        if (PositionChecker.otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                break;
        }
        return false;
    }
    static otherPieceGetter(x, y, z, board) {
        let position = new Position(x, y, z);
        return board.getPieceAtPosition(position);
    }

    static isKingChecked(color, board){
		let kingCoord = board.getKingCoordinates(color);

		if(kingCoord == null) return false;

		console.log(kingCoord);

        let king = Position.fromHexCoords(kingCoord.file, kingCoord.level);
		let allPositions = PositionChecker.getAllPositions();
		console.log(king);

		let isChecked = false;

		allPositions.forEach(function(p) {
			let currPiece = board.getPieceAtPosition(p);

			if(currPiece != null && currPiece[1] != color && PositionChecker.checkPosition(p,king,board)) {
				isChecked = true;
				return;
			}
		});

        return isChecked;
    }

    static isKingCheckMated(color,GameState){
        board=GameState.GameBoard;
        if(!PositionChecker.isKingChecked(color,board))return false;
		let allPositions = PositionChecker.getAllPositions();
        checkCanBeCountered=false;
        allPositions.forEach(function(e){
            if(e.getPieceAtPosition()!=null&&e.getPieceAtPosition()[1]==color){
                allPositions.forEach(function(f){
                    simulation=GameState.copyGameState();
                    if(PositionChecker.checkPosition(e, f, simulation.GameBoard)){
                        simulation.performMove(e, f);
                        if(!PositionChecker.isKingChecked(color, simulation.GameBoard)){
                            checkCanBeCountered=true;
                        }

                    }
                })
            }
        })
        return !checkCanBeCountered;

    }

	/**
	 * Function that checks if the match is in a stalemate for the selected color
	 * 
	 * @param {string} color 
	 * @param {GameBoard} board 
	 * @returns {boolean}
	 */
    static isStaleMate(color,board){
		let allPositions = PositionChecker.getAllPositions();
		
		let isStaleMate = true;

		allPositions.forEach(function(startPos) {
			if(board.getPieceAtPosition(startPos) != null && board.getPieceAtPosition(startPos)[1] == color) {
				allPositions.forEach(function(endPos) {
					if(PositionChecker.checkPosition(startPos, endPos, board)){
						isStaleMate = false;
						return;
					}
				});
			}
			if(!isStaleMate) return;
		});

        return isStaleMate;
    }


	/**
	* Functions that returns an array of all valid positions on the board
	* 
	* @returns {Array} all the positions
	*/
   	static getAllPositions() {
	   let arr = [];

	   for(let i = 0; i < 11; i++) { // level
		   for(let j = Math.max(0, i - 5); j < Math.min(11, 16- i); j++) { // file
			   arr.push(Position.fromHexCoords(j, i));
		   }
	   }

	   return arr;
   }
}
if (module) {
    module.exports.Color = Color;
    module.exports.PieceType = PieceType;
    module.exports.PlayerType = PlayerType;
    module.exports.Position = Position;
    module.exports.PositionChecker = PositionChecker;
}

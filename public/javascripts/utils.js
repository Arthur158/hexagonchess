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
        if (pieceEndingPosition != null && pieceStartingPosition[1] == pieceEndingPosition[1]) {
            return false;
        }

        // creates a vector representing the wanted movement of the piece
        let vector = new Position(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);

        // simplifies this vector as much as possible
        while (vector.x > 0 && vector.y < 0) {
            vector.x --;
            vector.y ++;
            vector.z ++;
        }
        while (vector.x > 0 && vector.z < 0) {
            vector.x --;
            vector.z ++;
            vector.y ++;
        }
        while (vector.y > 0 && vector.z > 0) {
            vector.z --;
            vector.y --;
            vector.x ++;
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
                    if ((vector.x == 1 && vector.z == 0) || (vector.z == 1 && vector.x == 0)) {
                        return true;
                    }
                }
                if (vector.y == -2) {
                    if ((vector.x == -1 && vector.z == 0) || (vector.z == -1 && vector.x == 0)) {
                        return true;
                    }
                }
                if (vector.z == 2) {
                    if ((vector.y == 1 && vector.x == 0) || (vector.x == 1 && vector.y == 0)) {
                        return true;
                    }
                }
                if (vector.z == -2) {
                    if ((vector.y == -1 && vector.x == 0) || (vector.x == -1 && vector.y == 0)) {
                        return true;
                    }
                }
            case PieceType.PAWN:
                if (pieceStartingPosition[1] == Color.WHITE) {
                    if (vector.x == 1 && vector.y == 0 && vector.z == 0) {
                        if (pieceEndingPosition == null) {
                            return true;
                        }
                    }
                    if (vector.x == 2 && vector.y == 0 && vector.z == 0) {
                        if (pieceEndingPosition == null) {
                            if (otherPieceGetter(p2.x - 1, p2.y, p2.z, board) == null) {
                                if (p1.x == -1) { // !!careful implementation
                                    return true;
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
                            if (otherPieceGetter(p2.x + 1, p2.y, p2.z, board) == null) {
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
            case PieceType.BISHOP:
                if (vector.x == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.y == 0) {
                    if (Math.abs(vector.x) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.x); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }

                }
                if (vector.z == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.x)) {
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }

            case PieceType.ROOK:
                if (vector.x == 0 && vector.y == 0) {
                    for (var i = 1; i <= Math.abs(vector.z); i++) {
                        if (otherPieceGetter(p1.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.x == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.y); i++) {
                        if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.y == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.x); i++) {
                        if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
            case PieceType.QUEEN:
                if (vector.x == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.y == 0) {
                    if (Math.abs(vector.x) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.x); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }

                }
                if (vector.z == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.x)) {
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.x == 0 && vector.y == 0) {
                    for (var i = 1; i <= Math.abs(vector.z); i++) {
                        if (otherPieceGetter(p1.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.x == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.y); i++) {
                        if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.y == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.x); i++) {
                        if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z, board) != null) {
                            return false;
                        }
                    }
                    return true;
                }
        }
        return false;
    }
}


function otherPieceGetter(x, y, z, board) {
    let position = new Position(x, y, z);
    return board.getPieceAtPosition(position);
}

if (module) {
    module.exports.Color = Color;
    module.exports.PieceType = PieceType;
    module.exports.PlayerType = PlayerType;
    module.exports.Position = Position;
    module.exports.PositionChecker = PositionChecker;
}

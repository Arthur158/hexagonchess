const Color = {
    BLACK: 'BLACK',
    WHITE: 'WHITE'
}

const PieceType = {
    PAWN: 'PAWN',
    KING: 'KING',
    QUEEN: 'QUEEN',
    BISHOP: 'BISHOP',
    KNIGHT: 'KNIGHT',
    ROOK: 'ROOK'
}

class Position {
    /**
     * Normal constructor. Takes in 3 numbers
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Constructor that takes a object as parameter
     * 
     * @param {object} obj 
     */
    constructor(obj) {
        this.x = obj.x;
        this.y = obj.y;
        this.z = obj.z;
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
}


class PositionChecker {
    constructor() {}

    /**
     * Checks if the position is on the field
     * 
     * @param {Position} p 
     * @returns {boolean} if p is on the field
     */
    isPositionOnTheField(p) {
        //TODO
    }

    /**
     * This method checks if a move from p1 to p2 is valid.
     *
     * @param {Position} p1
     * @param {Position} p2
     * @param {PieceType} pieceType
     * @param {Color} color
     */
    checkPosition(p1, p2, board, pieceType, color) {
        let pieceStartingPosition = board.getPieceAtPosition(p1);
        let pieceEndingPosition = board.getPieceAtPosition(p2);

        // returns false if the piece is capturing a piece of its own colour
        if (p2 != null && p1[1] == p2[1]) {
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
        switch (pieceStartingPOsition[0]) {
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
                            if (otherPieceGetter(p2.x - 1, p2.y, p2.z) == null) {
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
                            if (otherPieceGetter(p2.x + 1, p2.y, p2.z) == null) {
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
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z + i * Math.abs(vector.z) / vector.z) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.y == 0) {
                    if (Math.abs(vector.x) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.x); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z) != null) {
                                return false;
                            }
                        }
                        return true;
                    }

                }
                if (vector.z == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.x)) {
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                break;

            case PieceType.ROOK:
                if (vector.x == 0 && vector.y == 0) {
                    for (var i = 1; i <= Math.abs(vector.z); i++) {
                        if (otherPieceGetter(p1.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.x == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.y); i++) {
                        if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.y == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.x); i++) {
                        if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                break;

            case PieceType.QUEEN:
                if (vector.x == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z + i * Math.abs(vector.z) / vector.z) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.y == 0) {
                    if (Math.abs(vector.x) == Math.abs(vector.z)) {
                        for (var i = 1; i <= Math.abs(vector.x); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z) != null) {
                                return false;
                            }
                        }
                        return true;
                    }

                }
                if (vector.z == 0) {
                    if (Math.abs(vector.y) == Math.abs(vector.x)) {
                        for (var i = 1; i <= Math.abs(vector.y); i++) {
                            if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z) != null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (vector.x == 0 && vector.y == 0) {
                    for (var i = 1; i <= Math.abs(vector.z); i++) {
                        if (otherPieceGetter(p1.x, p1.y, p1.z + i * Math.abs(vector.z) / vector.z) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.x == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.y); i++) {
                        if (otherPieceGetter(p1.x, p1.y + i * Math.abs(vector.y) / vector.y, p1.z) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                if (vector.y == 0 && vector.z == 0) {
                    for (var i = 1; i <= Math.abs(vector.x); i++) {
                        if (otherPieceGetter(p1.x + i * Math.abs(vector.x) / vector.x, p1.y, p1.z) != null) {
                            return false;
                        }
                    }
                    return true;
                }
                break;
        }
    }
}


function otherPieceGetter(x, y, z) {
    let position = new Position(x, y, z);
    return getPieceAtPosition(position);
}

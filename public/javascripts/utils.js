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

function Position(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;   
}

Position.prototype.setX = function(x) {
    this.x = x;
}

Position.prototype.setY = function(y) {
    this.y = y;
}

Position.prototype.setZ = function(z) {
    this.z = z;
}

function PositionChecker() {

}

/**
 * This method checks if a move from p1 to p2 is valid.
 * 
 * @param {Position} p1 
 * @param {Position} p2 
 * @param {PieceType} pieceType 
 * @param {Color} color 
 */
PositionChecker.prototype.checkPosition = function(p1, p2, board, pieceType, color) {
    // board.getPieceAtPosition(Position) -> {PieceType, color} | null
}
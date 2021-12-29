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
    let pieceStartingPosition=board.getPieceAtPosition(p1);
    let pieceEndingPosition=board.getPieceAtPosition(p2);

    let vector=new Position(p2.x-p1.x,p2.y-p1.y,p2.z-p1.z);

    while(vector.x > 0 && vector.y < 0){
        vector.x--;
        vector.y++;
        vector.z++;
    }
    while(vector.x > 0 && vector.z < 0){
        vector.x--;
        vector.z++;
        vector.y++;
    }
    while(vector.y > 0 && vector.z > 0){
        vector.z--;
        vector.y--;
        vector.x++;
    } 

    if(vector.x==0 && vector.y==0 &&vector.z==0){
        return false;
    }

    switch(pieceStartingPOsition[0]){
        case PieceType.KING:
            if(Math.abs(vector.x)<2 && Math.abs(vector.y)<2 && Math.abs(vector.z)<2){
                if(){
                    
                }
            } 
        case  PieceType.KNIGHT:

    }
}

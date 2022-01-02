// @ts-nocheck

if(module) {
    const GameBoard = require("./gameboard.js");
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
        //TODO
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

if(module) module.exports = GameState;  
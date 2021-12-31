// @ts-nocheck

if(module) {
    const GameBoard = require("./gameboard");
}

/**
 * Class that contains the state of the game, including the board, the timers and the turn
 */
class GameState {
    constructor(){
        this.gameBoard = new GameBoard();
        this.whiteTimer = 0;
        this.blackTimer = 0;
        this.turn = 0;
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
}

if(module) module.exports = GameState;  
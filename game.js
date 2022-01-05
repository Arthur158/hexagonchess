//@ts-check

const websocket = require("ws");
const { GameState } = require("./public/javascripts/gamestate");
const { PlayerType } = require("./public/javascripts/utils");

/**
 * Game constructor. Every game has two players, identified by their WebSocket.
 * @param {number} gameID every game has a unique game identifier.
 */
class game {
    constructor(gameID) {
        this.playerWhite = null;
        this.playerBlack = null;
        this.id = gameID;
        this.gameData = new GameState();
        this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
    }
    /**
     * Determines whether the transition from state `from` to `to` is valid.
     * @param {string} from starting transition state
     * @param {string} to ending transition state
     * @returns {boolean} true if the transition is valid, false otherwise
     */
    isValidTransition(from, to) {
        let i, j;
        if (!(from in game.prototype.transitionStates)) {
            return false;
        } else {
            i = game.prototype.transitionStates[from];
        }

        if (!(to in game.prototype.transitionStates)) {
            return false;
        } else {
            j = game.prototype.transitionStates[to];
        }

        return game.prototype.transitionMatrix[i][j] > 0;
    }
    /**
     * Determines whether the state `s` is valid.
     * @param {string} s state to check
     * @returns {boolean}
     */
    isValidState(s) {
        return s in game.prototype.transitionStates;
    }
    /**
     * Updates the game status to `w` if the state is valid and the transition to `w` is valid.
     * @param {string} w new game status
     */
    setStatus(w) {
        if (game.prototype.isValidState(w) &&
            game.prototype.isValidTransition(this.gameState, w)) {
            this.gameState = w;
            console.log("[GAME " + this.id + "][STATUS] %s", this.gameState);
        } else {
            return new Error(
                `Impossible status change from ${this.gameState} to ${w}`
            );
        }
    }
    /**
     * Checks whether the game is full.
     * @returns {boolean} returns true if the game is full (2 players), false otherwise
     */
    hasTwoConnectedPlayers() {
        return this.gameState == "2 JOINT";
    }
    /**
     * Adds a player to the game. Returns an error if a player cannot be added to the current game.
     * @param {websocket} p WebSocket object of the player
     * @returns {(string|Error)} returns "WHITE" or "BLACK" depending on the player added; returns an error if that isn't possible
     */
    addPlayer(p) {
        if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
            return new Error(
                `Invalid call to addPlayer, current state is ${this.gameState}`
            );
        }

        const error = this.setStatus("1 JOINT");
        if (error instanceof Error) {
            this.setStatus("2 JOINT");
        }

        if (this.playerWhite == null) {
            this.playerWhite = p;
            return PlayerType.WHITE;
        } else {
            this.playerBlack = p;
            return PlayerType.BLACK;
        }
    }
}

/*
 * All valid transition states are keys of the transitionStates object.
 */
game.prototype.transitionStates = { 
  "0 JOINT": 0, 
  "1 JOINT": 1, 
  "2 JOINT": 2,
  "WHITE MOVES": 3,
  "BLACK MOVES": 4,
  "WHITE": 5, //WHITE won
  "BLACK": 6, //BLACK won
  "ABORTED": 7
};

/*
 * Not all game states can be transformed into each other; the transitionMatrix object encodes the valid transitions.
 * Valid transitions have a value of 1. Invalid transitions have a value of 0.
 */
game.prototype.transitionMatrix = [
  [0, 1, 0, 0, 0, 0, 0, 0], //0 JOINT
  [1, 0, 1, 0, 0, 0, 0, 0], //1 JOINT
  [0, 0, 0, 1, 0, 0, 0, 1], //2 JOINT (note: once we have two players, there is no way back!)
  [0, 0, 0, 0, 1, 1, 0, 1], //WHITE MOVES
  [0, 0, 0, 1, 0, 0, 1, 1], //BLACK MOVES
  [0, 0, 0, 0, 0, 0, 0, 0], //WHITE WON
  [0, 0, 0, 0, 0, 0, 0, 0], //BLACK WON
  [0, 0, 0, 0, 0, 0, 0, 0] //ABORTED
];

module.exports = game;

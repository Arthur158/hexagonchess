//@ts-check

const websocket = require("ws");
const { GameState } = require("./public/javascripts/gamestate");
const { PlayerType } = require("./public/javascripts/utils");
const messages = require("./public/javascripts/messages");
const gameStatus = require("./statTracker");

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

    /**
     * Starts checking if there are players who lost because their time was depleted
     * 
     * @param {Function} hook routine to call when a timer expires. takes as parameter the expired timer
     */
     startTimeChecker(hook) {
        let ref = this;

        let intv = setInterval(function() {
            if(ref == null || ref.playerWhite == null || ref.playerBlack == null) {
                clearInterval(intv);
                return;
            }
    
            ref.gameData.updateTimer(ref.gameData.getCurrentPlayer());
            let expiredTimer = ref.gameData.getExpiredTimer();
    
            if(expiredTimer != null) {
                hook(ref, expiredTimer);
        
                clearInterval(intv);
            }
        }, 500);
    }

    /**
     * Announce the players of the ending of the game and the winner
     * 
     * @param {string} color 
     */
    sendWinMessage(color) {
        let finalMsg = messages.O_GAME_OVER;
        finalMsg.data = color;

        if(this.playerWhite != null && this.playerWhite.readyState === 1) this.playerWhite.send(JSON.stringify(finalMsg));
        if(this.playerBlack != null && this.playerBlack.readyState === 1) this.playerBlack.send(JSON.stringify(finalMsg));

        this.setStatus(finalMsg.data);

        gameStatus.gamesCompleted++;
        
        color == PlayerType.WHITE ? gameStatus.whiteWins++ : gameStatus.blackWins++;
        this.sendUpdateMessage();

        this.closeConnections();
    }

    /**
     * Sends a stalemate message to both players
     */
    sendStalemateMessage() {
        if(this.playerWhite != null && this.playerWhite.readyState === 1) this.playerWhite.send(messages.S_STALEMATE);
        if(this.playerBlack != null && this.playerBlack.readyState === 1) this.playerBlack.send(messages.S_STALEMATE);

        this.setStatus("STALEMATE");

        this.closeConnections();
    }

    /**
     * Send a game update to both players
     */
    sendUpdateMessage() {
        let update = messages.O_GAME_DATA;
        update.data = JSON.stringify(this.gameData);

        if(this.playerWhite != null && this.playerWhite.readyState === 1) this.playerWhite.send(JSON.stringify(update));
        if(this.playerBlack != null && this.playerBlack.readyState === 1) this.playerBlack.send(JSON.stringify(update));
    }

    closeConnections() {
        try {
            this.playerWhite.close();
            this.playerWhite = null;
        } catch (e) {
            console.log("Closing");
        }

        try {
            this.playerBlack.close();
            this.playerBlack = null;
        } catch (e) {
            console.log("Closing");
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
  "ABORTED": 7,
  "STALEMATE": 8 //stalemate
};

/*
 * Not all game states can be transformed into each other; the transitionMatrix object encodes the valid transitions.
 * Valid transitions have a value of 1. Invalid transitions have a value of 0.
 */
game.prototype.transitionMatrix = [
  [0, 1, 0, 0, 0, 0, 0, 0, 0], //0 JOINT
  [1, 0, 1, 0, 0, 0, 0, 0, 0], //1 JOINT
  [0, 0, 0, 1, 0, 0, 0, 1, 0], //2 JOINT (note: once we have two players, there is no way back!)
  [0, 0, 0, 0, 1, 1, 0, 1, 1], //WHITE MOVES
  [0, 0, 0, 1, 0, 0, 1, 1, 1], //BLACK MOVES
  [0, 0, 0, 0, 0, 0, 0, 0, 0], //WHITE WON
  [0, 0, 0, 0, 0, 0, 0, 0, 0], //BLACK WON
  [0, 0, 0, 0, 0, 0, 0, 0, 0], //ABORTED
  [0, 0, 0, 0, 0, 0, 0, 0, 0]  //STALEMATE
];

module.exports = game;

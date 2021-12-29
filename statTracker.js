//@ts-check

/**
 * In-game stat tracker. 
 * Once the game is out of prototype status, this object will be backed by a database.
 */
const gameStatus = {
  since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
  gamesInitialized: 0 /* number of games initialized */,
  gamesAborted: 0 /* number of games aborted */,
  gamesCompleted: 0 /* number of games successfully completed */,
  whiteWins: 0 /* total number of completed games won by white, for calculating the white:black ratio */,
  blackWins: 0 /* total number of completed games won by black, for calculating the white:black ratio */,
  onlinePlayers: 0 /* number of online players */
};

module.exports = gameStatus;

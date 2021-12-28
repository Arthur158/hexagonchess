// @ts-nocheck

(function (exports) {
  /*
   * Server to client: abort game (e.g. if second player exited the game)
   */
  exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED",
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

  /*
   * Server to client: set as player WHITE
   */
  exports.T_PLAYER_COLOR = "PLAYER-TYPE";
  exports.O_PLAYER_WHITE = {
    type: exports.T_PLAYER_COLOR,
    data: "WHITE",
  };
  exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

  /*
   * Server to client: set as player BLACK
   */
  exports.O_PLAYER_BLACK = {
    type: exports.T_PLAYER_COLOR,
    data: "BLACK",
  };
  exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);

  /*
   * BLACK or WHITE to server or server to BLACK or WHITE
   */
  exports.T_MAKE_A_MOVE = "MAKE-A-MOVE";
  exports.O_MAKE_A_MOVE = {
    type: exports.T_MAKE_A_MOVE,
    data: null,
  };
  //exports.S_MAKE_A_MOVE does not exist, as data needs to be set

  /*
   * server to BLACK or WHITE
   */
  exports.T_ILLEGAL_MOVE = "ILLEGAL-MOVE-MADE";
  exports.O_ILLEGAL_MOVE = {
    type: exports.T_ILLEGAL_MOVE,
    data: null,
  }
  //exports.S_ILLEGAL_MOVE does not exist, as data neets to be set

  exports.T_REGISTERED_MOVE = "REGISTERED-MOVE";
  exports.O_REGISTERED_MOVE = {
    type: exports.T_REGISTERED_MOVE
  }
  exports.S_REGISTERED_MOVE = JSON.stringify(exports.O_REGISTERED_MOVE);

  /*
   * Server to Player A & B: game over with result won/loss
   */
  exports.T_GAME_OVER = "GAME-OVER";
  exports.O_GAME_OVER = {
    type: exports.T_GAME_OVER,
    data: null,
  };
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server

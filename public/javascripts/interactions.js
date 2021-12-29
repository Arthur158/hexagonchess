/* eslint-disable no-undef */
//@ts-nocheck

const clickSound = new Audio("../data/click.wav");

/**
 * GameHandler object
 * 
 * @param {VisibleGameBoard} hexagonalBoard 
 * @param {TimerBar} timerBar 
 * @param {StatusBar} statusBar 
 * @param {*} currentTurn 
 * @param {WebSocket} socket 
 */
function GameHandler(initialGameState, hexagonalBoard, timerBar, statusBar, currentTurn, socket) {
  this.playerType = null;
  this.gameState = initialGameState;
  this.visibleGameBoard = hexagonalBoard;
  this.timerBar = timerBar;
  this.statusBar = statusBar;
  this.socket = socket;
}

/**
 * Initializes the board with starting positions.
 */
GameHandler.prototype.initializeBoard = function () {
  this.visibleGameBoard.initializeStartingPositions();
};

/**
 * Retrieve the player type.
 * @returns {PlayerType} player type
 */
GameHandler.prototype.getPlayerType = function () {
  return this.playerType;
};

/**
 * Set the player type.
 * @param {PlayerType} p player type to set
 */
GameHandler.prototype.setPlayerType = function (p) {
  this.playerType = p;
};

/**
 * Returns the player type based on current turn
 * 
 * @returns {PlayerType} player type
 */
GameHandler.prototype.getTurnPlayerType = function() {
  return this.gameState.turn % 2 == 0 ? PlayerType.WHITE : PlayerType.BLACK;
}

/**
 * Update the game state given the cell that was just clicked.
 * @param {Position} p1
 */
GameHandler.prototype.updateGame = function (p1) {

  // TODO

  // const res = this.alphabet.getLetterInWordIndices(
  //   clickedLetter,
  //   this.targetWord
  // );

  // //wrong guess
  // if (res.length == 0) {
  //   this.incrWrongGuess();
  // } else {
  //   this.revealLetters(clickedLetter, res);
  // }

  // this.alphabet.makeLetterUnAvailable(clickedLetter);
  // this.visibleWordBoard.setWord(this.visibleWordArray);

  // const outgoingMsg = Messages.O_MAKE_A_GUESS;
  // outgoingMsg.data = clickedLetter;
  // this.socket.send(JSON.stringify(outgoingMsg));

  // //is the game complete?
  // const winner = this.whoWon();

  // if (winner != null) {
  //   this.revealAll();

  //   /* disable further clicks by cloning each alphabet
  //    * letter and not adding an event listener; then
  //    * replace the original node through some DOM logic
  //    */
  //   const elements = document.querySelectorAll(".letter");
  //   Array.from(elements).forEach(function (el) {
  //     // @ts-ignore
  //     el.style.pointerEvents = "none";
  //   });

  //   let alertString;
  //   if (winner == this.playerType) {
  //     alertString = Status["gameWon"];
  //   } else {
  //     alertString = Status["gameLost"];
  //   }
  //   alertString += Status["playAgain"];
  //   this.statusBar.setStatus(alertString);

  //   //player B sends final message
  //   if (this.playerType == "B") {
  //     let finalMsg = Messages.O_GAME_WON_BY;
  //     finalMsg.data = winner;
  //     this.socket.send(JSON.stringify(finalMsg));
  //   }
  //   this.socket.close();
  // }
};

/**
 * Initialize the hexagonal board.
 * @param {GameHandler} gs
 */
function initializeGameBoard (gs) {
  //only initialize for player that should actually be able to use the board
  this.initialize = function () {
    const elements = document.querySelectorAll(".cell");
    Array.from(elements).forEach(function (el) {
      el.addEventListener("click", function singleClick(e) {
        const clickedCell = e.target["id"];
        clickSound.play();

        // FIX WITH A PARSE METHOD IN Position
        let clickedPosition = JSON.parse(e.target["title"]);

        gs.updateGame(clickedPosition);
      });
    });
  };
}

/**
 * Add a piece type (or remove one) at the respective position
 * 
 * @param {Position|null} position 
 * @param {PieceType} pieceType 
 */
function addPieceToCell(position, pieceType) {
  const elements = document.querySelectorAll(".cell");
  Array.from(elements).forEach(function (el) {
    if(el.title === JSON.stringify(position)) {

      el.className = "cell";

      if(pieceType != null) {
        el.className += " " + pieceType.toLowerCase();
      }
    }
  });
}

/**
 * Get the piece type from the position
 * 
 * @param {Position} position 
 * @returns {PieceType|null} the piece on that position
 */
function getPieceFromCell(position) {
  const elements = document.querySelectorAll(".cell");
  let pieceType = null;
  Array.from(elements).forEach(function (el) {
    if(el.title === JSON.stringify(position)) {
      pieceType = el.className.replace("cell ", "").toUpperCase();
    }
  });

  return pieceType === "" ? null : PieceType[pieceType];
}

//set everything up, including the WebSocket
(function setup() {
  const socket = new WebSocket(Setup.WEB_SOCKET_URL);

  /*
   * initialize all UI elements of the game:
   * - visible word board (i.e. place where the hidden/unhidden word is shown)
   * - status bar
   * - alphabet board
   *
   * the GameHandler object coordinates everything
   */

  // @ts-ignore
  const vw = new VisibleWordBoard();
  // @ts-ignore
  const sb = new StatusBar();

  //no object, just a function
  // @ts-ignore
  createBalloons();

  const gs = new GameHandler(vw, sb, socket);
  const ab = new AlphabetBoard(gs);

  socket.onmessage = function (event) {
    let incomingMsg = JSON.parse(event.data);

    //set player type
    if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
      gs.setPlayerType(incomingMsg.data); //should be "A" or "B"

      //if player type is A, (1) pick a word, and (2) sent it to the server
      if (gs.getPlayerType() == "A") {
        disableAlphabetButtons();

        sb.setStatus(Status["player1Intro"]);
        let validWord = -1;
        let promptString = Status["prompt"];
        let res = null;

        while (validWord < 0) {
          res = prompt(promptString);

          if (res == null) {
            promptString = Status["prompt"];
          } else {
            res = res.toUpperCase(); //game is played with uppercase letters

            if (
              res.length < Setup.MIN_WORD_LENGTH ||
              res.length > Setup.MAX_WORD_LENGTH
            ) {
              promptString = Status["promptAgainLength"];
            } else if (/^[a-zA-Z]+$/.test(res) == false) {
              promptString = Status["promptChars"];
            }
            //dictionary has only lowercase entries
            //TODO: convert the dictionary to uppercase to avoid this extra string conversion cost
            else if (
              Object.prototype.hasOwnProperty.call(
                // @ts-ignore
                englishDict,
                res.toLocaleLowerCase()
              ) == false
            ) {
              promptString = Status["promptEnglish"];
            } else {
              validWord = 1;
            }
          }
        }
        sb.setStatus(Status["chosen"] + res);
        gs.setTargetWord(res);
        gs.initializeVisibleWordArray(); // initialize the word array, now that we have the word
        vw.setWord(gs.getVisibleWordArray());

        let outgoingMsg = Messages.O_TARGET_WORD;
        outgoingMsg.data = res;
        socket.send(JSON.stringify(outgoingMsg));
      } else {
        sb.setStatus(Status["player2IntroNoTargetYet"]);
      }
    }

    //Player B: wait for target word and then start guessing ...
    if (
      incomingMsg.type == Messages.T_TARGET_WORD &&
      gs.getPlayerType() == "B"
    ) {
      gs.setTargetWord(incomingMsg.data);

      sb.setStatus(Status["player2Intro"]);
      gs.initializeVisibleWordArray(); // initialize the word array, now that we have the word
      ab.initialize();
      vw.setWord(gs.getVisibleWordArray());
    }

    //Player A: wait for guesses and update the board ...
    if (
      incomingMsg.type == Messages.T_MAKE_A_GUESS &&
      gs.getPlayerType() == "A"
    ) {
      sb.setStatus(Status["guessed"] + incomingMsg.data);
      gs.updateGame(incomingMsg.data);
    }
  };

  socket.onopen = function () {
    socket.send("{}");
  };

  //server sends a close event only if the game was aborted from some side
  socket.onclose = function () {
    if (gs.whoWon() == null) {
      sb.setStatus(Status["aborted"]);
    }
  };

  socket.onerror = function () {};
})(); //execute immediately

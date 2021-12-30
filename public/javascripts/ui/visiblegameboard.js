//@ts-check
/**
 * This takes care of the actual visible elements and their actions
 */
function VisibleGameBoard() {
    this.gameHandler = null;
    
    let elements = document.querySelectorAll(".cell");
    this.cells = Array.from(elements);
}

/**
 * Initializes the cells with the click events and also puts the pieces in the right spot
 * 
 * @param {GameHandler} gameHandler 
 */
VisibleGameBoard.prototype.initialize = function(gameHandler) {
    this.initializeCells(gameHandler);
    this.initializeStartingPosition();
}

/**
 * Initializes the cells with the right click events
 * 
 * @param {GameHandler} gameHandler 
 */
VisibleGameBoard.prototype.initializeCells = function(gameHandler) {
    this.cells.forEach(function (el) {
        el.addEventListener("click", function singleClick(e) {
            // const clickedCell = e.target["id"];
            // clickSound.play();

            // // FIX WITH A PARSE METHOD IN Position
            let clickedPosition = JSON.parse(e.target["title"]);

            gameHandler.updateGame(clickedPosition);
        });
    });
}

/**
 * Initializes the cells with the right pieces on the starting position (debatable if it is needed)
 */
VisibleGameBoard.prototype.initializeStartingPosition = function() {
    //TODO
}

/**
 * Add a piece type (or remove one) at the respective position
 * 
 * @param {Position|null} position 
 * @param {string} pieceType 
 * @param {string} color
 */
VisibleGameBoard.prototype.addPieceToCell = function(position, pieceType, color) {
    const elements = document.querySelectorAll(".cell");
    Array.from(elements).forEach(function (el) {
      if(el.getAttribute("title") === JSON.stringify(position)) {
  
        el.className = "cell";
  
        if(pieceType != null) {
            el.className += " " + pieceType.toLowerCase();
        }

        if(color === Color.BLACK) {
            el.className += " black";
        }
      }
    });
  }
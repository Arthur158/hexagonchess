// @ts-nocheck
/**
 * This takes care of the actual visible elements and their actions
 */
class VisibleGameBoard {
    constructor() {
        this.gameHandler = null;

        let elements = document.querySelectorAll(".cell");
        this.cells = Array.from(elements);
    }
    /**
     * Initializes the cells with the click events and also puts the pieces in the right spot
     *
     * @param {GameHandler} gameHandler
     */
    initialize(gameHandler) {
        this.initializeCells(gameHandler);
        this.initializeStartingPosition();
    }
    /**
     * Initializes the cells with the right click events
     *
     * @param {GameHandler} gameHandler
     */
    initializeCells(gameHandler) {
        this.cells.forEach(function (el) {
            el.addEventListener("click", function singleClick(e) {
                let obj = JSON.parse(e.target["title"]);
                let clickedPosition = new Position(obj.x, obj.y, obj.z);

                gameHandler.updatePosition(clickedPosition);
            });
        });
    }
    /**
     * Initializes the cells with the right pieces on the starting position (debatable if it is needed)
     */
    initializeStartingPositions() {
        //TODO
    }
    /**
     * Add a piece type (or remove one) at the respective position
     *
     * @param {Position} position
     * @param {string|null} pieceType
     * @param {string|null} color
     */
    addPieceToCell(position, pieceType, color) {
        this.cells.forEach(function (el) {
            if (el.getAttribute("title") === JSON.stringify(position)) {

                el.className = "cell";

                if (pieceType != null) {
                    el.className += " " + pieceType.toLowerCase();
                }

                if (color === Color.BLACK) {
                    el.className += " black";
                }
            }
        });
    }

    /**
     * Makes a certain cell selected
     * 
     * @param {Position} position 
     */
    selectCell(position) {
        this.cells.forEach(function (el) {
            if (el.getAttribute("title") === JSON.stringify(position)) {
                el.className += " selected";
            }
        });
    }

    /**
     * Makes a certain cell available
     * 
     * @param {Position} position 
     */
    makeCellAvailable(position) {
        this.cells.forEach(function (el) {
            if (el.getAttribute("title") === JSON.stringify(position)) {
                el.className += " available";
            }
        });
    }

    /**
     * Deselects all cells? complex
     */
    deselectAllCells() {
        this.cells.forEach(function (el) {
            if (el.className.includes(" selected")) {
                el.className.replace(" selected", "");
            }
            if (el.className.includes(" available")) {
                el.className.replace(" available", "");
            }
        });
    }

    /**
     * Makes all cells clickable
     */
    enableAllCells() {
        this.cells.forEach(function(el) {
            el.style.pointerEvents = "all";
        });
    }

    /**
     * Makes all cells unclickable
     */
    disableAllCells() {
        this.cells.forEach(function(el) {
            el.style.pointerEvents = "none";
        });
    }
}
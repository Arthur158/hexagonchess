// @ts-nocheck
/**
 * This takes care of the actual visible elements and their actions
 */
class VisibleGameBoard {
    constructor(color) {
        this.gameHandler = null;
        this.color = color;

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
                else {
                    el.className += " white";
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
                el.className = "available " + el.className;
                el.style.pointerEvents = "all";
            }
        });
    }

    /**
     * Deselects all cells? complex
     */
    deselectAllCells() {
        this.cells.forEach(function (el) {
            let s = el.className;

            s = s.replace(" selected", "");
            s = s.replace("available ", "");
        
            el.className = s;
        });
    }

    /**
     * Makes all cells clickable
     */
    enableAllCells() {
        let playerColor = this.color;

        this.cells.forEach(function(el) {
            if(el.className.includes(playerColor.toLowerCase())){
                el.style.pointerEvents = "all";
            }
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
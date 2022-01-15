/**
 * Class for managing and displaying piece losses for both colors
 */
class CapturesBar {
    constructor() {
        this.blackLosses = document.getElementById("blackPieces");
        this.whiteLosses = document.getElementById("whitePieces");
    }

    /**
     * Function that appends a new span to the necessary row to
     * display a new lost piece
     * 
     * @param {string} pieceType 
     * @param {string} color 
     */
    addLoss(pieceType, color) {
        let newElem = document.createElement("span");
        newElem.className = pieceType.toLowerCase() + " " + color.toLowerCase();

        let parentRow = color == "WHITE" ? this.whiteLosses : this.blackLosses;
        parentRow.appendChild(newElem);
    }

    /**
     * Function that clears both losses rows
     */
    clearLosses() {
        // helper function that remove all children
        const removeChilds = (parent) => {
            while (parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        };

        removeChilds(this.whiteLosses);
        removeChilds(this.blackLosses);
    }

    /**
     * Function that updates all the losses based on a provided object
     * 
     * @param {Object} losses 
     */
    updateLosses(losses) {
        this.clearLosses();

        let whiteLosses = losses.white;
        let blackLosses = losses.black;

        let ref = this;

        whiteLosses.forEach(function(e) {
            ref.addLoss(e, "WHITE");
        });

        blackLosses.forEach(function(e) {
            ref.addLoss(e, "BLACK");
        });
    }
}
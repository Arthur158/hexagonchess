class StatusBar {
    constructor() {
    }

    /**
     * Changes the status bar contents to the given string
     * 
     * @param {string} status 
     */
    setStatus(status) {
        document.getElementById("status").innerHTML = status;
    };


    /**
     * Sets the display message to show the current color
     * 
     * @param {string} color 
     */
    setColor(color) {
        document.getElementById("playerColor").innerHTML = color;
    }
}

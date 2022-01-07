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
}

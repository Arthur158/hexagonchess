class TimerBar {
    constructor() {
        this.timerWhite = 0;
        this.timerBlack = 0;

        this.interval = null;
    }

    /**
     * 
     * @param {number} timerNumber 
     * @param {number} time 
     */
    setTimer(timerNumber, time) {
        timerNumber == 1 ? this.timerWhite = time : this.timerBlack = time;

        this.updateTimer(timerNumber);
    };

    updateTimer(number) {
        let selectedCounter = "stopwatch" + number;
        let currentTime;

        if(number == 1) {
            currentTime = this.timerWhite;
        }
        else {
            currentTime = this.timerBlack;
        }

        if (currentTime <= 0) {
            clearInterval(this.interval);
            document.getElementById(selectedCounter).innerHTML = "00:00";
            document.getElementById(selectedCounter).style.color = "#087033";
            document.getElementById(selectedCounter).style.animation = "blink 2s linear infinite";
            return;
        }

        let minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((currentTime % (1000 * 60)) / 1000);

        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        if(seconds < 10) {
            seconds = "0" + seconds;
        }

        document.getElementById(selectedCounter).innerHTML = minutes + ":" + seconds;
    }

    startCounting(color) {
        let timerObj = this;

        this.interval = setInterval(function() {
            color == "WHITE" ? timerObj.timerWhite -= 1000 : timerObj.timerBlack -= 1000;

            timerObj.updateTimer(color == "WHITE" ? 1 : 2);
        }, 1000);
    }

    pauseCounting(color) {
        clearInterval(this.interval);
    }
}
class ResignButton{
    constructor(){
        this.resignButton = document.getElementById("forfeitBtn");
        this.gameHandler=null;
        this.resignYes=document.getElementById("forfeitYes");
        this.resignNo=document.getElementById("forfeitNo");

        this.hide();
    }
    initialize(gameHandler) {
        this.initializeResignButton(gameHandler);

    }

    initializeResignButton(gameHandler) {
        this.resignButton.addEventListener("click",function singleClick(e){
            document.getElementById("forfeitSquare").style.display = "block";

            setTimeout(function() {
                document.getElementById("forfeitSquare").style.opacity = "1";
            }, 10);
        })    

        this.resignYes.addEventListener("click",function singleClick(e){
            gameHandler.resignMessage();
            document.getElementById("forfeitSquare").style.opacity = "0";

            setTimeout(function() {
                document.getElementById("forfeitSquare").style.display="none";
            }, 500);
        })
        this.resignNo.addEventListener("click",function singleClick(e){
            document.getElementById("forfeitSquare").style.opacity = "0";
            setTimeout(function() {
                document.getElementById("forfeitSquare").style.display="none";
            }, 500);})
    }

    show() {
        this.resignButton.style.display = "block";
    }

    hide() {
        this.resignButton.style.display = "none";
    }

}
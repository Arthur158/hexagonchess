class ResignButton{
    constructor(){
        this.resignButton = document.getElementById("forfeitBtn");
        this.gameHandler=null;
    }
    initialize(gameHandler) {
        this.initializeResignButton(gameHandler);
    }

    initializeResignButton(gameHandler) {
        this.resignButton.addEventListener("click",function singleClick(e){
            gameHandler.resignMessage();
        })
    }



}
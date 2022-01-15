class ResignButton{
    constructor(){
        this.resignButton = document.getElementById("forfeitBtn");
        this.gameHandler=null;
        this.resignYes=document.getElementById("forfeitYes");
        this.resignNo=document.getElementById("forfeitNo");
    }
    initialize(gameHandler) {
        this.initializeResignButton(gameHandler);

    }

    initializeResignButton(gameHandler) {
        this.resignButton.addEventListener("click",function singleClick(e){
            document.getElementById("forfeitSquare").style.display="inline";
        })    

        this.resignYes.addEventListener("click",function singleClick(e){
            gameHandler.resignMessage();
        })
        this.resignNo.addEventListener("click",function singleClick(e){
            document.getElementById("forfeitSquare").style.display="none";
        })
    }



}
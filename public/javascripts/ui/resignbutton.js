class ResignButton{
    constructor(){
        this.resignButton = document.getElementById("forfeitBtn");
        this.gameHandler=null;
        this.resignQuestion=document.getElementById("forfeitAsk");
        this.resignYes=document.getElementById("forfeitYes");
        this.resignNo=document.getElementById("forfeitNo");
    }
    initialize(gameHandler) {
        this.initializeResignButton(gameHandler);

    }

    initializeResignButton(gameHandler) {
        this.resignButton.addEventListener("click",function singleClick(e){
            document.getElementById("forfeitAsk").style.display="inline";
            document.getElementById("forfeitYes").style.display="inline";
            document.getElementById("forfeitNo").style.display="inline";
        })    

        this.resignYes.addEventListener("click",function singleClick(e){
            gameHandler.resignMessage();
        })
        this.resignNo.addEventListener("click",function singleClick(e){
            document.getElementById("forfeitAsk").style.display="none";
            document.getElementById("forfeitYes").style.display="none";
            document.getElementById("forfeitNo").style.display="none";
        })
    }



}
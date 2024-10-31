var GAME = null;
var LETTERS = {"B": B};
var INTERVAL_ID = null;

window.onload = ()=>{
    GAME = new Game(CONFIG);
    console.log("GAME INITIATED");
    GAME.board.init();

    let startButton = document.getElementById("start")
    let stopButton = document.getElementById("stop")

    startButton.addEventListener('click', (event) => {
        GAME.board.suicide = false;
        GAME.start();
    });

    stopButton.addEventListener('click', (event) => {
        GAME.board.suicide = true;
        GAME.pause();
    });    

    document.addEventListener('keydown', (event) => {
      var keyValue = event.key;
      var codeValue = event.code;

      // BOARD.type(event.key);
    }, false);
};

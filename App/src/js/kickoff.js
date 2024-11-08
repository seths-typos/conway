var GAME = null;
var LETTERS = {"A":A, "B": B,"C": C, "D": D,"E": E,"F": F};
var INTERVAL_ID = null;

window.onload = ()=>{
    GAME = new Game({});
    GAME.init();

    let startButton = document.getElementById("buttonRun")
    let stepButton = document.getElementById("buttonStep")
    let clearButton = document.getElementById("buttonClear")

    startButton.addEventListener('click', (event) => {
        GAME.running = !GAME.running;

        if (GAME.running) {
          console.log(GAME)
          GAME.nextStep();
          document.getElementById('buttonRun').value = 'Stop';
        } else {
          document.getElementById('buttonRun').value = 'Run';
        }
    });

    /**
     * Button Handler - Next Step - One Step only
     */
    stepButton.addEventListener('click', (event) => {
        if (!GAME.running) {
          GAME.nextStep();
        }
    });

    /**
    * Button Handler - Clear World
    */
    clearButton.addEventListener('click', (event) => {
        if (GAME.running) {
          GAME.clear.schedule = true;
          GAME.running = false;
          document.getElementById('buttonRun').value = 'Run';
        } else {
          GAME.cleanUp();
        }
    });

    document.onkeypress = function (e) {
        e = e || window.event;

        if (e.keyCode == 32) {
            GAME.addSpace();
        } else {
            GAME.typeLetter(LETTERS[e.key.toUpperCase()]);    
        }
        
        GAME.drawCells();
    };    
};

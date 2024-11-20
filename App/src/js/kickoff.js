var GAME = null;
var LETTERS = {"A":A, "B": B,"C": C, "D": D,"E": E,"F": F, "G":G, "H": H,"I": I, "J": J,"K": K,"L": L, "M":M, "N": N,"O": O, "P": P,"Q": Q,"R": R, "S":S, "T": T,"U": U,"V": V,"W": W,"X": X,"Y": Y,"Z":Z};
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
          GAME.running = false;
          document.getElementById('buttonRun').value = 'Run';
        } else {
          GAME.cleanUp();
        }
    });

    document.onkeydown = function (e) {
        e = e || window.event;

        // GAME.nextGeneration(); // makes it evolve after each step

        if (e.keyCode == 32) {
            GAME.addSpace();
        } else if (e.key === "Backspace" || e.key === "Delete") {
            GAME.deleteLetter();
        } else {
            GAME.typeLetter(LETTERS[e.key.toUpperCase()]);    
        }
        
        GAME.redrawWorld();
    };    
};

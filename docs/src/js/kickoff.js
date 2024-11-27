var GAME = null;
var INTERVAL_ID = null;
var CUR_FONT = null;

window.onload = ()=>{
    GAME = new Game({});
    GAME.init();

    let startButton = document.getElementById("buttonRun")
    let stepButton = document.getElementById("buttonStep")
    let clearButton = document.getElementById("buttonClear")
    let fontSelector = document.getElementById("fontSelector")

    for (font in LETTERS) {
        let opt = document.createElement('option');
        opt.value = font;
        opt.innerHTML = font;
        fontSelector.appendChild(opt);
    }

    CUR_FONT = fontSelector.value;
    GAME.setCapHeight(LETTERS[CUR_FONT]["H"])

    startButton.addEventListener('click', (event) => {
        GAME.running = !GAME.running;

        if (GAME.running) {
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
          GAME.reset()
          document.getElementById('buttonRun').value = 'Run';
        } else {
          GAME.cleanUp();
        }
    });

    fontSelector.addEventListener('change', ()=>{
        CUR_FONT = fontSelector.value;
        GAME.setCapHeight(LETTERS[CUR_FONT]["H"])
    })

    document.onkeydown = function (e) {
        e = e || window.event;

        // GAME.nextGeneration(); // makes it evolve after each step
        try {
            if (e.keyCode == 32) {
                GAME.addSpace();
            } else if (e.key === "Backspace" || e.key === "Delete") {
                GAME.deleteLetter();
            } else if (/[\.\,\-\:\;\!\?]/.test(e.key)){
                GAME.typeLetter(LETTERS[CUR_FONT][e.code]);    
            } else {
                GAME.typeLetter(LETTERS[CUR_FONT][e.key]);    
            }    
        } catch (e) {
            console.log(e)
        }
        
        
        GAME.redrawWorld();
    };    
};

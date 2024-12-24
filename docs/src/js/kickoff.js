var GAME = null;
var INTERVAL_ID = null;
var CUR_FONT = null;

window.onload = ()=>{
    GAME = new Game({});
    GAME.init();

    let startButton = document.getElementById("buttonRun");
    let stepButton = document.getElementById("buttonStep");
    let clearButton = document.getElementById("buttonClear");
    let fontSelector = document.getElementById("fontSelector");
    let sizeSelector = document.getElementById("sizeSelector");
    let textField = document.getElementById("textField");
    let typeButton = document.getElementById("typeButton");
    let progressToggle = document.getElementById("progressToggle");

    for (font in LETTERS) {
        let opt = document.createElement('option');
        opt.value = font;
        opt.innerHTML = font;
        fontSelector.appendChild(opt);
    }

    // for (size in GAME.zoom) {
    //     if (size == "current") {
    //         continue;
    //     }

    //     let opt = document.createElement('option');
    //     opt.value = size;
    //     opt.innerHTML = size;
    //     sizeSelector.appendChild(opt);
    // }

    fontSelector.value = 'Mortal'
    CUR_FONT = fontSelector.value;
    GAME.setCapHeight(LETTERS[CUR_FONT]["H"])
    GAME.flashInsertionPoint();

    // sizeSelector.value = 'm';



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
     * Button Handler - Next Step - One Step only
     */
    progressToggle.addEventListener('change', (event) => {
        GAME.progressEachStep = progressToggle.checked
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
        document.activeElement = null;
        GAME.flashInsertionPoint();
    });

    fontSelector.addEventListener('change', ()=>{
        CUR_FONT = fontSelector.value;
        GAME.setCapHeight(LETTERS[CUR_FONT]["H"])
    })

    // sizeSelector.addEventListener('change', ()=>{
    //     GAME.zoom.current = sizeSelector.value;
    //     GAME.init();
    // })

    typeButton.addEventListener('click', (event) => {
        GAME.reset()
        document.getElementById('buttonRun').value = 'Run';

        typeString(textField.value);
    })

    document.onkeydown = function (e) {
        e = e || window.event;

        if (textField === document.activeElement) {
            return;
        }

        // GAME.actualState.nextGeneration(); // makes it evolve after each step
        try {
            if (e.keyCode == 32) {
                GAME.addSpace();
            } else if (e.key === 'Enter') {
                GAME.carriageReturn();
            } else if (e.key === "Backspace" || e.key === "Delete") {
                GAME.deleteLetter(true);
            } else if (/[\-]/.test(e.key)){
                GAME.typeLetter(LETTERS[CUR_FONT]["-"], "m");
            } else if (/[\']/.test(e.key)){
                GAME.typeLetter(LETTERS[CUR_FONT]["Quote"], "t");    
            } else if (/[\"]/.test(e.key)){
                GAME.typeLetter(LETTERS[CUR_FONT]["DoubleQuote"], "t");    
            } else if (/[*^\']/.test(e.key)){
                GAME.typeLetter(LETTERS[CUR_FONT][e.key], "t");    
            } else if (/[\:]/.test(e.key)){
                GAME.typeLetter(LETTERS[CUR_FONT]["Colon"], false);    
            } else if (/[\.\,\d]/.test(e.key)){
                GAME.typeLetter(LETTERS[CUR_FONT][e.code], false);    
            } else {
                GAME.typeLetter(LETTERS[CUR_FONT][e.key], false);    
            }    
        } catch (e) {
            console.log(e)
        }
        
        
        GAME.redrawWorld();
    };    
};

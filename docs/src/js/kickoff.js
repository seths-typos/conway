var GAME = null;
var INTERVAL_ID = null;
var CUR_FONT = null;
var CUR_TEXT = "";

window.onload = ()=>{
    document.addEventListener("titleReady", (e) => {
        console.log("READY");
        window.onmousemove = (e) => { TITLE.trackAndUpdate(e); };

        document.addEventListener("mouseleave", function(event){
            if(event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {
                TITLE.mouseOut()
            }
        });

        let launchButton = document.getElementById("launchButton"),
            controls = document.getElementById("controls"),
            closer = document.getElementById("closer")
            body = document.getElementById("body");

        launchButton.addEventListener('click', (e) => {
            launchButton.blur();
            e.preventDefault();
            body.classList.add('game-open');

            var eventHandler = (e) => {
                console.log("running"); 
                runGame();
                e.target.removeEventListener('transitionend', eventHandler, false);
            }

            controls.addEventListener('transitionend',eventHandler);
        });

        closer.addEventListener('click', (e) => {
            GAME.stopRunning();
            GAME.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            body.classList.remove('game-open');
        });
    });

    TITLE = new SiteTitle();
    TITLE.init();
};

function runGame () {
    GAME = new Game({});
    GAME.init();

    let startButton = document.getElementById("buttonRun"),
        stepButton = document.getElementById("buttonStep"),
        clearButton = document.getElementById("buttonClear"),
        fontSelector = document.getElementById("fontSelector"),
        sizeSelector = document.getElementById("sizeSelector"),
        textField = document.getElementById("textField"),
        typeButton = document.getElementById("typeButton"),
        progressToggle = document.getElementById("progressToggle"),
        pasteButton = document.getElementById("buttonPaste"),
        pasteDrawer = document.getElementById("drawerPaste"),
        pasteDrawerOpen = false,
        settingsButton = document.getElementById("buttonSettings"),
        settingsDrawer = document.getElementById("drawerSettings"),
        settingsDrawerOpen = false,
        styleToggle = document.getElementById("styleToggle"),
        evolveToggle = document.getElementById("evolveToggle"),
        shapeToggle = document.getElementById("shapeToggle"),
        gridToggle = document.getElementById("gridToggle");

    // for (font in LETTERS) {
    //     let opt = document.createElement('option');
    //     opt.value = font;
    //     opt.innerHTML = font;
    //     fontSelector.appendChild(opt);
    // }

    // for (size in GAME.zoom) {
    //     if (size == "current") {
    //         continue;
    //     }

    //     let opt = document.createElement('option');
    //     opt.value = size;
    //     opt.innerHTML = size;
    //     sizeSelector.appendChild(opt);
    // }

    // fontSelector.value = 'Mortal'
    CUR_FONT = 'Mortal';
    GAME.setCapHeight(LETTERS[CUR_FONT]["H"])
    GAME.flashInsertionPoint();

    // sizeSelector.value = 'm';



    startButton.addEventListener('click', (event) => {
        event.preventDefault();

        GAME.running = !GAME.running;

        if (GAME.running) {
          GAME.nextStep();
          document.getElementById('buttonRun').textContent = 'Stop';
        } else {
          document.getElementById('buttonRun').textContent = 'Run';
        }
    });

    /**
     * Button Handler - Next Step - One Step only
     */
    stepButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (!GAME.running) {
          GAME.nextStep();
        }
    });

    // /**
    //  * Button Handler - Next Step - One Step only
    //  */
    // progressToggle.addEventListener('change', (event) => {
    //     GAME.progressEachStep = progressToggle.checked
    // });

    /**
    * Button Handler - Clear World
    */
    clearButton.addEventListener('click', (event) => {
        event.preventDefault();
        clearButton.blur();
        CUR_TEXT = "";

        if (GAME.running) {
            GAME.stopRunning();
            GAME.cleanUp();
            GAME.flashInsertionPoint();
            document.getElementById('buttonRun').textContent = 'Run';
        } else {
            GAME.cleanUp();
        }
    });

    // fontSelector.addEventListener('change', ()=>{
    //     fontSelector.blur();

    //     CUR_FONT = fontSelector.value;
    //     GAME.setCapHeight(LETTERS[CUR_FONT]["H"])
    // })

    // sizeSelector.addEventListener('change', ()=>{
    //     GAME.zoom.current = sizeSelector.value;
    //     GAME.init();
    // })

    typeButton.addEventListener('click', (event) => {
        event.preventDefault();
        typeButton.blur();

        GAME.cleanUp();
        document.getElementById('buttonRun').value = 'Run';

        typeString(textField.value);

        closePasteDrawer();
    });

    pasteButton.addEventListener('click', (event) => {
        event.preventDefault();
        pasteButton.blur();

        if (pasteDrawerOpen) {
            closePasteDrawer()
        } else {
            pasteDrawer.classList.add('open');
            pasteButton.textContent = "close";
            pasteDrawerOpen = true;
            settingsDrawerOpen && closeSettingsDrawer();
        }
    });

    settingsButton.addEventListener('click', (event) => {
        event.preventDefault();
        settingsButton.blur();

        if (settingsDrawerOpen) {
            closeSettingsDrawer();
        } else {
            settingsDrawer.classList.add('open');
            settingsButton.textContent = "close";
            settingsDrawerOpen = true;
            pasteDrawerOpen && closePasteDrawer();
        }
    });

    function closePasteDrawer () {
        pasteDrawer.classList.remove('open');
        pasteButton.textContent = "paste text";
        pasteDrawerOpen = false;
    }

    function closeSettingsDrawer () {
        settingsDrawer.classList.remove('open');
        settingsButton.textContent = "settings";
        settingsDrawerOpen = false;
    }

    evolveToggle.addEventListener('change', (event) => {
        evolveToggle.blur();
        GAME.progressEachStep = event.target.checked;
    });

    styleToggle.addEventListener('change', (event) => {
        styleToggle.blur();

        if (event.target.checked) {
            CUR_FONT = "Eternal";
        } else {
            CUR_FONT = "Mortal";
        }

        typeString(CUR_TEXT);
    });

    shapeToggle.addEventListener('change', (event) => {
        shapeToggle.blur();
        GAME.square = !event.target.checked;
        GAME.redrawWorld();
    });

    gridToggle.addEventListener('change', (event) => {
        gridToggle.blur();

        if (event.target.checked) {
            GAME.setNoGridOff();
        } else {
            GAME.setNoGridOn();
        }

        GAME.redrawWorld();
    }); 

    document.onkeydown = function (e) {
        e = e || window.event;

        console.log(event)

        if (textField === document.activeElement) {
            return;
        }

        // GAME.actualState.nextGeneration(); // makes it evolve after each step
        try {
            if (e.keyCode == 32) {
                CUR_TEXT += " ";
                GAME.addSpace();
            } else if (e.key === 'Enter') {
                CUR_TEXT += "\n";
                GAME.carriageReturn();
            } else if (e.key === "Backspace" || e.key === "Delete") {
                CUR_TEXT = CUR_TEXT.slice(0, -1); 
                GAME.deleteLetter(true);
            } else if (/[\-]/.test(e.key)){
                CUR_TEXT += e.key;
                GAME.typeLetter(LETTERS[CUR_FONT]["-"], "m");
            } else if (/[\']/.test(e.key)){
                CUR_TEXT += e.key;
                GAME.typeLetter(LETTERS[CUR_FONT]["Quote"], "t");    
            } else if (/[\"]/.test(e.key)){
                CUR_TEXT += e.key;
                GAME.typeLetter(LETTERS[CUR_FONT]["DoubleQuote"], "t");    
            } else if (/[*^\']/.test(e.key)){
                CUR_TEXT += e.key;
                GAME.typeLetter(LETTERS[CUR_FONT][e.key], "t");    
            } else if (/[\:]/.test(e.key)){
                CUR_TEXT += e.key;
                GAME.typeLetter(LETTERS[CUR_FONT]["Colon"], false);    
            } else if (/[\.\,\d]/.test(e.key)){
                CUR_TEXT += e.key;
                GAME.typeLetter(LETTERS[CUR_FONT][e.code], false);    
            } else {
                if (e.key.length == 1) {
                    CUR_TEXT += e.key;
                }
                GAME.typeLetter(LETTERS[CUR_FONT][e.key], false);    
            }    
        } catch (e) {
            console.log(e)
        }
        
        
        GAME.redrawWorld();
    };    
}

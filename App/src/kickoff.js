LETTERS = {"B": B};


window.onload = ()=>{
    clearExample();
    loadExample(Ex1_Standard_CGOL);//ALL_EXAMPLES.length-1)

    console.log(LETTERS)

    let startButton = document.getElementById("start")
    let stopButton = document.getElementById("stop")

    startButton.addEventListener('click', (event) => {
        EZ_EXAMPLE.suicide = false;
        startExampleLoop();
    });

    stopButton.addEventListener('click', (event) => {
        EZ_EXAMPLE.suicide = true;
        pauseExample()
    });    

    document.addEventListener('keydown', (event) => {
      var keyValue = event.key;
      var codeValue = event.code;
    }, false);
};

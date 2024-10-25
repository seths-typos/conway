window.onload = ()=>{
    clearExample();
    loadExample(Ex1_Standard_CGOL);//ALL_EXAMPLES.length-1)

    let startButton = document.getElementById("start")
    let stopButton = document.getElementById("stop")

    startButton.addEventListener('click', (event) => {
        EZ_EXAMPLE.suicide = false;
        startExampleLoop();
    });

    stopButton.addEventListener('click', (event) => {
        EZ_EXAMPLE.suicide = true;
    });    

    document.addEventListener('keydown', (event) => {
      var keyValue = event.key;
      var codeValue = event.code;
      
      console.log("keyValue: " + keyValue);
      console.log("codeValue: " + codeValue);
    }, false);
};

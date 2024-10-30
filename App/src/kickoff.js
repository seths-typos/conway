LETTERS = {"B": B};

var BOARD_INIT = () => {
                

    let computeWGSL = 
    `
        // This value is used as an index to get the right attribute
        // in the cell (we're only going to define a size of 1 for 
        //  this CGOL example)
        let cellAttribute: u32 = 0u;

        
        var neighbourCount: u32 = 0u;

        // Explanation of the EX_CELL_VAL function call:
        //      get the surroduning 8 neighbours (from the chunk that
        //      EZX and EZY is in), get the offset by 1 or -1, and at
        //      that cell's value stored at index "cellAttribute"
        neighbourCount += EZ_CELL_VAL( EZX, 1, EZY,  1, cellAttribute );
        neighbourCount += EZ_CELL_VAL( EZX, 1, EZY,  0, cellAttribute );
        neighbourCount += EZ_CELL_VAL( EZX, 1, EZY, -1, cellAttribute );
        neighbourCount += EZ_CELL_VAL( EZX, 0, EZY, -1, cellAttribute );
        
        neighbourCount += EZ_CELL_VAL( EZX, -1, EZY, -1, cellAttribute );
        neighbourCount += EZ_CELL_VAL( EZX, -1, EZY,  0, cellAttribute );
        neighbourCount += EZ_CELL_VAL( EZX, -1, EZY,  1, cellAttribute );
        neighbourCount += EZ_CELL_VAL( EZX, 0,  EZY,  1, cellAttribute );

        var myState: u32 = EZ_STATE_IN[ EZ_CELL_IND ];

        if (myState == 1u && (neighbourCount < 2u || neighbourCount > 3u)) {
            EZ_STATE_OUT[ EZ_CELL_IND ] = 0u;
        }
        else if (myState == 0 && neighbourCount == 3u) {
            EZ_STATE_OUT[ EZ_CELL_IND ] = 1u;
        }
        else {
            EZ_STATE_OUT[ EZ_CELL_IND ] = myState;
        }
    `;

    let fragmentWGSL = 
    `
        var rrr: f32 = 0;
        var ggg: f32 = 0;
        var bbb: f32 = 0;
        
        let cellAttIndex: u32 = 0u;
        var cellVal: u32 = EZ_CELL_VAL( EZX, 0, EZY, 0, cellAttIndex );
        //      EZ_STATE_IN[ EZ_CELL_IND + (0u) * EZ_TOTAL_CELLS ];

        if( cellVal == 0 ){
            rrr = 0;
            ggg = 0;
            bbb = 0;
        }
        else{
            rrr = 1;
            ggg = 0.75;
            bbb = 1;
        }

        EZ_OUTPUT.red = rrr;
        EZ_OUTPUT.grn = ggg;
        EZ_OUTPUT.blu = bbb; 
    `;

    // Usage example
    let config = {

        CELL_VALS: 1,
        CHUNK_SIZE: 100,
        CHUNKS_ACROSS: 1,
        CELL_SIZE: 4,

        

        BUFFER_TYPE: 'u32',

        CONTAINER_ID:   'demoCanvasContainer',    // DOM id to insdert canvas to
        RAND_SEED:      'randomseed12345678910', 
        STARTING_CONFIG: EZWG.ALL_BINS,      // couldve been EZWG.ALL_ZERO
        COMPUTE_WGSL: `
            // The custom WGSL code goes here
            ${computeWGSL}
        `,

        FRAGMENT_WGSL: `
            // The custom WGSL code goes here
            ${fragmentWGSL}
        `,
        
    };

    // Fill starting buffer with zeros
    let gridSize = Math.pow(config.CHUNK_SIZE * config.CHUNKS_ACROSS, 2);
    config.STARTING_BUFFER = new Uint32Array( gridSize * config.CELL_VALS );

    // Intital set the default runner to this
    BOARD = new EZWG( config );
};

var BOARD = null;
var INTERVAL_ID = null;

function loadExample( example ){
    clearExample();
    // Initial load
    example();
    

    (async () => {
        await BOARD.init(); 
        console.log('BOARD has been initialized'); 
        // startExampleLoop()
    })();

}

function pauseExample(){
    if( INTERVAL_ID ){
        clearInterval( INTERVAL_ID )
    }
} 

function clearExample(){
    pauseExample()
    if( BOARD ){
        BOARD.killdeath()
    }
} 

function startExampleLoop(){
    console.log(BOARD);
    INTERVAL_ID = setInterval( () => {
        if( !BOARD.suicide ){
            BOARD.run() 
        } 
    }, BOARD.UPDATE_INTERVAL );     
}


window.onload = ()=>{
    clearExample();
    loadExample(BOARD_INIT);//ALL_EXAMPLES.length-1)

    let startButton = document.getElementById("start")
    let stopButton = document.getElementById("stop")

    startButton.addEventListener('click', (event) => {
        BOARD.suicide = false;
        startExampleLoop();
    });

    stopButton.addEventListener('click', (event) => {
        BOARD.suicide = true;
        pauseExample()
    });    

    document.addEventListener('keydown', (event) => {
      var keyValue = event.key;
      var codeValue = event.code;

      BOARD.type(event.key);
    }, false);
};

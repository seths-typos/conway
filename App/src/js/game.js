class Game {
	constructor (config) {
		this.width = config.CHUNK_SIZE * config.CHUNKS_ACROSS;
		this.INTERVAL_ID = null;

		// if (config) {
		// 	let gridSize = Math.pow(this.width, 2);
    	// 	config.STARTING_BUFFER = new Uint32Array( gridSize * config.CELL_VALS );	
		// }
		
		this.board = new EZWG(config);
		this.board.init().then(()=>{this.board.run()});
	}

	/*
	Start and Stop
	*/

	pause () {
		if ( this.INTERVAL_ID) {
			clearInterval(this.INTERVAL_ID);
		}
	}

	start () {
		this.INTERVAL_ID = setInterval( () => {
			if(!this.board.suicide) {
				this.board.run()
			}
		}, this.board.UPDATE_INTERVAL);
	}

	/*
	Typing
	*/

	type (ltr) {
		// get center point
		let center = Math.round(this.width / 2);
		let topRow = center - 4;
		let bottomRow = center + 4;

		
		

		// move to the left half of letter width
		// replace rows
		// remove 0s
		// run!
	}
}
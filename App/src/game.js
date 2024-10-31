class Game {
	constructor (config) {
		if (config) {
			let gridSize = Math.pow(config.CHUNK_SIZE * config.CHUNKS_ACROSS, 2);
    		config.STARTING_BUFFER = new Uint32Array( gridSize * config.CELL_VALS );	
		}
		
		this.board = new EZWG(config);
		this.INTERVAL_ID = null;
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
}
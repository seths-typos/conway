class CellList {

  constructor () {
    this.cells = {};
    this.highestRow = 0;
    this.farthestCol = 0
    this.age = []
  }

  reset () {
    this.cells = {};
  }

  nextGeneration () {
    var i, j, m, n, key, t1, t2, alive = 0, neighbours, allDeadNeighbours = {}, newState = new CellList();
    this.redrawList = [];


    for (const row in this.cells) {
      for (const col of this.cells[row]) {
        let x = col;
        let y = parseInt(row);

        // Possible dead neighbours
        let deadNeighbours = [[x-1, y-1, 1], [x, y-1, 1], [x+1, y-1, 1], [x-1, y, 1], [x+1, y, 1], [x-1, y+1, 1], [x, y+1, 1], [x+1, y+1, 1]];

        // Get number of live neighbours and remove alive neighbours from deadNeighbours
        let neighbours = this.getNeighboursFromAlive(x, y, deadNeighbours);

        // Join dead neighbours to check list
        for (m = 0; m < 8; m++) {
          if (deadNeighbours[m] !== undefined) {
            key = deadNeighbours[m][0] + ',' + deadNeighbours[m][1]; // Create hashtable key
            
            if (allDeadNeighbours[key] === undefined) {
              allDeadNeighbours[key] = 1;
            } else {
              allDeadNeighbours[key]++;
            }
          }
        }

        if (!(neighbours === 0 || neighbours === 1 || neighbours > 3)) {
          newState.addCell(x, y);
          alive++;
          this.keepCellAlive(x,y); // Keep alive
        } else {
          this.changeCelltoDead(x,y); // Kill cell
        }
      }
    }

    // Process dead neighbours
    for (key in allDeadNeighbours) {
      if (allDeadNeighbours[key] === 3) { // Add new Cell
        key = key.split(',');
        t1 = parseInt(key[0], 10);
        t2 = parseInt(key[1], 10);
  
        newState.addCell(t1, t2);
        alive++;
        this.changeCelltoAlive(t1, t2);
      }
    }

    this.cells = newState.cells;

    return alive;
  }

  /**
   *
   */
  getNeighboursFromAlive  (x, y, possibleNeighboursList) {
    var neighbours = 0, k;

    let rowAbove = (y - 1).toString();
    let rowBelow = (y + 1).toString();

    let testers = [x - 1, x, x + 1];
    
    for (let i = 0; i < testers.length; i++) {  
      // Top
      if (rowAbove in this.cells) {   
        if (this.cells[rowAbove].has(testers[i])){
          possibleNeighboursList[i] = undefined;
          neighbours++;
        }
      }

      // Middle (Skipping central cell)
      if (i === 0) {
        if (this.cells[y].has(testers[i])){
          possibleNeighboursList[3] = undefined;
          neighbours++;
        } 
      }

      if (i === 2) {
        if (this.cells[y].has(testers[i])){
          possibleNeighboursList[4] = undefined;
          neighbours++;
        } 
      }

      if (rowBelow in this.cells) {   
        if (this.cells[rowBelow].has(testers[i])){
          possibleNeighboursList[i+5] = undefined;
          neighbours++;
        }
      }
    }

    return neighbours;
  }


  /**
   *
   */
  isAlive (x, y) {
    return this.cells[y] && this.cells[y].has(x);
  }

  /**
   *
   */

  addCell (x, y) {
    if (!(y in this.cells)) {
      this.cells[y] = new Set([x]);

      return;
    } 

    if (y > this.highestRow) {
      this.highestRow = y;
    }

    if (x > this.farthestCol) {
      this.farthestCol = x;
    }
    
    this.cells[y].add(x);
  }

  /**
   *
   */
  removeCell (x, y) {
    try {
      this.cells[x].delete(y);
    } catch (e) {
      console.log(e);
    }
  }


  /**
   * keepCellAlive
   */
  keepCellAlive (i, j) {
    if (!this.age[i][j]) {
      this.age[i][j]++;
    }
  }


  /**
   * changeCelltoAlive
   */
  changeCelltoAlive (i, j) {
    if (!this.age[i][j]) {
      this.age[i][j] = 1;
    }
  }


  /**
   * changeCelltoDead
   */
  changeCelltoDead (i, j) {
    if (!this.age[i][j]) {
      this.age[i][j] = -this.age[i][j]; // Keep trail
    }
  }

}
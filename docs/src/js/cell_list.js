class CellList {

  constructor (config) {
    this.cells = {};
    this.highestRow = 0;
    this.farthestCol = 0;
    this.age = {};
    this.rows = config.rows || 1000;
    this.columns = config.columns || 1000;

    this.clearAges();
  }

  reset () {
    this.cells = {};
  }

  clearAges () {
    for (let i = 0; i < this.columns; i++) {
      this.age[i] = [];
      for (let j = 0; j<this.rows; j++) {
        this.age[i][j]= 0;
      }
    }
  }

  nextGeneration () {
    var i, j, m, n, key, t1, t2, alive = 0, neighbours, allDeadNeighbours = {}, newState = new CellList({rows: this.rows, columns: this.columns});

    for (const row in this.cells) {
      for (const col of this.cells[row]) {
        let x = col;
        let y = parseInt(row);

        // Get number of live neighbours and remove alive neighbours from deadNeighbours
        let neighbours = this.getNeighboursFromAlive(x, y);

        // Join dead neighbours to check list
        for (let i in neighbours.dead) {
          key = CellList.makeKey(neighbours.dead[i][0],neighbours.dead[i][1]); // Create hashtable key
          
          if (allDeadNeighbours[key] === undefined) {
            allDeadNeighbours[key] = 1;
          } else {
            allDeadNeighbours[key]++;
          }
        }

        if (!(neighbours.living < 2 || neighbours.living > 3)) {
          newState.addCell(x, y);
          alive++;
          this._keepCellAlive(x,y); // Keep alive
        } else {
          this._changeCelltoDead(x,y); // Kill cell
        }
      }
    }

    // Process dead neighbours
    for (let cell in allDeadNeighbours) {
      if (allDeadNeighbours[cell] === 3) { // Add new Cell
        let coords = cell.split(',');
        let x = parseInt(coords[0], 10),
            y = parseInt(coords[1], 10);
        
        if (x > -1) {
          newState.addCell(x, y);
          alive++;
          this._changeCelltoAlive(x, y);
        }
      }
    }

    this.cells = newState.cells;

    return alive;
  }

  /**
   *
   */
  getNeighboursFromAlive  (x, y) {
    var k;

    let neighbours = {
      living: 0,
      dead: []
    }

    let rowAbove = (y - 1).toString();
    let rowBelow = (y + 1).toString();

    let testers = [x - 1, x, x + 1];
    
    for (let i = 0; i < testers.length; i++) {  
      // Top
      if (rowAbove in this.cells && this.cells[rowAbove].has(testers[i])){
        neighbours.living++
      } else {
        neighbours.dead.push([testers[i], parseInt(rowAbove, 10)]);
      }

      // Middle (Skipping central cell)
      if (i === 0) {
        if (this.cells[y].has(testers[i])){
          neighbours.living++
        } else {
          neighbours.dead.push([testers[i],parseInt(y, 10)]);
        }
      }

      if (i === 2) {
        if (this.cells[y].has(testers[i])){
          neighbours.living++
        } else {
          neighbours.dead.push([testers[i],parseInt(y, 10)]);
        }
      }

      if (rowBelow in this.cells && this.cells[rowBelow].has(testers[i])){
        neighbours.living++
      } else {
        neighbours.dead.push([testers[i], parseInt(rowBelow, 10)]);
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
   * _keepCellAlive
   */
  _keepCellAlive (i, j) {
    if (this._isWithinBounds(i,j)) {
      this.age[i][j]++;
    }
  }


  /**
   * _changeCelltoAlive
   */
  _changeCelltoAlive (i, j) {
    if (this._isWithinBounds(i,j)) {
      this.age[i][j] = 1;
    }
  }


  /**
   * _changeCelltoDead
   */
  _changeCelltoDead (i, j) {
    if (this._isWithinBounds(i,j)) {
      this.age[i][j] = -this.age[i][j]; // Keep trail
    }
  }

  _isWithinBounds(x,y) {
    return x > -1 && x < this.columns && y > -1 && y < this.columns
  }

  static makeKey (x, y) {
    return x + ',' + y; // Create hashtable key
  }
}
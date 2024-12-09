class CellList {

  constructor () {
    this.cells = {};
    this.highestRow = 0;
    this.farthestCol = 0
  }

  reset () {
    this.cells = {};
  }

  /**
   *
   */
  getNeighboursFromAlive  (x, y) {
    var neighbours = 0, k;

    let rowAbove = (y - 1).toString();
    let rowBelow = (y + 1).toString();

    let testers = [x - 1, x, x + 1];
    
    for (let i = 0; i < testers.length; i++) {  
      // Top
      if (rowAbove in this.cells) {   
        if (this.cells[rowAbove].has(testers[i])){
          neighbours++;
        }
      }

      // Middle (Skipping central cell)
      if (i === 0 || i === 2) {
        if (this.cells[y].has(testers[i])){
          neighbours++;
        } 
      }

      if (rowBelow in this.cells) {   
        if (this.cells[rowBelow].has(testers[i])){
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

}
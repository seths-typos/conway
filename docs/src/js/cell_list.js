class CellList {

  constructor () {
    this.cells = {};
  }

  reset () {
    this.cells = {};
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

      if (i === 0) {
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
    
    this.cells[y].add(x);
  }

  /**
   *
   */
  removeCell (x, y) {
    var i, j;

    for (i = 0; i < this.cells.length; i++) {
      if (this.cells[i][0] === y) {

        if (this.cells[i].length === 2) { // Remove all Row
          this.cells.splice(i, 1);
        } else { // Remove Element
          for (j = 1; j < this.cells[i].length; j++) {
            if (this.cells[i][j] === x) {
              this.cells[i].splice(j, 1);
            }
          }
        }

      }
    }
  }
}
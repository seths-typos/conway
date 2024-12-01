/*jslint onevar: true, undef: false, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, newcap: true, immed: true  */

/**
 * original Game of Life - JS & CSS
 * http://pmav.eu
 * 04/Sep/2010
 * 
 * updated Nov 2024 by Seth Hamlin
 */


class Game {

  constructor () {
    console.log("new game", this)
    let baseColor = '#000000';

    // Variables
    this.waitTime = 2;
    this.waitCap = 1;
    this.alphaCap = 3;
    // let waitSteps = 7;
    // this.waitStep = Math.round((this.waitTime - this.waitCap)/waitSteps);
    this.waitRate = 1;
    this.count = 0
    this.alphaStep = 1 / ((this.waitTime - this.waitCap) / this.waitStep);
    this.firstRun = true;

    this.running = false;
    this.autoplay = false;

    this.curAlpha = 1;

    // Clear state
    this.clear = false;

    // Initial state
    this.initialState = '[{"0":[0,1,3,4]},{"1":[0,1,2,3,4,5,6]},{"2":[1,2,4]},{"3":[0,1,2,3,4]},{"4":[0,1,2,5,6]},{"5":[1,2,5,6]},{"6":[0,1,2,3,4,5,6]},{"7":[0,1,3,4,5]}]';
    // this.initialState = '';

    // Trail state
    this.trail = true;

    // Grid style
    this.gridColor = baseColor;

    // Zoom level
    this.zoom = {
      columns : 100,
      rows : 100,
      cellSize : 4
    };

    // Cell colors
    this.colors = {
      dead : baseColor,
      trail : ['#B5ECA2'],
      alive : ['#9898FF', '#8585FF', '#7272FF', '#5F5FFF', '#4C4CFF', '#3939FF', '#2626FF', '#1313FF', '#0000FF', '#1313FF', '#2626FF', '#3939FF', '#4C4CFF', '#5F5FFF', '#7272FF', '#8585FF']
    };

    // Text
    this.line = 0;
    this.marginTop = 10;
    this.marginLeft = null;
    this.insertionPoints = [];
    this.letterSpacing = 1;
    this.lineHeight = 10;
    this.leading = 4;

    // ListLife Variables
    this.actualState = [];
    this.redrawList = [];
    this.topPointer = 1;
    this.middlePointer = 1;
    this.bottomPointer = 1;

    // Canvas Variables
    this.context = null;
    this.width = null;
    this.height = null;
    this.age = null;
    this.cellSize = null;
    this.cellSpace = null;

    this.rows = this.zoom.rows;
    this.columns = this.zoom.columns;
  }

  init () {
    try {
      this.initCanvas();     // Init canvas GUI
      this.setGridSize();
      // this.addString(this.initialState);
      this.prepare();
    } catch (e) {
      console.log("Error: "+e);
    }
  }

  reset () {
    this.running = false;
    this.cleanUp();
  }


  setGridSize () {
    // this.columns = Math.round(window.innerWidth / (this.zoom.cellSize + this.cellSpace));

    let offset = document.getElementById("controls").getBoundingClientRect();

    // this.rows = Math.round((window.innerHeight - offset.height - offset.bottom) / (this.zoom.cellSize + this.cellSpace));

    this.marginLeft = Math.round(this.rows/7);
  }

  setCapHeight (ltr) {
    let v = JSON.parse(ltr.code)
    this.lineHeight = v.length + this.leading;
  }

  /**
   * Clean up actual state and prepare a new run
   */
  cleanUp () {
    this.line = 0;
    this.actualState = []; // Reset/init algorithm
    this.clearWorld();
    this.redrawWorld();
  }


  /**
   * Prepare DOM elements and Canvas for a new run
   */
  prepare () {
    this.clearWorld(); // Reset GUI
    this.drawWorld(); // Draw State
  }

  /**
   * Run Next Step
   */
  nextStep () {
    this.context.clearRect(0,0,this.width, this.height)
    
    // this._updateAlpha();
    
    // Algorithm run
    if (this.count == this.waitTime) {
      var liveCellNumber = this.nextGeneration();
      this.drawRedraws();

      this.count = 0;

      // if (this.waitTime * this.waitRate > this.waitCap) {
      //   this.waitTime = Math.round(this.waitTime * this.waitRate);
      //   this.waitRate *= this.waitRate;
      //   this.curAlpha = this.context.globalAlpha;
      // } else {
      //   this.waitTime = this.waitCap;
      // }

      // if (this.firstRun) {
      //   this.firstRun = false;
      // }
    } else {
      this.redrawWorld();
      this.count += 1;
    }

    // Flow Control
    if (this.running) { 
      requestAnimationFrame(this.nextStep.bind(this));
    } else {
      if (this.clear) {
        this.cleanUp();
      }
    }
  }

  drawRedraws() {
    var i, x, y;
    
    for (i = 0; i < this.redrawList.length; i++) {
      x = this.redrawList[i][0];
      y = this.redrawList[i][1];

      if (this.redrawList[i][2] === 1) {
        this.changeCelltoAlive(x, y);
      } else if (this.redrawList[i][2] === 2) {
        this.keepCellAlive(x, y);
      } else {
        this.changeCelltoDead(x, y);
      }
    }
  }

  _updateAlpha () {
    if (this.firstRun) {
      this.context.globalAlpha = (this.waitTime - this.count) / this.waitTime;
    } else if (this.waitTime <= this.alphaCap) {
      console.log("no fading")
      this.context.globalAlpha = 1;
    } else if (this.count < this.waitTime/2) {
      console.log("fade in before", this.context.globalAlpha)
      this.context.globalAlpha += (1 - this.curAlpha) / (this.waitTime/2);
      console.log("fade in after", this.context.globalAlpha)
    }  else {
      console.log("fade out before", this.context.globalAlpha)
      this.context.globalAlpha -= (1 - this.curAlpha * this.waitRate)/(this.waitTime/2);
      console.log("fade out", this.context.globalAlpha)
    }
  }

  /** ****************************************************************************************************************************
   * Canvas
   */

  /**
   * init
   */
  initCanvas () {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.cellSize = this.zoom.cellSize;
    this.cellSpace = 1;

    this.clearWorld();
  }


  /**
   * clearWorld
   */
  clearWorld () {
    var i, j;

    this.insertionPoints = [this.marginLeft]

    // Init ages (Canvas reference)
    this.age = [];
    for (i = 0; i < this.columns; i++) {
      this.age[i] = [];
      for (j = 0; j < this.rows; j++) {
        this.age[i][j] = 0; // Dead
      }
    }
  }

  redrawWorld () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCells();
  }


  /**
   * drawWorld
   */
  drawWorld () {
    // Dynamic canvas size
    this.width = this.width + (this.cellSpace * this.columns) + (this.cellSize * this.columns);
    this.canvas.setAttribute('width', this.width);

    this.height = this.height + (this.cellSpace * this.rows) + (this.cellSize * this.rows);
    this.canvas.setAttribute('height', this.height);

    // Fill background
    this.context.fillStyle = this.gridColor;
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawCells();    
  }

  drawCells() {
    var i, j;

    for (i = 0 ; i < this.columns; i++) {
      for (j = 0 ; j < this.rows; j++) {
        if (this.isAlive(i, j)) {
          this.drawCell(i, j, true);
        } else {
          this.drawCell(i, j, false);
        }
      }
    }
  }


  /**
   * setNoGridOn
   */
  setNoGridOn () {
    this.cellSize = this.zoom.cellSize + 1;
    this.cellSpace = 0;
  }


  /**
   * setNoGridOff
   */
  setNoGridOff () {
    this.cellSize = this.zoom.cellSize;
    this.cellSpace = 1;
  }


  /**
   * drawCell
   */
  drawCell (i, j, alive) {   

    if (alive) {
      this.context.fillStyle = this.colors.alive[this.age[i][j] % this.colors.alive.length];

    } else {
      this.context.fillStyle = this.colors.dead;
    }


    let iPos = this.cellSpace + (this.cellSpace * i) + (this.cellSize * i) + this.cellSize/2;
    let jPos = this.cellSpace + (this.cellSpace * j) + (this.cellSize * j) + this.cellSize/2;
    this.context.fillRect(this.cellSpace + (this.cellSpace * i) + (this.cellSize * i), this.cellSpace + (this.cellSpace * j) + (this.cellSize * j), this.cellSize, this.cellSize);
    // this.context.beginPath();
    // this.context.arc(iPos, jPos, this.cellSize/2, 0, 2 * Math.PI);
    // this.context.fill();
  }

  /**
   * keepCellAlive
   */
  keepCellAlive (i, j) {
    if (i >= 0 && i < this.columns && j >=0 && j < this.rows) {
      this.age[i][j]++;
      this.drawCell(i, j, true);
    }
  }


  /**
   * changeCelltoAlive
   */
  changeCelltoAlive (i, j) {
    if (i >= 0 && i < this.columns && j >=0 && j < this.rows) {
      this.age[i][j] = 1;
      this.drawCell(i, j, true);
    }
  }


  /**
   * changeCelltoDead
   */
  changeCelltoDead (i, j) {
    if (i >= 0 && i < this.columns && j >=0 && j < this.rows) {
      this.age[i][j] = -this.age[i][j]; // Keep trail
      this.drawCell(i, j, false);
    }
  }


  /** ****************************************************************************************************************************
   *
   */

    
   
  nextGeneration () {
    var x, y, i, j, m, n, key, t1, t2, alive = 0, neighbours, deadNeighbours, allDeadNeighbours = {}, newState = [];
    this.redrawList = [];

    for (i = 0; i < this.actualState.length; i++) {
      this.topPointer = 1;
      this.bottomPointer = 1;
                
      for (j = 1; j < this.actualState[i].length; j++) {
        x = this.actualState[i][j];
        y = this.actualState[i][0];

        // Possible dead neighbours
        deadNeighbours = [[x-1, y-1, 1], [x, y-1, 1], [x+1, y-1, 1], [x-1, y, 1], [x+1, y, 1], [x-1, y+1, 1], [x, y+1, 1], [x+1, y+1, 1]];

        // Get number of live neighbours and remove alive neighbours from deadNeighbours
        neighbours = this.getNeighboursFromAlive(x, y, i, deadNeighbours);

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
          this.addCell(x, y, newState);
          alive++;
          this.redrawList.push([x, y, 2]); // Keep alive
        } else {
          this.redrawList.push([x, y, 0]); // Kill cell
        }
      }
    }

    // Process dead neighbours
    for (key in allDeadNeighbours) {
      if (allDeadNeighbours[key] === 3) { // Add new Cell
        key = key.split(',');
        t1 = parseInt(key[0], 10);
        t2 = parseInt(key[1], 10);
	
        this.addCell(t1, t2, newState);
        alive++;
        this.redrawList.push([t1, t2, 1]);
      }
    }

    this.actualState = newState;

    return alive;
  }

  

  /**
         *
         */
  getNeighboursFromAlive  (x, y, i, possibleNeighboursList) {
    var neighbours = 0, k;

    // Top
    if (this.actualState[i-1] !== undefined) {
      if (this.actualState[i-1][0] === (y - 1)) {
        for (k = this.topPointer; k < this.actualState[i-1].length; k++) {

          if (this.actualState[i-1][k] >= (x-1) ) {

            if (this.actualState[i-1][k] === (x - 1)) {
              possibleNeighboursList[0] = undefined;
              this.topPointer = k + 1;
              neighbours++;
            }

            if (this.actualState[i-1][k] === x) {
              possibleNeighboursList[1] = undefined;
              this.topPointer = k;
              neighbours++;
            }

            if (this.actualState[i-1][k] === (x + 1)) {
              possibleNeighboursList[2] = undefined;

              if (k == 1) {
                this.topPointer = 1;
              } else {
                this.topPointer = k - 1;
              }
                                
              neighbours++;
            }

            if (this.actualState[i-1][k] > (x + 1)) {
              break;
            }
          }
        }
      }
    }
    
    // Middle
    for (k = 1; k < this.actualState[i].length; k++) {
      if (this.actualState[i][k] >= (x - 1)) {

        if (this.actualState[i][k] === (x - 1)) {
          possibleNeighboursList[3] = undefined;
          neighbours++;
        }

        if (this.actualState[i][k] === (x + 1)) {
          possibleNeighboursList[4] = undefined;
          neighbours++;
        }

        if (this.actualState[i][k] > (x + 1)) {
          break;
        }
      }
    }

    // Bottom
    if (this.actualState[i+1] !== undefined) {
      if (this.actualState[i+1][0] === (y + 1)) {
        for (k = this.bottomPointer; k < this.actualState[i+1].length; k++) {
          if (this.actualState[i+1][k] >= (x - 1)) {

            if (this.actualState[i+1][k] === (x - 1)) {
              possibleNeighboursList[5] = undefined;
              this.bottomPointer = k + 1;
              neighbours++;
            }

            if (this.actualState[i+1][k] === x) {
              possibleNeighboursList[6] = undefined;
              this.bottomPointer = k;
              neighbours++;
            }

            if (this.actualState[i+1][k] === (x + 1)) {
              possibleNeighboursList[7] = undefined;
                                
              if (k == 1) {
                this.bottomPointer = 1;
              } else {
                this.bottomPointer = k - 1;
              }

              neighbours++;
            }

            if (this.actualState[i+1][k] > (x + 1)) {
              break;
            }
          }
        }
      }
    }

    return neighbours;
  }


  /**
   *
   */
  isAlive (x, y) {
    var i, j;
  
    for (i = 0; i < this.actualState.length; i++) {
      if (this.actualState[i][0] === y) {
        for (j = 1; j < this.actualState[i].length; j++) {
          if (this.actualState[i][j] === x) {
            return true;
          }
        }
      }
    }
    return false;
  }


  /**
   *
   */
  removeCell (x, y, state) {
    var i, j;

    for (i = 0; i < state.length; i++) {
      if (state[i][0] === y) {

        if (state[i].length === 2) { // Remove all Row
          state.splice(i, 1);
        } else { // Remove Element
          for (j = 1; j < state[i].length; j++) {
            if (state[i][j] === x) {
              state[i].splice(j, 1);
            }
          }
        }

      }
    }
  }

  /**
   * 
   */
  addSpace () {
    let newPoint = this._getLastInsertionPoint() + 7;
    this.insertionPoints.push(newPoint)
  }

  carriageReturn () {
    this.insertionPoints.push(this.marginLeft)
    this.line += 1;
  }

  typeLetter (ltr) {
    try {
      this.addString(ltr);
      let newPoint = this._getLastInsertionPoint() + ltr.width + this.letterSpacing;
      this.insertionPoints.push(newPoint)
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 
   */

  addString (str) {
    var state, i, j, k, x, y, newLine;

    state = JSON.parse(str.code);

    if (this._getLastInsertionPoint()+str.width > this.columns - this.marginLeft) {
      newLine = true;
      this.line = this.line + 1;
      this.insertionPoints.push(this.marginLeft);
    } 


    for (i = 0; i < state.length; i++) {
      for (k in state[i]) {
        for (j = 0 ; j < state[i][k].length ; j++) {
          x = state[i][k][j] + this._getLastInsertionPoint();

          y = parseInt(k, 10) + this.marginTop + this.line*this.lineHeight+(this.lineHeight-state.length);

          this.addCell(x, y, this.actualState);
        }
      }
    }
  }

  deleteLetter () {
    var xPos, yPos, row;
    this.insertionPoints.pop();

    xPos = this._getLastInsertionPoint() - this.letterSpacing;
    yPos = this.line*this.lineHeight+this.marginTop+this.leading;
    

    if (yPos > this.actualState[this.actualState.length - 1][0]) {
      this.line--;
      yPos = this.line*this.lineHeight+this.marginTop+this.leading;
      
      this.insertionPoints.pop();
      xPos = this._getLastInsertionPoint() - this.letterSpacing;
    }

    
    // nested while loops going back from beginning and checking 

    // go through rows and delete all x values between prior and this insertion point
    let i = this.actualState.length-1
    do {

      let idx = this.actualState[i].length - 1;
      while (idx > 0 && this.actualState[i][idx] >= xPos) {
        this.removeCell(this.actualState[i][idx], this.actualState[i][0], this.actualState);
        idx--;
      }

      i--
    } while (i >= 0 && this.actualState[i][0] >= yPos)
  }

  _getLastInsertionPoint () {
    return this.insertionPoints[this.insertionPoints.length - 1];
  }

  /**
   *
   */
  addCell (x, y, state) {
    if (state.length === 0) {
      state.push([y, x]);
      return;
    }

    var k, n, m, tempRow, newState = [], added;

    if (y < state[0][0]) { // Add to Head
      newState = [[y,x]];
      for (k = 0; k < state.length; k++) {
        newState[k+1] = state[k];
      }

      for (k = 0; k < newState.length; k++) {
        state[k] = newState[k];
      }

      return;

    } else if (y > state[state.length - 1][0]) { // Add to Tail
      state[state.length] = [y, x];
      return;

    } else { // Add to Middle

      for (n = 0; n < state.length; n++) {
        if (state[n][0] === y) { // Level Exists
          tempRow = [];
          added = false;
          for (m = 1; m < state[n].length; m++) {
            if ((!added) && (x < state[n][m])) {
              tempRow.push(x);
              added = !added;
            }
            tempRow.push(state[n][m]);
          }
          tempRow.unshift(y);
          if (!added) {
            tempRow.push(x);
          }
          state[n] = tempRow;
          return;
        }

        if (y < state[n][0]) { // Create Level
          newState = [];
          for (k = 0; k < state.length; k++) {
            if (k === n) {
              newState[k] = [y,x];
              newState[k+1] = state[k];
            } else if (k < n) {
              newState[k] = state[k];
            } else if (k > n) {
              newState[k+1] = state[k];
            }
          }

          for (k = 0; k < newState.length; k++) {
            state[k] = newState[k];
          }
          return;
        }
      }
    }
  }
}


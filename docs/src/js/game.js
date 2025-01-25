/*jslint onevar: true, undef: false, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, newcap: true, immed: true  */

/**
 * 
 * Conway's Game of Life text editor by seths_typos
 * 
 * some code based on:
 * Game of Life - JS & CSS
 * http://pmav.eu
 * 04/Sep/2010
 */


class Game {

  constructor () {
    console.log("new game", this)
    let baseColor = '#111011';

    // Variables
    this.waitTime = 2;
    this.count = 0
    this.generation = 0;

    this.running = false;
    this.autoplay = false;
    this.insPointCounter = 0;
    this.currentText = [];
    this.lastSpace = 0;

    this.curAlpha = 1;

    // Clear state
    this.clear = false;

    // Trail state
    this.trail = true;

    // Grid style
    this.gridColor = baseColor;

    // Zoom level
    this.zoom = {
      current: "xl",
      xs:{
        cellSize : 1,
        cellSpace: 1
      },
      s:{
        cellSize : 2,
        cellSpace: 1
      },
      m:{
        cellSize : 3,
        cellSpace: 1
      },
      l:{
        cellSize : 4,
        cellSpace: 2
      },
      xl:{
        cellSize : 5,
        cellSpace: 3
      }
    };

    // Cell colors
    this.colors = {
      dead : baseColor,
      trail : ['#EE82EE', '#FF0000', '#FF7F00', '#FFFF00', '#008000 ', '#0000FF', '#4B0082'],
      ipColor : '#ffffff',
      alive : ['#E6E0EA','#E6E0EA', '#D2C8DA','#D2C8DA', '#BEB0CA','#BEB0CA', '#AA98BA','#AA98BA', '#9680AA','#9680AA', '#82689A','#82689A', '#6D5782','#6D5782', '#59476A', '#59476A','#443752', '#443752','#111011','#111011','#443752','#443752', '#59476A','#59476A', '#6D5782','#6D5782', '#82689A', '#82689A','#9680AA', '#9680AA','#AA98BA','#AA98BA', '#BEB0CA','#BEB0CA', '#D2C8DA','#D2C8DA','#E6E0EA','#E6E0EA']
    };

    // Font Metrics
    this.line = 0;
    this.marginTop = 10;
    this.marginLeft = 14;
    this.insertionPoints = [];
    this.letterSpacing = 1;
    this.capHeight = null;
    this.lineHeight = 10;
    this.leading = 4;

    // State
    this.actualState = null;
    this.progressEachStep = false;

    // Canvas Variables
    this.context = null;
    this.width = null;
    this.height = null;
    this._resetCellMetrics ();

    this.rows = null;
    this.columns = null;
    this.square = true;
    this.grid = false;

    // this.pastStates = []
    // this.pastAges = []
  }

 /** ****************************************************************************************************************************
   * Setup and Reset Functions
   */

  init () {
    try {
      this.initCanvas();

      this.actualState = new CellList({
        rows: this.rows,
        columns: this.columns
      });

      if (!this.grid) {
        this.setNoGridOn();
      }

      this.prepare();
    } catch (e) {
      console.log("Error: "+e);
    }
  }

  setCapHeight (ltr) {
    let v = JSON.parse(ltr.code)
    this.capHeight = v.length;
    this.lineHeight = this.capHeight + this.leading;
  }

  stopRunning () {
    this.running = false;
  }

  cleanUp () {
    this.generation = 0;
    this.line = 0;
    this.currentText = [];
    this.insertionPoints = [];
    this.actualState.reset(); 
    this.zoom.current = 'xl';
    this._resetCellMetrics ();
    this.prepare();
  }

 /** ****************************************************************************************************************************
   * Next Step
   */

  nextStep () {
    this.context.clearRect(0,0,this.width, this.height)

    // Algorithm run
    if (this.count == this.waitTime || !this.running) {
      var liveCellNumber = this.actualState.nextGeneration();

      this.count = 0;
    } else {
      this.count += 1;
    }

    this.generation += 1;

    this.redrawWorld();

    // Flow Control
    if (this.running) { 
      requestAnimationFrame(this.nextStep.bind(this));
    } else {
      if (this.clear) {
        this.cleanUp();
      }
    }
  }

  /** ****************************************************************************************************************************
   * Canvas and Drawing
   */

  initCanvas () {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    let offset = document.getElementById('controls').getBoundingClientRect();

    this.rows = Math.round(window.innerHeight / (this.cellSize + this.cellSpace));

    this.columns = Math.round((window.innerWidth*0.95) / (this.cellSize + this.cellSpace));

    this.marginLeft = Math.round(this.columns/7);
  }

  prepare () {
    this.clearWorld(); // Reset GUI
    this.drawWorld(); // Draw State
  }

  clearWorld () {
    this.insertionPoints = [this.marginLeft]

    this.actualState.clearAges();
  }

  redrawWorld () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCells();
  }

  drawWorld () {
    // Dynamic canvas size
    this.width = this._units(this.columns);
    this.canvas.setAttribute('width', this.width);

    this.height = this._units(this.rows);
    this.canvas.setAttribute('height', this.height);

    // Fill background
    this.context.fillStyle = this.gridColor;
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawCells();    
  }

  drawCells () {
    for (let row in this.actualState.cells) {
      if (row < this.rows) {
        for (let col of this.actualState.cells[row]) {
          if (col < this.columns) {
            try {
              this.drawCell(col, row, true);
            } catch (e) {
              this.running = false;
            }
          }
        }
      } 
    }
  }

  drawCell (i, j, alive) {
    if (alive) {
      this.context.fillStyle = this.colors.alive[this.actualState.age[i][j] % this.colors.alive.length];
    } else if (this.trail && this.actualState.age[i][j] < 0) {
      this.context.fillStyle = this.colors.schemes[this.colors.current].trail[(this.actualState.age[i][j] * -1) % this.colors.schemes[this.colors.current].trail.length];
    } else {
      this.context.fillStyle = this.colors.schemes[this.colors.current].dead;
    }
    
    if (this.square) {
      this.context.fillRect(this._processXCoord(i), this._processYCoord(j), this.cellSize, this.cellSize);
    } else {
      let iPos = this._processXCoord(i) + this.cellSize/2;
      let jPos = this._processYCoord(j) + this.cellSize/2;
      this.context.beginPath();
      this.context.arc(iPos, jPos, this.cellSize/2, 0, 2 * Math.PI);
      this.context.fill();
    }
  }

  setNoGridOn () {
    this.cellSpace = 0;
    this.cellSize = this.zoom[this.zoom.current]["cellSize"] + this.zoom[this.zoom.current]["cellSpace"];
  }

  setNoGridOff () {
    this.cellSpace = this.zoom[this.zoom.current]["cellSpace"];
    this.cellSize = this.zoom[this.zoom.current]["cellSize"];
  }

  /** ****************************************************************************************************************************
   * Typing
   */

  typeLetter (ltr, alignment) {
    if (this.progressEachStep) {
      this.actualState.nextGeneration();
    }

    if (ltr == "\\s") {
      this.addSpace();
    } else if (ltr == "\\n") {
      this.carriageReturn();
    } else {
      try {
        if (this._willBumpToNewLine(ltr)) {
          if (this.zoom.current !== 'xs' && this._nextLineIsMoreThanHalf()) {
            this._updateSize();
            
            this.redrawWorld();
          } else {
            for (let i = 0; i < this._getLastWordLength(); i++) {
              this.deleteLetter(false)  
            } 

            this.line = this.line + 1;
            this.insertionPoints.push(this.marginLeft);

            for (let i = this.lastSpace + 1; i < this.currentText.length; i++) {
              this.addString(this.currentText[i][0],this.currentText[i][1]);
            }
          }
        } 

        this.addString(ltr, alignment);
        this.currentText.push([ltr, alignment]);
      } catch (e) {
        console.log(e, ltr);
      }
    }
    
  }

  addString (str, alignment) {
    var code, i, j, k, x, y, adjustment = 0;

    code = JSON.parse(str.code);

    for (i = 0; i < code.length; i++) {
      for (k in code[i]) {
        for (j = 0 ; j < code[i][k].length ; j++) {
          x = code[i][k][j] + this._getLastInsertionPoint();

          y = parseInt(k, 10) + this.line*this.lineHeight + (this.capHeight-code.length);

          if (alignment === 't') {
            adjustment = this.lineHeight - code.length - this.leading
          } else if (alignment === 'm') {
            adjustment = Math.round((this.lineHeight - code.length - this.leading) / 2)
          }

          y = y - adjustment

          this.actualState.addCell(x, y);
        }
      }
    }

    let newPoint = this._getLastInsertionPoint() + str.width + this.letterSpacing;
    this.insertionPoints.push(newPoint);
  }

  addSpace () {
    if (this.progressEachStep) {
      this.actualState.nextGeneration();
    }

    let newPoint = this._getLastInsertionPoint() + 7;
    this.insertionPoints.push(newPoint)
    this.lastSpace = this.currentText.length;
    this.currentText.push(["\\s"]);
  }

  carriageReturn () {
    if (this.progressEachStep) {
      this.actualState.nextGeneration();
    }

    if (this.zoom.current !== 'xs' && this._nextLineIsMoreThanHalf()) {
      this._updateSize();
      
      this.redrawWorld();
    }

    this.insertionPoints.push(this.marginLeft)
    this.line += 1;
    this.lastSpace = this.currentText.length;
    this.currentText.push(["\\n"]);
  }

  deleteLetter (removeFromTracker) {
    var row;
    
    var xymax = this._trimInsertionPoints();
    
    if (xymax[2] == this.marginLeft) {
      this.line--;
      
      xymax = this._trimInsertionPoints();
    }

    if (removeFromTracker) {
      this.currentText.pop()
    }

    for (let i = xymax[1]; i <= this.actualState.highestRow; i++) {
      for (let j = xymax[0]; j <= xymax[2]; j++) {
        if (i in this.actualState.cells && this.actualState.cells[i].has(j)) {
          this.actualState.removeCell(i,j);
        }
      }
    }
  }

/** ****************************************************************************************************************************
 * Insertion Point
 */

  flashInsertionPoint() {
    if (this.insPointCounter < 40) {
      this._drawInsertionPoint(true);
    } else if (this.insPointCounter < 60) {
      this._drawInsertionPoint(false);
    } else {
      this.insPointCounter = 0;
    }

    this.insPointCounter++;

    if (!this.running) { 
      requestAnimationFrame(this.flashInsertionPoint.bind(this));
    }
  }

  _drawInsertionPoint (on) {
    let x = this._processXCoord(this._getLastInsertionPoint()),
        y = this._processYCoord(this._getLastLine() - this.leading/4),
        width = this.cellSize / 2,
        height = ((this.lineHeight - this.leading/2) * this.cellSpace) + ((this.lineHeight - this.leading/2) * this.cellSize);

        // console.log(x,y,width, height)
    this.context.fillStyle = on ? this.colors.ipColor : this.colors.dead;
    this.context.fillRect(x, y, width, height);
  }


/******************************************************************************************************************************
 * Helper functions
 */

  _willBumpToNewLine (str) {
    return this._getLastInsertionPoint()+str.width > this.columns - this.marginLeft;
  }

  _nextLineIsMoreThanHalf () {
    return this.line + 1 > Math.round(this.rows / (this.lineHeight + this.leading)) /  2;
  }

  _trimInsertionPoints () {
    let xMax = this.insertionPoints.pop();

    return [this._getLastInsertionPoint() - this.letterSpacing, this._getLastLine(), xMax];
  }

  _getLastWordLength () {
    return this.currentText.length - this.lastSpace;
  }

  _getLastInsertionPoint () {
    return this.insertionPoints[this.insertionPoints.length - 1];
  }

  _getLastLine () {
    return this.line*this.lineHeight;
  }

  _processXCoord (x) {
    let coord = this.cellSpace + this._units(x) - this.cellSpace / 2;

    return coord;
  }

  _processYCoord (y) {
    let coord = this.cellSpace + this._units(y) + this._units(this._getMidPoint() - (this.line+1)*this.capHeight / 2) - this.cellSpace / 2;

    return coord;
  }

  _units (val) {
    return (this.cellSpace * val) + (this.cellSize * val) 
  }

  _getMidPoint () {
    return Math.round(this.rows / 2);
  }

  _updateSize () {
    this._setSmallerSize();
    this.init();

    this.line = 0;

    let temp = this.currentText.slice()

    this.currentText = []

    for (const l in temp) {
      this.typeLetter(temp[l][0], temp[l][1]);
    }
  }

  _resetCellMetrics () {
    if (this.grid) {
      this.setNoGridOff();
    } else {
      this.setNoGridOn();
    }
  }

  _setSmallerSize () {
    switch (this.zoom.current) {
      case 'xl':
        this.zoom.current = 'l';
        break;
      case 'l':
        this.zoom.current = 'm';
        break;
      case 'm':
        this.zoom.current = 's';
        break;
      default:
        this.zoom.current = 'xs'
        break;
    }

    this._resetCellMetrics ();
  }

  _generateAnimationStatesAndAges () {
    let that = this, tempCells = {}, tempAges = {};

    Object.keys(this.actualState.cells).forEach(function(key, index) {
      tempCells[key] = JSON.stringify(Array.from(that.actualState.cells[key]));
    });

    Object.keys(this.actualState.age).forEach(function(key, index) {
      tempAges[key] = JSON.stringify(that.actualState.age[key]);
    });

    this.pastStates.push(JSON.stringify(tempCells))
    this.pastAges.push(JSON.stringify(tempAges))

    if (this.generation == 50) {
      console.log(window.URL.createObjectURL(new Blob(this.pastStates, {type: 'text/JSON'})));
      console.log(window.URL.createObjectURL(new Blob(this.pastAges, {type: 'text/JSON'})));
    }
  }

}

